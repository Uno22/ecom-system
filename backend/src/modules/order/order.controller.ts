import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from './order.di-token';
import { RemoteAuthGuard } from 'src/share/guards';

@Controller('orders')
@UseGuards(RemoteAuthGuard)
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderService: OrderService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const { sub: userId } = req.user;
    return this.orderService.create(userId, createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
