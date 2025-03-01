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
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { BRAND_SERVICE } from '../brand.di-token';
import { IBrandService } from '../brand.interface';
import { ParamIdDto } from 'src/share/dto/param.dto';
import { BrandDto, BrandListDto, CondBrandDto } from '../dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvalidQueryDataException } from 'src/share/exceptions';
import { RemoteAuthGuard, Roles, RolesGuard } from 'src/share/guards';
import { UserRole } from 'src/share/constants/enum';

@Controller({ path: 'brands', version: '1' })
@UseGuards(RemoteAuthGuard, RolesGuard)
@ApiTags('1. Brand')
@ApiBearerAuth()
export class BrandController {
  constructor(
    @Inject(BRAND_SERVICE)
    private readonly service: IBrandService,
  ) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Brand successfully created.',
    type: BrandDto,
  })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.service.create(createBrandDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all brands' })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiResponse({
    status: 200,
    description: 'Return all brands.',
    type: BrandListDto,
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

    const cond: CondBrandDto = name ? { name } : {};
    console.log('req', req.user);
    return this.service.findAll(cond, paging);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a brand by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return a brand by id.',
    type: BrandDto,
  })
  findOne(@Param() param: ParamIdDto) {
    return this.service.findOne(param.id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a brand by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: 200,
    description: 'Return true if update successfully.',
    type: Boolean,
  })
  update(@Param() param: ParamIdDto, @Body() updateBrandDto: UpdateBrandDto) {
    return this.service.update(param.id, updateBrandDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a brand by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'hard', required: false, default: 'false' })
  @ApiResponse({
    status: 200,
    description: 'Return true if remove successfully.',
    type: Boolean,
  })
  remove(@Param() param: ParamIdDto, @Req() req) {
    const { hard = 'false' } = req.query;
    return this.service.remove(param.id, hard === 'true');
  }
}
