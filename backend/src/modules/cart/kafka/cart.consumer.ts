import { Inject, Injectable } from '@nestjs/common';
import {
  KAFKA_CART_CONSUMER,
  KAFKA_ORDER_GROUP_ID,
} from 'src/share/kafka/kafka.constants';
import { KafkaConsumer } from 'src/share/kafka/kafka.consumer';
import { KafkaConsumerCallback } from 'src/share/kafka/kafka.interface';

@Injectable()
export class CartConsumer {
  constructor(
    @Inject(KAFKA_CART_CONSUMER) private readonly kafkaConsumer: KafkaConsumer,
  ) {}

  async init(configs: KafkaConsumerCallback[] = []) {
    await Promise.all(
      configs.map((config) =>
        this.kafkaConsumer.createConsumer(
          config.groupId,
          config.topic,
          config.cb,
        ),
      ),
    );
  }
}
