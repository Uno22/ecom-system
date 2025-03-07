import { Inject, Injectable } from '@nestjs/common';
import {
  KAFKA_CART_PRODUCER,
  KAFKA_TOPIC,
} from 'src/share/kafka/kafka.constants';
import { KafkaProducer } from 'src/share/kafka/kafka.producer';
import { IOrderMessage } from 'src/share/interfaces';

@Injectable()
export class CartProducer {
  constructor(
    @Inject(KAFKA_CART_PRODUCER) private readonly kafkaProducer: KafkaProducer,
  ) {}

  async sendMessage(topic: string, msg: IOrderMessage) {
    return await this.kafkaProducer.sendMessage(topic, [
      { key: msg.orderId, value: JSON.stringify(msg) },
    ]);
  }

  async deteleMessages(topic: string, offset: string) {
    await this.kafkaProducer.deteleRecords(topic, offset);
  }

  async verifiedCart(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDER_CART_VERIFIED, msg);
  }

  async verifyCartFailed(msg: IOrderMessage) {
    return await this.sendMessage(KAFKA_TOPIC.ORDRE_FAILED, msg);
  }
}
