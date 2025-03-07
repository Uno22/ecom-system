import { BaseRepository } from 'src/share/infras/base.repo';
import { ICartItemRepository } from '../cart.interface';
import { UpdateCartItemDto, CondCartItemDto } from '../dto';
import { CartItem } from '../model/cart-item.model';
import { ModelStatic, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

export class CartItemRepository
  extends BaseRepository<CartItem, UpdateCartItemDto, CondCartItemDto>
  implements ICartItemRepository
{
  constructor(@InjectModel(CartItem) readonly model: ModelStatic<CartItem>) {
    super(model);
  }

  async deleteByCartId(cartId: string): Promise<boolean> {
    const deletedRow = await this.model.destroy({
      where: { cartId },
    } as any);
    return deletedRow > 0;
  }

  async deleteCartItemByIds(ids: string[]): Promise<boolean> {
    const deletedRow = await this.model.destroy({
      where: { id: { [Op.in]: ids } },
    } as any);
    return deletedRow > 0;
  }

  async deleteCartItemByCond(cond: any): Promise<boolean> {
    const deletedRow = await this.model.destroy({
      where: cond,
    } as any);
    return deletedRow > 0;
  }
}
