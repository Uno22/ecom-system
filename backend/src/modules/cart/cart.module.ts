import { Module, Provider } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './cart.service';
import {
  CART_ITEM_REPOSITORY,
  CART_PRODUCT_RPC,
  CART_REPOSITORY,
  CART_SERVICE,
} from './cart.di-token';
import { CartRepository } from './infras/cart.repo';
import { CartItemRepository } from './infras/cart-item.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from './model/cart-item.model';
import { Cart } from './model/cart.model';
import { CartProductRpc } from './rpc/cart-product.rpc';
import { ConfigService } from '@nestjs/config';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: CART_SERVICE, useClass: CartService },
  { provide: CART_REPOSITORY, useClass: CartRepository },
  { provide: CART_ITEM_REPOSITORY, useClass: CartItemRepository },
  {
    provide: CART_PRODUCT_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.productBaseUrl', '');
      const token: string = configService.get<string>('token.masterToken', '');
      return new CartProductRpc(url, token);
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [SequelizeModule.forFeature([Cart, CartItem]), SharedModule],
  controllers: [CartController],
  providers: [...dependencies],
})
export class CartModule {}
