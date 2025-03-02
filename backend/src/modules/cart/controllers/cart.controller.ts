import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CART_SERVICE } from '../cart.di-token';
import { CartService } from '../cart.service';
import { AddCartItemDto } from '../dto';
import { RemoteAuthGuard } from 'src/share/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('carts')
@UseGuards(RemoteAuthGuard)
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(
    @Inject(CART_SERVICE) private readonly cartService: CartService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add a product to cart and create if cart not found',
  })
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({
    status: 201,
    description: 'Product was added to cart.',
    type: Boolean,
  })
  async addProductToCart(@Body() addCartItemDto: AddCartItemDto, @Req() req) {
    const { sub: userId } = req.user;
    const payload = { ...addCartItemDto, userId };
    return this.cartService.addProductToCart(payload);
  }
}
