import { Inject, Injectable } from '@nestjs/common';
import {
  KAFKA_ORDER_PRODUCER,
  KAFKA_TOPIC,
} from 'src/share/kafka/kafka.constants';
import { KafkaProducer } from 'src/share/kafka/kafka.producer';
import { IOrderMessage } from 'src/share/interfaces';

@Injectable()
export class OrderProducer {
  constructor(
    @Inject(KAFKA_ORDER_PRODUCER) private readonly kafkaProducer: KafkaProducer,
  ) {}

  async sendMessage(topic: string, msg: IOrderMessage) {
    return await this.kafkaProducer.sendMessage(topic, [
      { key: msg.orderId, value: JSON.stringify(msg) },
    ]);
  }

  async deteleMessages(topic: string, offset: string) {
    await this.kafkaProducer.deteleRecords(topic, offset);
  }

  async startedOrder(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_STARTED, msg);
  }

  async createdOrder(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_CREATED, msg);
  }

  async createOrderFailed(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_CREATION_FAILED, msg);
  }

  async sendDLQMessage(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_DLQ, msg);
  }
}
