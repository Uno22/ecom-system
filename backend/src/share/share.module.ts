import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidateTokenRpc } from './rpc/validate-token.rpc';
import {
  JWT_SERVICE,
  REDIS_SERVER,
  VALIDATE_TOKEN_RPC,
} from './constants/di-token';
import { RedisService } from './cache/redis.service';
import { JwtService } from './jwt/jwt.service';

const dependencies = [
  {
    provide: VALIDATE_TOKEN_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.authBaseUrl');
      return new ValidateTokenRpc(url as string);
    },
    inject: [ConfigService],
  },
  {
    provide: REDIS_SERVER,
    useClass: RedisService,
  },
  {
    provide: JWT_SERVICE,
    useClass: JwtService,
  },
];

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtToken.defaultToken.secretKey'),
        signOptions: {
          expiresIn: configService.get<string>(
            'jwtToken.defaultToken.expiresIn',
          ),
        },
      }),
    }),
  ],
  providers: [...dependencies],
  exports: [JwtModule, VALIDATE_TOKEN_RPC, REDIS_SERVER, JWT_SERVICE],
})
export class SharedModule {}
