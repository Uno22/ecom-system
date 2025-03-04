import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RemoteAuthGuard, Roles, RolesGuard } from 'src/share/guards';
import { CATEGORY_SERVICE } from '../category.di-token';
import { UserRole } from 'src/share/constants/enum';
import { BrandDto } from '../../brand/dto';
import { CategoryDto, CondCategoryDto } from '../dto';
import { InvalidQueryDataException } from 'src/share/exceptions';
import { ParamIdDto } from 'src/share/dto';
import { buildCategoryTree } from '../category.utils';
import { ICategoryService } from '../category.interface';

@Controller({ path: 'categories', version: '1' })
@UseGuards(RemoteAuthGuard, RolesGuard)
@ApiTags('09. Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly categoryService: ICategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created.',
    type: CategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: CategoryDto,
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
    const { data, total } = await this.categoryService.findAll(cond, paging);
    const categoryTree = buildCategoryTree(data);

    return { data: categoryTree, total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return a brand by id.',
    type: BrandDto,
  })
  findOne(@Param() param: ParamIdDto) {
    return this.categoryService.findOne(param.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Return true if update successfully.',
    type: Boolean,
  })
  update(
    @Param() param: ParamIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(param.id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a category by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'hard', required: false, default: 'false' })
  @ApiResponse({
    status: 200,
    description: 'Return true if remove successfully.',
    type: Boolean,
  })
  remove(@Param() param: ParamIdDto, @Req() req) {
    const { hard = 'false' } = req.query;
    return this.categoryService.remove(param.id, hard === 'true');
  }
}
