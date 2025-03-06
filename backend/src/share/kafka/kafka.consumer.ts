import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumer implements OnModuleDestroy {
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor(
    private readonly name: string,
    private readonly enabled: boolean,
    broker: string,
    username: string,
    password: string,
  ) {
    if (enabled) {
      this.kafka = new Kafka({
        clientId: 'ecom-system-consumer',
        brokers: [broker],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: username,
          password: password,
        },
        logLevel: 2,
      });
    }
  }

  async createConsumer(
    groupId: string,
    topic: string,
    callback: (message: any) => void,
  ) {
    if (!this.enabled) {
      return;
    }
    console.log(`${this.name} is initializing`);
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        callback(message);
      },
    });

    this.consumers.push(consumer);
    console.log(`${this.name} initialized`);
  }

  async onModuleDestroy() {
    if (!this.enabled) {
      return;
    }
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
