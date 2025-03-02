import {
  Controller,
  Inject,
  Get,
  UseGuards,
  Post,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PRODUCT_ITEM_SERVICE } from '../product-item.di-token';
import { IProductItemService } from '../product-item.interface';
import { AuthInternalGuard } from 'src/share/guards';
import { ParamIdDto } from 'src/share/dto';

@Controller({ path: 'internal/product-items', version: '1' })
@UseGuards(AuthInternalGuard)
@ApiTags('Internal Product Item')
export class ProductItemInternalController {
  constructor(
    @Inject(PRODUCT_ITEM_SERVICE)
    private readonly productItemService: IProductItemService,
  ) {}

  @Get(':id')
  async findOne(@Param() param: ParamIdDto) {
    return this.productItemService.findOne(param.id, {
      attributes: [
        'id',
        'name',
        'salePrice',
        'price',
        'quantity',
        'reservedQuantity',
      ],
    });
  }

  @Post('list-by-ids')
  findByIds() {
    return [];
  }
}
