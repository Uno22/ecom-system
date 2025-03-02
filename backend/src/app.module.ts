import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import config from 'src/share/config/config';
import { BrandModule } from './modules/brand/brand.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './share/share.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { VariantModule } from './modules/variant/variant.module';
import { ProductItemVariantModule } from './modules/product-item-variant/product-item-variant.module';
import { ProductItemModule } from './modules/product-item/product-item.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: configService.get<number>('mysql.port'),
        username: configService.get<string>('mysql.username'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        autoLoadModels: configService.get<boolean>('mysql.autoLoadModels'),
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 60000,
        },
        logging: console.log,
      }),
    }),
    SharedModule,
    BrandModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductItemModule,
    VariantModule,
    ProductItemVariantModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
