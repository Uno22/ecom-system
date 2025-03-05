import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private tokenExpiresIn;
  private userInfoExpiresIn;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    });

    this.client.on('connect', () => console.log('Redis connected'));
    this.client.on('error', (err) => console.error('Redis error:', err));

    this.tokenExpiresIn = this.configService.get<number>(
      'redis.tokenExpiresIn',
    );
    this.userInfoExpiresIn = this.configService.get<number>(
      'redis.userInfoExpiresIn',
    );
  }

  onModuleInit() {
    console.log('RedisService initialized');
  }

  onModuleDestroy() {
    this.client.quit();
    console.log('RedisService destroyed');
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, expiry?: number) {
    if (expiry) {
      return this.client.set(key, value, 'EX', expiry);
    }
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  getTokenKey(userId: string) {
    return `token:${userId}`;
  }

  getUserInfoKey(userId: string) {
    return `user:${userId}`;
  }

  async setToken(userId: string, token: string) {
    return this.set(this.getTokenKey(userId), token, this.tokenExpiresIn);
  }

  async getToken(userId: string) {
    return this.get(this.getTokenKey(userId));
  }

  async deleteToken(userId: string) {
    return this.del(this.getTokenKey(userId));
  }

  async setUserInfo(userId: string, payload: any) {
    return this.set(
      this.getUserInfoKey(userId),
      JSON.stringify(payload),
      this.userInfoExpiresIn,
    );
  }

  async getUserInfo(userId: string) {
    return this.get(this.getUserInfoKey(userId));
  }

  async deleteUserInfo(userId: string) {
    return this.del(this.getUserInfoKey(userId));
  }
}
