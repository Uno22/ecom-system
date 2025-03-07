import { Module, Provider } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {
  ORDER_CART_RPC,
  ORDER_CONSUMER,
  ORDER_PRODUCER,
  ORDER_PRODUCT_RPC,
  ORDER_REPOSITORY,
  ORDER_SERVICE,
} from './order.di-token';
import { OrderRepository } from './infras/oder.repo';
import { OrderItem } from './model/oder-item.model';
import { Order } from './model/order.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from 'src/share/share.module';
import { ConfigService } from '@nestjs/config';
import { OrderCartRpc } from './rpc/order-cart.rpc';
import { OrderProductRpc } from './rpc/order-product.rpc';
import { OrderProducer } from './kafka/order.producer';
import { OrderConsumer } from './kafka/order.consumer';

const dependencies: Provider[] = [
  { provide: ORDER_SERVICE, useClass: OrderService },
  { provide: ORDER_REPOSITORY, useClass: OrderRepository },
  {
    provide: ORDER_CART_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.cartBaseUrl', '');
      const token: string = configService.get<string>(
        'jwtToken.masterToken',
        '',
      );
      return new OrderCartRpc(url, token);
    },
    inject: [ConfigService],
  },
  {
    provide: ORDER_PRODUCT_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.productBaseUrl', '');
      const token: string = configService.get<string>(
        'jwtToken.masterToken',
        '',
      );
      return new OrderProductRpc(url, token);
    },
    inject: [ConfigService],
  },
  {
    provide: ORDER_PRODUCER,
    useClass: OrderProducer,
  },
  {
    provide: ORDER_CONSUMER,
    useClass: OrderConsumer,
  },
];

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem]), SharedModule],
  controllers: [OrderController],
  providers: [...dependencies],
})
export class OrderModule {}
