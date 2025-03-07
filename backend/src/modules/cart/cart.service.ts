import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CART_CONSUMER,
  CART_ITEM_REPOSITORY,
  CART_PRODUCER,
  CART_PRODUCT_RPC,
  CART_REPOSITORY,
} from './cart.di-token';
import {
  ICartItemRepository,
  ICartProductRpc,
  ICartRepository,
  ICartService,
} from './cart.interface';
import {
  AddCartItemDto,
  CartDto,
  DeleteCartItemDto,
  RemoveCartItemDto,
  UpdateCartItemDto,
} from './dto';
import { ModelStatus } from 'src/share/constants/enum';
import { Cart } from './model/cart.model';
import { CreationAttributes } from 'sequelize';
import { v7 } from 'uuid';
import {
  CartCreationFailedException,
  DataNotFoundException,
  ProductInsufficientQuantityException,
} from 'src/share/exceptions';
import { CartItem } from './model/cart-item.model';
import { CartProductDto } from './dto/cart-product.dto';
import { CartProducer } from './kafka/cart.producer';
import { CartConsumer } from './kafka/cart.consumer';
import { IOrderMessage } from 'src/share/interfaces';
import { KafkaConsumerConfig } from 'src/share/kafka/kafka.constants';

@Injectable()
export class CartService implements ICartService, OnModuleInit {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepo: ICartItemRepository,
    @Inject(CART_PRODUCT_RPC)
    private readonly cartProductRepo: ICartProductRpc,
    @Inject(CART_PRODUCER)
    private readonly cartProducer: CartProducer,
    @Inject(CART_CONSUMER)
    private readonly cartConsumer: CartConsumer,
  ) {}

  async onModuleInit() {
    await this.cartConsumer.init([
      {
        groupId: KafkaConsumerConfig.cart.verifyCart.groupId,
        topic: KafkaConsumerConfig.cart.verifyCart.topic,
        cb: this.handleVerifyCart.bind(this),
      },
    ]);
  }

  async getActiveCart(userId: string): Promise<CartDto | null> {
    const activeCart = await this.cartRepo.findByCond(
      {
        userId,
        status: ModelStatus.ACTIVE,
      },
      {
        raw: false,
        include: [
          {
            model: CartItem,
          },
        ],
      },
    );

    if (!activeCart) {
      //throw new DataNotFoundException('Cart not found');
      return null;
    }

    const productItemIds = activeCart.cartItems?.map(
      ({ productItemId }) => productItemId,
    );

    if (productItemIds && productItemIds.length > 0) {
      const products = await this.cartProductRepo.findByIds(productItemIds, [
        'id',
        'name',
        'salePrice',
        'price',
        'quantity',
        'reservedQuantity',
      ]);

      const mappedProducts = new Map<string, CartProductDto>();
      products.forEach((product) => {
        mappedProducts.set(product.id, product);
      });

      activeCart.cartItems = activeCart.cartItems?.map((item) => {
        const product = mappedProducts.get(item.productItemId) || ({} as any);
        return {
          ...item,
          name: product.name || '',
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          attributes: product.attributes || [],
        };
      }) as any;
    }

    return activeCart;
  }

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
        throw new ProductInsufficientQuantityException();
      }

      await this.cartItemRepo.update(currentCartItem.id, {
        quantity: quantityUserWantToBuy,
      });
    } else {
      const quantityUserWantToBuy = newQuantity;
      if (quantityInDB < quantityUserWantToBuy) {
        throw new ProductInsufficientQuantityException();
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

  async updateProductQuantityInCart(
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<boolean> {
    const { userId, productItemId, quantity } = updateCartItemDto;

    // find active cart for authenciated user
    const activeCart = await this.cartRepo.findByCond({
      userId,
      status: ModelStatus.ACTIVE,
    });
    if (!activeCart) {
      throw new DataNotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepo.findByCond({
      cartId: activeCart.id,
      productItemId,
    });

    if (!cartItem) {
      throw new DataNotFoundException('Product not found in cart');
    }

    const product = await this.cartProductRepo.findById(productItemId!);
    if (!product) {
      throw new DataNotFoundException('Product not found');
    }

    const quantityInDB = product.quantity - (product.reservedQuantity || 0);
    const quantityUserWantToBuy = quantity!;

    if (quantityInDB < quantityUserWantToBuy) {
      throw new ProductInsufficientQuantityException();
    }

    if (quantityUserWantToBuy === 0) {
      await this.cartItemRepo.delete(cartItem.id, true);
      return true;
    }

    await this.cartItemRepo.update(cartItem.id, {
      quantity: quantityUserWantToBuy,
    });

    return true;
  }

  async removeProductFromCart(
    removeCartItemDto: RemoveCartItemDto,
  ): Promise<boolean> {
    const { userId, productItemId } = removeCartItemDto;

    const activeCart = await this.cartRepo.findByCond({
      userId,
      status: ModelStatus.ACTIVE,
    });

    if (!activeCart) {
      throw new DataNotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepo.findByCond({
      cartId: activeCart.id,
      productItemId,
    });

    if (!cartItem) {
      throw new DataNotFoundException('Product not found in cart');
    }

    await this.cartItemRepo.delete(cartItem.id, true);

    return true;
  }

  async deleteCart(cartId: string): Promise<boolean> {
    const isHardDelete = true;
    const deleteResult = await this.cartRepo.delete(cartId, isHardDelete);
    if (isHardDelete) {
      await this.cartItemRepo.deleteByCartId(cartId);
    }
    return deleteResult;
  }

  async deleteCartItemByIds(
    deleteCartItemDto: DeleteCartItemDto,
  ): Promise<boolean> {
    return this.cartItemRepo.deleteCartItemByIds(deleteCartItemDto.ids);
  }

  async handleVerifyCart(message: IOrderMessage) {
    console.log('handleVerifyCart msg', message);
    await this.cartProducer.verifiedCart(message);
    //await this.cartProducer.verifyCartFailed(message);
  }
}
