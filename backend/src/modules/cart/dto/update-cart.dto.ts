import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart.dto';

export class UpdateCartDto {}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
