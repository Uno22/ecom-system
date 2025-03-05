import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { AUTH_SERVICE } from './auth.di-token';
import { IAuthService } from './auth.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../../share/dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginReponseDto } from './dto/login-response.dto';
import { UserLogoutDto, ValidateTokenDto } from './dto';
import { ApiException } from 'src/share/exceptions';

@ApiTags('01. Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: OmitType(UserDto, ['password']),
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully login.',
    type: LoginReponseDto,
  })
  async login(@Body() userLoginDto: UserLoginDto, @Res() res) {
    try {
      const result = await this.authService.login(userLoginDto, res);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const response = (error as any).response;
      if (error instanceof ApiException && response) {
        return res.status(response.statusCode).json(response);
      }
      return res
        .status(500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Post('/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiBody({ type: UserLogoutDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logout.',
    type: Boolean,
  })
  async logout(@Body() payload: UserLogoutDto, @Res() res) {
    try {
      const result = await this.authService.logout(payload.userId, res);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const response = (error as any).response;
      if (error instanceof ApiException && response) {
        return res.status(response.statusCode).json(response);
      }
      return res
        .status(500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Post('/validate-token')
  @ApiOperation({ summary: 'Validate token and response valid user' })
  @ApiBody({ type: ValidateTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Valid token',
    type: UserDto,
  })
  validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    return this.authService.validateToken(validateTokenDto.token);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh token successfully.',
    type: LoginReponseDto,
  })
  async refresh(@Req() req) {
    const token = req.cookies['refreshToken'];
    return this.authService.refreshToken(token);
  }
}
