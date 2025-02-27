import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { AUTH_SERVICE } from './auth.di-token';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../../share/dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginReponseDto } from './dto/login-response.dto';
import { ValidateTokenDto } from './dto';

@ApiTags('Auth')
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
    description: 'User successfully created.',
    type: LoginReponseDto,
  })
  login(@Body() UserLoginDto: UserLoginDto) {
    return this.authService.login(UserLoginDto);
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
}
