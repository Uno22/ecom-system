import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SERVICE } from './user.di-token';
import { IUserService } from './user.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamIdDto } from 'src/share/dto/param.dto';
import { AuthGuard } from 'src/share/guards';

@Controller({ path: 'users', version: '1' })
@UseGuards(AuthGuard)
@ApiTags('02. User')
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  findOne(@Param() param: ParamIdDto) {
    return this.userService.findOne(param.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Return true if update successfully.',
    type: Boolean,
  })
  update(
    @Param() param: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.update(param.id, updateUserDto, req.user);
  }
}
