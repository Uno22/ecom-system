import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CART_SERVICE } from '../cart.di-token';
import {
  AddCartItemDto,
  CartDto,
  RemoveCartItemDto,
  UpdateCartItemDto,
} from '../dto';
import { RemoteAuthGuard } from 'src/share/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ICartService } from '../cart.interface';

@Controller('carts')
@UseGuards(RemoteAuthGuard)
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(
    @Inject(CART_SERVICE) private readonly cartService: ICartService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get active cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Resposne active cart or null',
    type: CartDto || null,
  })
  async getActiveCart(@Req() req) {
    const { sub: userId } = req.user;
    return this.cartService.getActiveCart(userId);
  }

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

  @Post('update-product-quantity')
  @ApiOperation({
    summary: 'Update quantity of product in cart',
  })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({
    status: 200,
    description: 'The product quantity updated successful',
    type: Boolean,
  })
  updateProductQuantityInCart(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req,
  ) {
    const { sub: userId } = req.user;
    updateCartItemDto.userId = userId;
    return this.cartService.updateProductQuantityInCart(updateCartItemDto);
  }

  @Delete('remove-product')
  @ApiOperation({
    summary: 'Remove product from cart',
  })
  @ApiBody({ type: RemoveCartItemDto })
  @ApiResponse({
    status: 200,
    description: 'The product was removed successful',
    type: Boolean,
  })
  removeProductFromCart(
    @Body() removeCartItemDto: RemoveCartItemDto,
    @Req() req,
  ) {
    const { sub: userId } = req.user;
    removeCartItemDto.userId = userId;
    return this.cartService.removeProductFromCart(removeCartItemDto);
  }
}
