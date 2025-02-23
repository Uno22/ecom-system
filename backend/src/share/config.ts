import { ConfigModule } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

ConfigModule.forRoot(); // Load .env file

export const port = process.env.PORT || 3000;

export const config = {
  mysql: {
    database: process.env.DB_NAME || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT as string),
    dialect: 'mysql',
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 60000,
    },
    autoLoadModels: true,
    logging: console.log,
  } as SequelizeModuleOptions,
  rpc: {
    productCategoryBaseUrl:
      process.env.RPC_PRODUCT_CATEGORY_BASE_URL || `http://localhost:${port}`,
    productBrandBaseUrl:
      process.env.RPC_PRODUCT_BRAND_BASE_URL || `http://localhost:${port}`,
    verifyTokenBaseUrl:
      process.env.RPC_VERIFY_TOKEN_BASE_URL || `http://localhost:${port}`,
    productBaseUrl:
      process.env.RPC_PRODUCT_BASE_URL || `http://localhost:${port}`,
    cartBaseUrl: process.env.RPC_CART_BASE_URL || `http://localhost:${port}`,
  },
  accessToken: {
    secretKey: process.env.ACCESS_TOKEN_SECRET_KEY || 'as8f9wfwe',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '7d',
  },
};
