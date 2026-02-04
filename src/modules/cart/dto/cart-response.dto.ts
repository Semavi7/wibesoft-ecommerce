import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  totalAmount: number;

  @Expose()
  @Type(() => CartItemResponseDto)
  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];
}