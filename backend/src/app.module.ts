import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'src/share/config';
import { BrandModule } from './modules/brand/brand.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [SequelizeModule.forRoot(config.mysql), BrandModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
