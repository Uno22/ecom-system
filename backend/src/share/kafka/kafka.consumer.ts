import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

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
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        let msg;

        try {
          msg = JSON.parse(message.value?.toString() || '{}');
        } catch (error) {
          console.error(
            '[ERROR] ******* consumer parse message to json failed',
            error,
          );
          msg = message.value?.toString();
        }

        console.log(
          `${this.name} received message on topic(${topic}) partition(${partition}) offset(${message?.offset})`,
          'message:',
          msg,
        );
        callback(msg);
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
