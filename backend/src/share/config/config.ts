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
    verifyTokenBaseUrl:
      process.env.RPC_VERIFY_TOKEN_BASE_URL || `http://localhost:${port}`,
  },
  accessToken: {
    secretKey: process.env.ACCESS_TOKEN_SECRET_KEY || 'as8f9wfwe',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '7d',
  },
  token: {
    masterToken: process.env.MASTER_TOKEN,
  },
});
