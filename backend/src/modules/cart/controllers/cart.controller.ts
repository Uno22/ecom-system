import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ICartService } from '../cart.interface';

@Controller({ path: 'carts', version: '1' })
@UseGuards(RemoteAuthGuard)
@ApiTags('03. Cart')
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

  @Post(':cartItemId')
  @ApiOperation({
    summary: 'Update quantity of product in cart',
  })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiParam({ name: 'cartItemId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The product quantity updated successful',
    type: Boolean,
  })
  updateProductQuantityInCart(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req,
    @Param('cartItemId') cartItemId: string,
  ) {
    const { sub: userId } = req.user;
    updateCartItemDto.userId = userId;
    updateCartItemDto.cartItemId = cartItemId;
    return this.cartService.updateProductQuantityInCart(updateCartItemDto);
  }

  @Delete(':cartItemId')
  @ApiOperation({
    summary: 'Remove product from cart',
  })
  @ApiParam({ name: 'cartItemId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The product was removed successful',
    type: Boolean,
  })
  removeProductFromCart(@Param('cartItemId') cartItemId: string, @Req() req) {
    const { sub: userId } = req.user;
    return this.cartService.removeProductFromCart({ userId, cartItemId });
  }
}
