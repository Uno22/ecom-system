import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  Req,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BRAND_SERVICE } from './brand.di-token';
import { IBrandService } from './brand.interface';
import { AppError } from 'src/share/app-error';
import { ErrInvalidData } from 'src/share/model/error';
import { ParamIdDto } from 'src/share/param.dto';
import { CondBrandDto } from './dto';

@Controller({ path: 'brands', version: '1' })
export class BrandController {
  constructor(
    @Inject(BRAND_SERVICE)
    private readonly service: IBrandService,
  ) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.service.create(createBrandDto);
  }

  @Get()
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
      throw AppError.from(ErrInvalidData, 401);
    }

    const cond: CondBrandDto = name ? { name } : {};

    return this.service.findAll(cond, paging);
  }

  @Get(':id')
  findOne(@Param() param: ParamIdDto) {
    return this.service.findOne(param.id);
  }

  @Patch(':id')
  update(@Param() param: ParamIdDto, @Body() updateBrandDto: UpdateBrandDto) {
    return this.service.update(param.id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param() param: ParamIdDto, @Req() req) {
    const { hard = 'false' } = req.query;
    return this.service.remove(param.id, hard === 'true');
  }
}
