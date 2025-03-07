export const KAFKA_ORDER_GROUP_ID = 'order-group';
export const KAFKA_PRODUCER = 'KAFKA_PRODUCER';
export const KAFKA_CONSUMER = 'KAFKA_CONSUMER';
export const KAFKA_ORDER_PRODUCER = 'KAFKA_ORDER_PRODUCER';
export const KAFKA_ORDER_CONSUMER = 'KAFKA_ORDER_CONSUMER';
export const KAFKA_CART_PRODUCER = 'KAFKA_CART_PRODUCER';
export const KAFKA_CART_CONSUMER = 'KAFKA_CART_CONSUMER';
export const KAFKA_PRODUCT_PRODUCER = 'KAFKA_PRODUCT_PRODUCER';
export const KAFKA_PRODUCT_CONSUMER = 'KAFKA_PRODUCT_CONSUMER';

export enum KAFKA_TOPIC {
  ORDER_STARTED = 'order-started',
  ORDER_CART_VERIFIED = 'order-cart-verified',
  ORDER_PRODUCT_RESERVED = 'order-product-reserved',
  ORDER_CREATED = 'order-created',
  ORDER_CREATION_FAILED = 'order-creation-failed',
  ORDER_PRODUCT_DEDUCTED = 'order-product-deducted',
  ORDER_PRODUCT_DEDUCT_FAILED = 'order-product-deduct-failed',
  ORDRE_FAILED = 'order-failed',
}

export const KafkaConsumerConfig = {
  cart: {
    verifyCart: {
      groupId: 'verify-cart-group',
      topic: KAFKA_TOPIC.ORDER_STARTED,
    },
  },
  order: {
    createOrder: {
      groupId: 'create-order-group',
      topic: KAFKA_TOPIC.ORDER_CART_VERIFIED,
    },
    confirmOrder: {
      groupId: 'confirm-order-group',
      topic: KAFKA_TOPIC.ORDER_PRODUCT_DEDUCTED,
    },
    updateOrderFailed: {
      groupId: 'update-order-failed-group',
      topic: KAFKA_TOPIC.ORDER_PRODUCT_DEDUCT_FAILED,
    },
    orderCreationFailed: {
      groupId: 'order-creation-failed-group',
      topic: KAFKA_TOPIC.ORDRE_FAILED,
    },
  },
  product: {
    reserveProduct: {
      groupId: 'reserve-product-group',
      topic: KAFKA_TOPIC.ORDER_CART_VERIFIED,
    },
    deductProduct: {
      groupId: 'deduct-product-group',
      topic: KAFKA_TOPIC.ORDER_CREATED,
    },
    releaseProduct: {
      groupId: 'release-product-group',
      topic: KAFKA_TOPIC.ORDER_CREATION_FAILED,
    },
  },
};
