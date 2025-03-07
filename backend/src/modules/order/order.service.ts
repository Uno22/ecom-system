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
  DataNotFoundException,
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
import { Order } from './model/order.model';

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
    const { createOrder, confirmOrder, updateOrderFailed, orderDLQ } =
      KafkaConsumerConfig.order;
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
        groupId: orderDLQ.groupId,
        topic: orderDLQ.topic,
        cb: () => {},
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

  async findOne(id: string): Promise<Order | null> {
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

  async findStatus(id: string) {
    const orderInCache = await this.redisService.getOrder(id);
    let orderObj;

    try {
      orderObj = orderInCache ? JSON.parse(orderInCache) : null;
    } catch (error) {}

    if (!orderObj) {
      const orderInDB = await this.orderRepo.get(id);
      if (orderInDB) {
        orderObj = orderInDB;
        await this.redisService.setOrder(id, {
          orderId: id,
          userId: orderInDB.userId,
          status: orderInDB.status,
        });
      }
    }

    if (!orderObj) {
      throw new DataNotFoundException('Order not found');
    }

    return {
      orderId: id,
      userId: orderObj.userId,
      status: orderObj.status,
      message: orderObj.message || '',
    };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async handleCreateOrder(message: IOrderMessage) {
    const { userId, orderId, productItems, shippingCost } = message;

    try {
      const productTotal = productItems.reduce(
        (total, item) => total + item.quantity * item.price!,
        0,
      );
      const totalPrice = productTotal + (shippingCost || 0);

      const orderItems: OrderItemDto[] = productItems.map((item) => ({
        id: v7(),
        orderId,
        productItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        salePrice: item.salePrice,
      }));

      const newOrder: any = {
        ...message,
        id: orderId,
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

      const createOrderResult = await this.orderRepo.insert(newOrder);
      if (!createOrderResult) {
        throw new CustomBadRequestException('Failed to create order');
      }

      await this.orderProducer.createdOrder(message);
    } catch (error) {
      console.error('[ERROR] ****** handleCreateOrder error', error);

      await this.redisService.setOrder(orderId, {
        userId,
        orderId,
        status: OrderStatus.REJECTED,
        productItems: productItems,
        message: error.message,
      });

      await this.orderProducer.createOrderFailed(message);
    }
  }

  async handleConfirmOrder(message: IOrderMessage) {
    const { orderId } = message;

    const updateResult = await this.orderRepo.update(orderId, {
      status: OrderStatus.CONFIRMED,
    } as any);

    if (!updateResult) {
      console.error(
        `[ERROR] ******* Failed to update order(${orderId}) status to ${OrderStatus.CONFIRMED}`,
      );
      await this.orderProducer.sendDLQMessage({
        ...message,
        message: `Failed to update order(${orderId}) status to ${OrderStatus.CONFIRMED}`,
      });
    }
  }

  async handleUpdateOrderWhileProductDeductFailed(message: IOrderMessage) {
    const { orderId } = message;

    const updateResult = await this.orderRepo.update(orderId, {
      status: OrderStatus.CANCELED,
    } as any);

    if (!updateResult) {
      console.error(
        `[ERROR] ******* Failed to update order(${orderId}) status to ${OrderStatus.CANCELED}`,
      );
      await this.orderProducer.sendDLQMessage({
        ...message,
        message: `Failed to update order(${orderId}) status to ${OrderStatus.CANCELED}`,
      });
    }
  }
}
