import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @Expose() 
  @ApiProperty() 
  id: string;

  @Expose() 
  @ApiProperty() 
  totalAmount: number;

  @Expose() 
  @ApiProperty({ enum: OrderStatus }) 
  status: OrderStatus;

  @Expose() 
  @ApiProperty() 
  shippingAddress: string;

  @Expose() 
  @ApiProperty() 
  createdAt: Date;

  @Expose()
  @Type(() => OrderItemResponseDto)
  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}