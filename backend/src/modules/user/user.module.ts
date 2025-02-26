import { Module, Provider } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserRepository } from './infras/user.repo';
import { User } from './model/user.model';
import { SequelizeModule } from '@nestjs/sequelize';

const dependencies: Provider[] = [
  { provide: USER_SERVICE, useClass: UserService },
  { provide: USER_REPOSITORY, useClass: UserRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [...dependencies],
})
export class UserModule {}
