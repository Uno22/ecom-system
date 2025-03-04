import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './auth.di-token';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: AUTH_SERVICE, useClass: AuthService },
];

@Module({
  imports: [SharedModule, UserModule],
  controllers: [AuthController],
  providers: [...dependencies],
})
export class AuthModule {}
