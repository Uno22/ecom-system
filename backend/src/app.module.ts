import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'src/share/config';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [SequelizeModule.forRoot(config.mysql), BrandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
