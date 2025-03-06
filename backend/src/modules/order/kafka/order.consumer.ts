import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IOrderMessage } from 'src/share/interfaces';
import {
  KAFKA_ORDER_CONSUMER,
  KAFKA_ORDER_GROUP_ID,
  KAFKA_TOPIC,
} from 'src/share/kafka/kafka.constants';
import { KafkaConsumer } from 'src/share/kafka/kafka.consumer';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(
    @Inject(KAFKA_ORDER_CONSUMER) private readonly kafkaConsumer: KafkaConsumer,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.createConsumer(
      KAFKA_ORDER_GROUP_ID,
      KAFKA_TOPIC.ORDER_STARTED,
      (message: IOrderMessage) => {},
    );
  }
}
