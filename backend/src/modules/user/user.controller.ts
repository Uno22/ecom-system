import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Inject,
  UseGuards,
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
import { AuthGuard, Roles, RolesGuard } from 'src/share/guards';
import { UserRole } from 'src/share/constants/enum';

@Controller({ path: 'users', version: '1' })
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  findOne(@Param() param: ParamIdDto) {
    return this.userService.findOne(param.id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Return true if update successfully.',
    type: Boolean,
  })
  update(@Param() param: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(param.id, updateUserDto);
  }
}
