import { Injectable } from '@nestjs/common';
import { ProductItemVariantDto, CondProductItemVariantDto } from '../dto';
import { IProductItemVariantRepository } from '../product-item-variant.interface';
import { ProductItemVariant } from '../product-item-variant.model';
import { CreateOptions, CreationAttributes, ModelStatic } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatus } from 'src/share/constants/enum';

@Injectable()
export class ProductItemVariantRepository
  implements IProductItemVariantRepository
{
  constructor(
    @InjectModel(ProductItemVariant)
    private readonly model: ModelStatic<ProductItemVariant>,
  ) {}

  async insert(
    data: CreationAttributes<ProductItemVariant>,
    options?: CreateOptions<ProductItemVariant>,
  ): Promise<ProductItemVariant | null> {
    return this.model.create(data, { raw: true, ...options });
  }

  async findByCond(
    cond: CondProductItemVariantDto,
    options?: CreateOptions<ProductItemVariant>,
  ): Promise<ProductItemVariant | null> {
    const data = await this.model.findOne({
      where: cond as any,
      raw: true,
      ...options,
    });
    if (!data) {
      return null;
    }

    return data as ProductItemVariant;
  }

  async findAll(
    cond: CondProductItemVariantDto,
  ): Promise<Array<ProductItemVariant>> {
    return this.model.findAll({ where: cond as any, raw: true });
  }

  async delete(id: string, isHardDelete?: boolean): Promise<boolean> {
    if (isHardDelete) {
      const deletedRow = await this.model.destroy({
        where: { id },
      } as any);
      return deletedRow > 0;
    }

    const [affectedRows] = await this.model.update(
      { status: ModelStatus.DELETED },
      { where: { id } } as any,
    );
    return affectedRows > 0;
  }

  async deleteByProductItemId(
    id: string,
    isHardDelete?: boolean,
  ): Promise<boolean> {
    if (isHardDelete) {
      const deletedRow = await this.model.destroy({
        where: { productItemId: id },
      } as any);
      return deletedRow > 0;
    }

    const [affectedRows] = await this.model.update(
      { status: ModelStatus.DELETED },
      { where: { productItemId: id } } as any,
    );
    return affectedRows > 0;
  }
}
