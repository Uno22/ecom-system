import {
  CreationAttributes,
  CreateOptions,
  Op,
  ModelStatic,
  FindOptions,
} from 'sequelize';
import { Model } from 'sequelize-typescript';
import { ModelStatus } from '../constants/enum';
import { PagingDto } from '../dto';
import { IRepository, IListEntity } from '../interfaces';

export class BaseRepository<Entity extends Model, UpdateDto, CondDto>
  implements IRepository<Entity, UpdateDto, CondDto>
{
  constructor(readonly model: ModelStatic<Entity>) {}

  async insert(
    data: CreationAttributes<Entity>,
    options?: CreateOptions<Entity>,
  ): Promise<Entity | null> {
    return this.model.create(data, { raw: true, ...options });
  }

  async update(id: string, data: UpdateDto): Promise<boolean> {
    const [affectedRows] = await this.model.update(data, {
      where: { id },
    } as any);
    return affectedRows > 0;
  }

  async delete(id: string, isHardDelete: boolean): Promise<boolean> {
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

  async get(id: string, options?: object): Promise<Entity | null> {
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
    } as Entity;
  }

  async list(
    cond: CondDto,
    paging: PagingDto,
    options: object,
  ): Promise<IListEntity<Entity>> {
    const { limit, page } = paging;
    const { type, ...restOptions } = (options || {}) as any;
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };
    const findOptions = {
      where: condSQL,
      ...(type !== 'all' && {
        limit,
        offset: (page - 1) * limit,
      }),
      order: [['id', 'DESC']],
      raw: true,
      distinct: true,
      ...restOptions,
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
        } as Entity;
      }),
      total: count,
    };
  }

  async findByCond(
    cond: CondDto,
    options?: FindOptions<Entity>,
  ): Promise<Entity | null> {
    const data = await this.model.findOne({
      where: cond as any,
      raw: true,
      ...options,
    });
    if (!data) {
      return null;
    }

    if ((data as any)._previousDataValues) {
      return data.get({ plain: true });
    }

    return data as Entity;
  }
}
