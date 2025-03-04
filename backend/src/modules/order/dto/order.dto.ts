import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingMethod,
} from 'src/share/constants/enum';

export class OrderDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of order',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of order',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: ShippingMethod,
    example: ShippingMethod.FREE,
    description: 'The shipping method',
  })
  @IsEnum(ShippingMethod)
  shippingMethod: ShippingMethod;

  @ApiProperty({
    example: 0,
    description: 'The shipping cost',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  shippingCost: number;

  @ApiProperty({
    example: '12/3A gv, hcm',
    description: 'The shipping address',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    example: 'hcm',
    description: 'The shipping city',
  })
  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @ApiProperty({
    example: 'Hung',
    description: 'The first name of recipient',
  })
  @IsString()
  @IsNotEmpty()
  recipientFirstName: string;

  @ApiProperty({
    example: 'Nguyen',
    description: 'The last name of recipient',
  })
  @IsString()
  @IsNotEmpty()
  recipientLastName: string;

  @ApiProperty({
    example: '0908776543',
    description: 'The phone number of recipient',
  })
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  recipientPhone: string;

  @ApiProperty({
    example: 'hung.nguyen@gmai.com',
    description: 'The email of recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.COD,
    description: 'The payment method',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    description: 'The status of payment',
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  orderItems?: OrderItemDto[];

  @ApiProperty({
    example: 30000000,
    description: 'The total price',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    example: 'aiwi10101918930',
    description: 'The tracking number',
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'The status of order',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    example: '[{}]',
    description: 'The history of order',
  })
  @IsString()
  @IsOptional()
  history?: string;
}

export class OrderItemDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of order item',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of order',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsNotEmpty()
  productItemId: string;

  @ApiProperty({
    example: 'iphone 15 pro max',
    description: 'The name of product item',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: 20000000,
    description: 'The sale price of product item',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsNotEmpty()
  salePrice: number;

  order?: object;
}

export class BrandListDto {
  @ApiProperty({ example: 10, description: 'Total number of orders' })
  total: number;

  @ApiProperty({ type: [OrderDto], description: 'List of orders' })
  data: OrderDto[];
}
