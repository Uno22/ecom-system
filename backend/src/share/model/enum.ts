export enum ModelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const UserInactivatedStatus = [
  UserStatus.DELETED,
  UserStatus.BANNED,
  UserStatus.INACTIVE,
];

export enum ShippingMethod {
  FREE = 'free',
  STANDARD = 'standard',
}

export enum PaymentMethod {
  CREDIT = 'credit',
  DEBIT = 'debit',
  PAYPAL = 'paypal',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  DELETED = 'deleted',
}
