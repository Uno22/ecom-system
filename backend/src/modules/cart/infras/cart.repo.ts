import { BaseRepository } from 'src/share/infras/base.repo';
import { CondCartDto, UpdateCartDto } from '../dto';
import { ICartRepository } from '../cart.interface';
import { Cart } from '../model/cart.model';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatic } from 'sequelize';

export class CartRepository
  extends BaseRepository<Cart, UpdateCartDto, CondCartDto>
  implements ICartRepository
{
  constructor(@InjectModel(Cart) readonly cartModel: ModelStatic<Cart>) {
    super(cartModel);
  }
}
