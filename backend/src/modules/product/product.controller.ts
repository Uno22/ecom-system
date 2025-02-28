import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_SERVICE } from './product.di-token';
import { InvalidQueryDataException } from 'src/share/exceptions';
import { CondProductDto, ProductDto } from './dto';
import { ParamIdDto } from 'src/share/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/share/constants/enum';
import { RemoteAuthGuard, Roles, RolesGuard } from 'src/share/guards';

@Controller({ path: 'products', version: '1' })
@UseGuards(RemoteAuthGuard, RolesGuard)
@ApiTags('Product')
@ApiBearerAuth()
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productService: ProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
    type: ProductDto,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: ProductDto,
  })
  findAll(@Req() req) {
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

    const cond: CondProductDto = name ? { name } : {};

    return this.productService.findAll(cond, paging);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return a product by id.',
    type: ProductDto,
  })
  findOne(@Param() param: ParamIdDto) {
    return this.productService.findOne(param.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Return true if update successfully.',
    type: Boolean,
  })
  update(
    @Param() param: ParamIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(param.id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a product by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'hard', required: false, default: 'false' })
  @ApiResponse({
    status: 200,
    description: 'Return true if remove successfully.',
    type: Boolean,
  })
  remove(@Param() param: ParamIdDto, @Req() req) {
    return this.productService.remove(param.id, req.query.hard === 'true');
  }
}
