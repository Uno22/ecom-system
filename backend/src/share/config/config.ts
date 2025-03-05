export const port = process.env.PORT || 3000;

export default () => ({
  mysql: {
    database: process.env.DB_NAME || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT as string),
    dialect: 'mysql',
    autoLoadModels: true,
  },
  rpc: {
    authBaseUrl: process.env.RPC_AUTH_BASE_URL || `http://localhost:${port}`,
    categoryBaseUrl:
      process.env.RPC_CATEGORY_BASE_URL || `http://localhost:${port}`,
    brandBaseUrl: process.env.RPC_BRAND_BASE_URL || `http://localhost:${port}`,
    productBaseUrl:
      process.env.RPC_PRODUCT_BASE_URL || `http://localhost:${port}`,
    cartBaseUrl: process.env.RPC_CART_BASE_URL || `http://localhost:${port}`,
  },
  jwtToken: {
    masterToken: process.env.MASTER_TOKEN,
    defaultToken: {
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: `${process.env.JWT_EXPIRES_IN}s`,
    },
    accessToken: {
      secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}s`,
    },
    refreshToken: {
      secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}s`,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6378',
    password: process.env.REDIS_PASSWORD,
    tokenExpiresIn: parseInt(process.env.REDIS_TOKEN_EXPIRES_IN as string),
    userInfoExpiresIn: parseInt(
      process.env.REDIS_USE_INFO_EXPIRES_IN as string,
    ),
  },
});
