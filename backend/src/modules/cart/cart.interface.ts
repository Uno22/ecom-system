import { IRepository } from 'src/share/interfaces';
import {
  AddCartItemDto,
  CartDto,
  CondCartDto,
  CondCartItemDto,
  DeleteCartItemDto,
  RemoveCartItemDto,
  UpdateCartDto,
  UpdateCartItemDto,
} from './dto';
import { Cart } from './model/cart.model';
import { CartItem } from './model/cart-item.model';
import { CartProductDto } from './dto/cart-product.dto';

export interface ICartRepository
  extends IRepository<Cart, UpdateCartDto, CondCartDto> {}

export interface ICartItemRepository
  extends IRepository<CartItem, UpdateCartItemDto, CondCartItemDto> {
  deleteByCartId(cartId: string): Promise<boolean>;
  deleteCartItemByIds(ids: string[]): Promise<boolean>;
  deleteCartItemByCond(cond: any): Promise<boolean>;
}

export interface ICartProductRpc {
  findById(id: string): Promise<CartProductDto | null>;
  findByIds(
    ids: string[],
    attributes?: string[],
  ): Promise<Array<CartProductDto>>;
}

export interface ICartService {
  getActiveCart(userId: string): Promise<CartDto | null>;
  addProductToCart(payload: AddCartItemDto): Promise<boolean>;
  updateProductQuantityInCart(
    updateProductItemDto: UpdateCartItemDto,
  ): Promise<boolean>;
  removeProductFromCart(removeCartItemDto: RemoveCartItemDto): Promise<boolean>;
  deleteCart(cartId: string): Promise<boolean>;
  deleteCartItemByIds(deleteCartItemDto: DeleteCartItemDto): Promise<boolean>;
}
