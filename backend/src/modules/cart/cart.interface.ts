import { IRepository } from 'src/share/interfaces';
import {
  AddCartItemDto,
  CondCartDto,
  CondCartItemDto,
  UpdateCartDto,
  UpdateCartItemDto,
} from './dto';
import { Cart } from './model/cart.model';
import { CartItem } from './model/cart-item.model';
import { CartProductDto } from './dto/cart-product.dto';

export interface ICartRepository
  extends IRepository<Cart, UpdateCartDto, CondCartDto> {}

export interface ICartItemRepository
  extends IRepository<CartItem, UpdateCartItemDto, CondCartItemDto> {}

export interface ICartProductRpc {
  findById(id: string): Promise<CartProductDto | null>;
  findByIds(ids: string[]): Promise<Array<CartProductDto>>;
}

export interface ICartService {
  addProductToCart(payload: AddCartItemDto): Promise<boolean>;
  updateProductQuantityInCart(
    updateProductItemDto: UpdateCartItemDto,
  ): Promise<boolean>;
}
