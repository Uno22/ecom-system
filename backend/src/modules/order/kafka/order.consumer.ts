import { Inject, Injectable } from '@nestjs/common';
import { KAFKA_ORDER_CONSUMER } from 'src/share/kafka/kafka.constants';
import { KafkaConsumer } from 'src/share/kafka/kafka.consumer';
import { KafkaConsumerCallback } from 'src/share/kafka/kafka.interface';

@Injectable()
export class OrderConsumer {
  constructor(
    @Inject(KAFKA_ORDER_CONSUMER) private readonly kafkaConsumer: KafkaConsumer,
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
