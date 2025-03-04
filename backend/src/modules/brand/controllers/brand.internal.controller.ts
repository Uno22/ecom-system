import { Controller, Inject, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ParamIdDto } from 'src/share/dto';
import { BRAND_SERVICE } from '../brand.di-token';
import { IBrandService } from '../brand.interface';
import { BrandDto } from '../dto';
import { AuthInternalGuard } from 'src/share/guards';

@Controller({ path: 'internal/brands', version: '1' })
@UseGuards(AuthInternalGuard)
@ApiTags('12. Internal Brand')
export class BrandInternalController {
  constructor(
    @Inject(BRAND_SERVICE)
    private readonly service: IBrandService,
  ) {}

  @Get(':id')
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
}
