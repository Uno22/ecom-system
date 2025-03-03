import { Module, Provider } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ORDER_REPOSITORY, ORDER_SERVICE } from './order.di-token';
import { OrderRepository } from './infras/oder.repo';
import { OrderItem } from './model/oder-item.model';
import { Order } from './model/order.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: ORDER_SERVICE, useClass: OrderService },
  { provide: ORDER_REPOSITORY, useClass: OrderRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem]), SharedModule],
  controllers: [OrderController],
  providers: [...dependencies],
})
export class OrderModule {}
