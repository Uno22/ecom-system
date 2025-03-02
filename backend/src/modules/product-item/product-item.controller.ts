import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateProductItemDto, ProductItemDto } from './dto';
import { PRODUCT_ITEM_SERVICE } from './product-item.di-token';
import { IProductItemService } from './product-item.interface';
import { InvalidQueryDataException } from 'src/share/exceptions';
import { CondCategoryDto } from '../category/dto';

@Controller({ path: 'product-items', version: '1' })
@ApiTags('Product Item')
export class ProductItemController {
  constructor(
    @Inject(PRODUCT_ITEM_SERVICE)
    private readonly productItemService: IProductItemService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product item' })
  @ApiBody({ type: CreateProductItemDto })
  @ApiResponse({
    status: 201,
    description: 'Product Item successfully created.',
    type: ProductItemDto,
  })
  create(@Body() createProductDto: CreateProductItemDto) {
    return this.productItemService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product items' })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiResponse({
    status: 200,
    description: 'Return all product items.',
    type: ProductItemDto,
  })
  async findAll(@Req() req) {
    const { page, limit, name } = req.query;
    const paging = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };
    if (
      isNaN(paging.page) ||
      isNaN(paging.limit) ||
      paging.page < 1 ||
      paging.limit < 1
    ) {
      throw new InvalidQueryDataException();
    }

    const cond: CondCategoryDto = name ? { name } : {};

    return this.productItemService.findAll(cond, paging);
  }
}
