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
import { KafkaProducer } from './kafka/kafka.producer';
import { KafkaConsumer } from './kafka/kafka.consumer';
import {
  KAFKA_CART_CONSUMER,
  KAFKA_CART_PRODUCER,
  KAFKA_ORDER_CONSUMER,
  KAFKA_ORDER_PRODUCER,
  KAFKA_PRODUCT_CONSUMER,
  KAFKA_PRODUCT_PRODUCER,
} from './kafka/kafka.constants';

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

const orderKafkaDependencies = [
  {
    provide: KAFKA_ORDER_PRODUCER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaProducer(
        'order-producer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
  {
    provide: KAFKA_ORDER_CONSUMER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaConsumer(
        'order-consumer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
];

const cartKafkaDependencies = [
  {
    provide: KAFKA_CART_PRODUCER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaProducer(
        'cart-producer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
  {
    provide: KAFKA_CART_CONSUMER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaConsumer(
        'cart-consumer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
];

const productKafkaDependencies = [
  {
    provide: KAFKA_PRODUCT_PRODUCER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaProducer(
        'product-producer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
  {
    provide: KAFKA_PRODUCT_CONSUMER,
    useFactory: (configService: ConfigService) => {
      const broker = configService.get<string>('kafka.broker', '');
      const username = configService.get<string>('kafka.username', '');
      const password = configService.get<string>('kafka.password', '');
      const enabled = configService.get<boolean>('kafka.enabled', false);
      return new KafkaConsumer(
        'product-consumer',
        enabled,
        broker,
        username,
        password,
      );
    },
    inject: [ConfigService],
  },
];

const exportServices = [
  JwtModule,
  VALIDATE_TOKEN_RPC,
  REDIS_SERVER,
  JWT_SERVICE,
  KAFKA_ORDER_PRODUCER,
  KAFKA_ORDER_CONSUMER,
  KAFKA_CART_PRODUCER,
  KAFKA_CART_CONSUMER,
  KAFKA_PRODUCT_PRODUCER,
  KAFKA_PRODUCT_CONSUMER,
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
  providers: [
    ...dependencies,
    ...orderKafkaDependencies,
    ...cartKafkaDependencies,
    ...productKafkaDependencies,
  ],
  exports: [...exportServices],
})
export class SharedModule {}
