import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from './order.di-token';
import { RemoteAuthGuard } from 'src/share/guards';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BrandListDto, OrderDto } from './dto';
import { InvalidQueryDataException } from 'src/share/exceptions';
import { IOrderService } from './order.interface';

@Controller('orders')
@UseGuards(RemoteAuthGuard)
@ApiTags('04. Order')
@ApiBearerAuth()
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderService: IOrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created.',
    type: OrderDto,
  })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const { sub: userId } = req.user;
    return this.orderService.create(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10 })
  @ApiResponse({
    status: 200,
    description: 'Return all orders.',
    type: BrandListDto,
  })
  findAll(@Req() req) {
    const { page, limit } = req.query;
    const paging = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };
    if (
      isNaN(paging.page) ||
      isNaN(paging.limit) ||
      paging.page < 1 ||
      paging.limit < 1
    ) {
      throw new InvalidQueryDataException();
    }

    return this.orderService.findAll({}, paging);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get order status by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return order status by id.',
  })
  findStatus(@Param('id') id: string) {
    return this.orderService.findStatus(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a order by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return a order by id.',
    type: OrderDto,
  })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
