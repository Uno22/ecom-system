import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  IOrderCartRpc,
  IOrderProductRpc,
  IOrderRepository,
  IOrderService,
} from './order.interface';
import {
  ORDER_CART_RPC,
  ORDER_CONSUMER,
  ORDER_PRODUCER,
  ORDER_PRODUCT_RPC,
  ORDER_REPOSITORY,
} from './order.di-token';
import {
  CondOrderDto,
  CreateOrderDto,
  OrderItemDto,
  ResponseCreateOrderDto,
  UpdateOrderDto,
} from './dto';
import {
  CustomBadRequestException,
  CustomConflictException,
  CustomNotFoundException,
} from 'src/share/exceptions';
import { v7 } from 'uuid';
import { generateRandomString } from 'src/share/utils';
import { OrderStatus, PaymentStatus } from 'src/share/constants/enum';
import { OrderItem } from './model/oder-item.model';
import { PagingDto } from 'src/share/dto';
import { OrderProducer } from './kafka/order.producer';
import { RedisService } from 'src/share/cache/redis.service';
import { REDIS_SERVER } from 'src/share/constants/di-token';
import { OrderConsumer } from './kafka/order.consumer';
import { IOrderMessage } from 'src/share/interfaces';
import { KafkaConsumerConfig } from 'src/share/kafka/kafka.constants';

@Injectable()
export class OrderService implements IOrderService, OnModuleInit {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: IOrderRepository,
    @Inject(ORDER_CART_RPC) private readonly orderCartRepo: IOrderCartRpc,
    @Inject(ORDER_PRODUCT_RPC)
    private readonly orderProductRepo: IOrderProductRpc,
    @Inject(ORDER_PRODUCER)
    private readonly orderProducer: OrderProducer,
    @Inject(ORDER_CONSUMER)
    private readonly orderConsumer: OrderConsumer,
    @Inject(REDIS_SERVER) private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    const {
      createOrder,
      confirmOrder,
      updateOrderFailed,
      orderCreationFailed,
    } = KafkaConsumerConfig.order;
    await this.orderConsumer.init([
      {
        groupId: createOrder.groupId,
        topic: createOrder.topic,
        cb: this.handleCreateOrder.bind(this),
      },
      {
        groupId: confirmOrder.groupId,
        topic: confirmOrder.topic,
        cb: this.handleConfirmOrder.bind(this),
      },
      {
        groupId: updateOrderFailed.groupId,
        topic: updateOrderFailed.topic,
        cb: this.handleUpdateOrderWhileProductDeductFailed.bind(this),
      },
      {
        groupId: orderCreationFailed.groupId,
        topic: orderCreationFailed.topic,
        cb: this.handleOrderCreationFailed.bind(this),
      },
    ]);
  }

  async createOldVersion(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<string> {
    const { shippingCost } = createOrderDto;
    const productItemIds: any = [];
    const newOrderId = v7();
    let createOrderResult = false;
    try {
      const cart = await this.orderCartRepo.getCartByUserId(userId);
      if (!cart) {
        throw new CustomNotFoundException('Cart not found');
      }
      const cartItems = cart.cartItems || [];
      const filteredCartItems =
        productItemIds?.length > 0
          ? cartItems.filter((ci) => productItemIds.includes(ci.productItemId))
          : cartItems;
      if (
        filteredCartItems.length !==
        (productItemIds?.length || cartItems.length)
      ) {
        throw new CustomBadRequestException(
          'Some product items are not in the cart',
        );
      }

      const productTotal = filteredCartItems.reduce(
        (total, item) => total + item.quantity * item.salePrice,
        0,
      );
      const totalPrice = productTotal + (shippingCost || 0);
      const orderItems: OrderItemDto[] = filteredCartItems.map((item) => ({
        ...item,
        id: v7(),
        orderId: newOrderId,
      }));
      const newOrder: any = {
        ...createOrderDto,
        id: newOrderId,
        userId: userId,
        paymentStatus: PaymentStatus.PENDING,
        totalPrice,
        trackingNumber: generateRandomString(10),
        orderItems: orderItems as any,
        status: OrderStatus.PENDING,
        history: [
          {
            status: OrderStatus.PENDING,
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createOrderResult = await this.orderRepo.insert(newOrder);
      if (!createOrderResult) {
        throw new CustomBadRequestException('Failed to create order');
      }

      const productItems = filteredCartItems.map((item) => ({
        productItemId: item.productItemId,
        reserveQuantity: item.quantity,
      }));

      const reserveResult =
        await this.orderProductRepo.reserveProduct(productItems);

      if (!reserveResult) {
        createOrderResult = false;
        throw new CustomConflictException(
          'Failed to reserve product',
          'PRODUCT_RESERVE_ERROR',
        );
      }

      const cartItemIds = filteredCartItems.map((ci) => ci.id);
      await this.orderCartRepo.deleteCartItemByIds(cartItemIds);

      return newOrderId;
    } catch (error) {
      console.error(
        `[ERROR] ********** creating order for user ${userId}:`,
        error,
      );
      if (createOrderResult) {
        await this.orderRepo.delete(newOrderId, true);
      }
      throw error;
    }
  }

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<ResponseCreateOrderDto> {
    const orderId = v7();
    const shortMessage = {
      userId,
      orderId,
      status: OrderStatus.PENDING,
      productItems: createOrderDto.productItems,
    };
    const fullMessage = {
      ...createOrderDto,
      ...shortMessage,
    };

    await this.redisService.setOrder(orderId, shortMessage);

    await this.orderProducer.startedOrder(fullMessage);

    return {
      orderId,
      status: OrderStatus.PENDING,
      message: 'received request order',
    };
  }

  async findAll(cond: CondOrderDto, paging: PagingDto) {
    return this.orderRepo.list(cond, paging, {
      raw: false,
      include: [
        {
          model: OrderItem,
        },
      ],
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.get(id, {
      raw: false,
      include: [
        {
          model: OrderItem,
        },
      ],
    });
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async handleCreateOrder(message: IOrderMessage) {
    console.log('handleCreateOrder msg', message);
    await this.orderProducer.createdOrder(message);
    // await this.orderProducer.createOrderFailed(message);
  }

  async handleConfirmOrder(message: IOrderMessage) {
    console.log('handleConfirmOrder msg', message);
  }

  async handleUpdateOrderWhileProductDeductFailed(message: IOrderMessage) {
    console.log('handleUpdateOrderWhileProductDeductFailed msg', message);
  }

  async handleOrderCreationFailed(message: IOrderMessage) {
    console.log('handleOrderCreationFailed msg', message);
  }
}
