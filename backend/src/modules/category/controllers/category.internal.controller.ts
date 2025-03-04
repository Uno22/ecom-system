import { Controller, UseGuards, Inject, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BrandDto } from 'src/modules/brand/dto';
import { ParamIdDto } from 'src/share/dto';
import { AuthInternalGuard } from 'src/share/guards';
import { CATEGORY_SERVICE } from '../category.di-token';
import { ICategoryService } from '../category.interface';

@Controller({ path: 'internal/categories', version: '1' })
@UseGuards(AuthInternalGuard)
@ApiTags('13. Internal Category')
export class CategoryInternalController {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly categoryService: ICategoryService,
  ) {}

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
}
