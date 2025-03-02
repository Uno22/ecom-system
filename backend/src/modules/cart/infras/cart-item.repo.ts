import { BaseRepository } from 'src/share/infras/base.repo';
import { ICartItemRepository } from '../cart.interface';
import { UpdateCartItemDto, CondCartItemDto } from '../dto';
import { CartItem } from '../model/cart-item.model';
import { ModelStatic } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

export class CartItemRepository
  extends BaseRepository<CartItem, UpdateCartItemDto, CondCartItemDto>
  implements ICartItemRepository
{
  constructor(@InjectModel(CartItem) readonly model: ModelStatic<CartItem>) {
    super(model);
  }
}
