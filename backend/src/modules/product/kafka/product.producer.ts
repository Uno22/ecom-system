import { Inject, Injectable } from '@nestjs/common';
import {
  KAFKA_PRODUCT_PRODUCER,
  KAFKA_TOPIC,
} from 'src/share/kafka/kafka.constants';
import { KafkaProducer } from 'src/share/kafka/kafka.producer';
import { IOrderMessage } from 'src/share/interfaces';

@Injectable()
export class ProductProducer {
  constructor(
    @Inject(KAFKA_PRODUCT_PRODUCER)
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async sendMessage(topic: string, msg: IOrderMessage) {
    return await this.kafkaProducer.sendMessage(topic, [
      { key: msg.orderId, value: JSON.stringify(msg) },
    ]);
  }

  async deteleMessages(topic: string, offset: string) {
    await this.kafkaProducer.deteleRecords(topic, offset);
  }

  async reservedProduct(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_PRODUCT_RESERVED, msg);
  }

  async reserveProductFailed(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDRE_FAILED, msg);
  }

  async deductedProduct(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_PRODUCT_DEDUCTED, msg);
  }

  async deducteProductFailed(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_PRODUCT_DEDUCT_FAILED, msg);
  }
}
