import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CART_SERVICE } from '../cart.di-token';
import { CartDto, DeleteCartItemDto, GetInternalCartDto } from '../dto';
import { AuthInternalGuard } from 'src/share/guards';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ICartService } from '../cart.interface';

@Controller({ path: 'internal/carts', version: '1' })
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete cart',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Cart was deleted successful',
    type: Boolean,
  })
  async deleteCart(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }

  @Post('/items/delete')
  @ApiOperation({
    summary: 'Delete cart item by list of id',
  })
  @ApiBody({ type: DeleteCartItemDto })
  @ApiResponse({
    status: 200,
    description: 'Cart Items were deleted successful',
    type: Boolean,
  })
  async deleteCartItemByIds(@Body() payload: DeleteCartItemDto) {
    return this.cartService.deleteCartItemByIds(payload);
  }
}
