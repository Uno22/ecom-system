import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderCartRpc,
  IOrderProductRpc,
  IOrderRepository,
  IOrderService,
} from './order.interface';
import {
  ORDER_CART_RPC,
  ORDER_PRODUCT_RPC,
  ORDER_REPOSITORY,
} from './order.di-token';
import { CreateOrderDto, OrderItemDto, UpdateOrderDto } from './dto';
import {
  CustomBadRequestException,
  CustomConflictException,
  CustomNotFoundException,
} from 'src/share/exceptions';
import { v7 } from 'uuid';
import { generateRandomString } from 'src/share/utils';
import { OrderStatus, PaymentStatus } from 'src/share/constants/enum';
import { OrderItem } from './model/oder-item.model';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: IOrderRepository,
    @Inject(ORDER_CART_RPC) private readonly orderCartRepo: IOrderCartRpc,
    @Inject(ORDER_PRODUCT_RPC)
    private readonly orderProductRepo: IOrderProductRpc,
  ) {}

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<string> {
    const { productItemIds, shippingCost } = createOrderDto;
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

  findAll() {
    return `This action returns all order`;
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
}
