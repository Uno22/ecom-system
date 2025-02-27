import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidateTokenRpc } from './rpc/validate-token.rpc';
import { VALIDATE_TOKEN_RPC } from './constants/di-token';

const dependencies = [
  {
    provide: VALIDATE_TOKEN_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.authBaseUrl');
      return new ValidateTokenRpc(url as string);
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [...dependencies],
  exports: [JwtModule, VALIDATE_TOKEN_RPC],
})
export class SharedModule {}
