import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    private readonly name: string,
    private readonly enabled: boolean,
    broker: string,
    username: string,
    password: string,
  ) {
    if (enabled) {
      this.kafka = new Kafka({
        clientId: 'ecom-system-producer',
        brokers: [broker],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: username,
          password: password,
        },
        logLevel: 2,
      });

      this.producer = this.kafka.producer();
    }
  }

  async onModuleInit() {
    if (!this.enabled) {
      return;
    }
    console.log(`${this.name} is connecting`);
    await this.producer.connect();
    console.log(`${this.name} connected`);
  }

  async sendMessage(topic: string, messages: any[]) {
    if (!this.enabled) {
      return;
    }
    console.log(`${this.name} is sending message`, messages);
    const result = await this.producer.send({ topic, messages });
    console.log(`${this.name} sent result:`, result);

    return result;
  }

  async onModuleDestroy() {
    if (!this.enabled) {
      return;
    }
    await this.producer.disconnect();
  }

  async deteleRecords(topic: string, offset: string) {
    if (!this.enabled) {
      return;
    }
    const admin = this.kafka.admin();
    await admin.connect();

    // await admin.deleteTopicRecords({
    //   topic: topic,
    //   partitions: [{ partition: 0, offset: offset }],
    // });

    // const topicOffset = await admin.fetchTopicOffsets(topic);
    // console.log('topicOffset', topicOffset);

    await admin.disconnect();
  }
}
