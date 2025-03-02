import { Inject, Injectable } from '@nestjs/common';
import {
  CART_ITEM_REPOSITORY,
  CART_PRODUCT_RPC,
  CART_REPOSITORY,
} from './cart.di-token';
import {
  ICartItemRepository,
  ICartProductRpc,
  ICartRepository,
} from './cart.interface';
import { AddCartItemDto } from './dto';
import { ModelStatus } from 'src/share/constants/enum';
import { Cart } from './model/cart.model';
import { CreationAttributes } from 'sequelize';
import { v7 } from 'uuid';
import {
  CartCreationFailedException,
  CustomBadRequestException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { CartItem } from './model/cart-item.model';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepo: ICartItemRepository,
    @Inject(CART_PRODUCT_RPC)
    private readonly cartProductRepo: ICartProductRpc,
  ) {}

  async addProductToCart(payload: AddCartItemDto): Promise<boolean> {
    const { userId, productItemId, quantity: newQuantity } = payload;

    const activeCart = await this.cartRepo.findByCond({
      userId,
      status: ModelStatus.ACTIVE,
    });

    let cartId = v7();
    if (!activeCart) {
      const createCartResult = await this.cartRepo.insert({
        id: cartId,
        userId,
        status: ModelStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CreationAttributes<Cart>);

      if (!createCartResult) {
        throw new CartCreationFailedException();
      }
    } else {
      cartId = activeCart.id;
    }

    const product = await this.cartProductRepo.findById(productItemId);
    if (!product) {
      throw new DataNotFoundException('Product not found');
    }

    const currentCartItem = await this.cartItemRepo.findByCond({
      cartId,
      productItemId,
    });

    const quantityInDB = product.quantity - (product.reservedQuantity || 0);
    if (currentCartItem) {
      const quantityUserWantToBuy = currentCartItem.quantity + newQuantity;
      if (quantityInDB < quantityUserWantToBuy) {
        throw new CustomBadRequestException(
          'Product is not available in sufficient quantity',
          'PRODUCT_SUFFICIENT_QUANTITY',
        );
      }

      await this.cartItemRepo.update(currentCartItem.id, {
        quantity: quantityUserWantToBuy,
      });
    } else {
      const quantityUserWantToBuy = newQuantity;
      if (quantityInDB < quantityUserWantToBuy) {
        throw new CustomBadRequestException(
          'Product is not available in sufficient quantity',
          'PRODUCT_SUFFICIENT_QUANTITY',
        );
      }

      await this.cartItemRepo.insert({
        id: v7(),
        cartId,
        productItemId,
        quantity: quantityUserWantToBuy,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CreationAttributes<CartItem>);
    }

    return true;
  }
}
