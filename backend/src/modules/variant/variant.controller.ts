import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { VARIANT_SERVICE } from './variant.di-token';
import { IVariantService } from './variant.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { RemoteAuthGuard } from 'src/share/guards';
import {
  VariantDto,
  CreateVariantDto,
  CreateVariantItemDto,
  VariantItemDto,
} from './dto';

@Controller({ path: 'variants', version: '1' })
//@UseGuards(RemoteAuthGuard)
@ApiTags('Variant')
@ApiBearerAuth()
export class VariantController {
  constructor(
    @Inject(VARIANT_SERVICE)
    private readonly variantService: IVariantService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new variant' })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({
    status: 201,
    description: 'Variant successfully created.',
    type: VariantDto,
  })
  createVariant(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.createVariant(createVariantDto);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create a new variant item' })
  @ApiBody({ type: CreateVariantItemDto })
  @ApiResponse({
    status: 201,
    description: 'Variant Item successfully created.',
    type: VariantItemDto,
  })
  createVariantItem(@Body() createVariantItemDto: CreateVariantItemDto) {
    return this.variantService.createVariantItem(createVariantItemDto);
  }
}
