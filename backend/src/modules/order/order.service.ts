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
import {
  CreateOrderDto,
  OrderCartItemDto,
  OrderItemDto,
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
      let filteredCartItems: OrderCartItemDto[] = [];

      if (productItemIds?.length > 0) {
        for (const producItemId of productItemIds) {
          const cartItem = cartItems.find(
            (ci) => ci.productItemId === producItemId,
          );
          if (!cartItem) {
            throw new CustomBadRequestException(
              `Not found product item(${producItemId}) in cart`,
            );
          }
          filteredCartItems.push(cartItem);
        }
      } else {
        filteredCartItems = cartItems;
      }

      if (filteredCartItems.length === 0) {
        throw new CustomBadRequestException(
          'Cannot place an order with empty cart',
        );
      }

      const totalPrice = filteredCartItems.reduce(
        (total, item) => total + item.quantity * item.salePrice,
        shippingCost,
      );
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
        await this.orderRepo.delete(newOrderId, true);
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
      if (createOrderResult) {
        await this.orderRepo.delete(newOrderId, true);
      }
      throw error;
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
