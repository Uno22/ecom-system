import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op } from 'sequelize';
import { ModelStatus } from 'src/share/constants/enum';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';
import { UpdateProductDto, CondProductDto } from '../dto';
import { Product } from '../model/product.model';
import { IProductRepository } from '../product.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(@InjectModel(Product) private model: typeof Product) {}

  async insert(data: CreationAttributes<Product>): Promise<Product | null> {
    return (await this.model.create(data)).toJSON() as Product;
  }

  async update(id: string, data: UpdateProductDto): Promise<boolean> {
    const [affectedRows] = await this.model.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }

  async delete(id: string, isHardDelete: boolean): Promise<boolean> {
    if (isHardDelete) {
      const deletedRow = await this.model.destroy({
        where: { id },
      });
      return deletedRow > 0;
    }

    const [affectedRows] = await this.model.update(
      { status: ModelStatus.DELETED },
      { where: { id } },
    );
    return affectedRows > 0;
  }

  async get(id: string, options?: object): Promise<Product | null> {
    const findOptions = { raw: true, ...options };
    const data: any = await this.model.findByPk(id, findOptions);
    if (!data) {
      return null;
    }

    let rawData = data;
    if (data._previousDataValues) {
      rawData = rawData.get({ plain: true });
    }
    const { created_at, updated_at, ...props } = rawData;

    return {
      ...props,
      createdAt: rawData.created_at || rawData.createdAt,
      updatedAt: rawData.updated_at || rawData.updatedAt,
    } as Product;
  }

  async list(
    cond: CondProductDto,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Product>> {
    const { limit, page } = paging;
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };
    const findOptions = {
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
      raw: true,
      ...options,
    } as any;
    const { count, rows } = await this.model.findAndCountAll(findOptions);
    let rawData = rows;
    if (rawData.length && (rawData[0] as any)._previousDataValues) {
      rawData = rawData.map((data) => data.get({ plain: true }));
    }

    return {
      data: rawData.map((data: any) => {
        const { created_at, updated_at, ...props } = data;
        return {
          ...props,
          createdAt: created_at,
          updatedAt: updated_at,
        } as Product;
      }),
      total: count,
    };
  }

  async findByCond(cond: CondProductDto): Promise<Product | null> {
    const data = await this.model.findOne({
      where: cond as any,
      raw: true,
    });
    if (!data) {
      return null;
    }

    return data as Product;
  }
}
