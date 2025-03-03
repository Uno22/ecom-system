import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CART_SERVICE } from '../cart.di-token';
import { CartDto, GetInternalCartDto } from '../dto';
import { AuthInternalGuard } from 'src/share/guards';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICartService } from '../cart.interface';

@Controller('internal/carts')
@UseGuards(AuthInternalGuard)
@ApiTags('Internal Cart')
export class CartInternalController {
  constructor(
    @Inject(CART_SERVICE) private readonly cartService: ICartService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Get active cart',
  })
  @ApiBody({ type: GetInternalCartDto })
  @ApiResponse({
    status: 200,
    description: 'Resposne active cart or null',
    type: CartDto || null,
  })
  async getActiveCart(@Body() body) {
    return this.cartService.getActiveCart(body.userId);
  }
}
