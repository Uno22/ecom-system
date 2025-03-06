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

  async sendMessage(msg: IOrderMessage) {
    return await this.kafkaProducer.sendMessage(KAFKA_TOPIC.ORDER_STARTED, [
      { key: msg.orderId, value: JSON.stringify(msg) },
    ]);
  }

  async deteleMessages(topic: string, offset: string) {
    await this.kafkaProducer.deteleRecords(topic, offset);
  }
}
