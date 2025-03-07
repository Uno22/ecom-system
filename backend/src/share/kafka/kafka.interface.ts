export interface KafkaConsumerCallback {
  groupId: string;
  topic: string;
  cb: any;
}
