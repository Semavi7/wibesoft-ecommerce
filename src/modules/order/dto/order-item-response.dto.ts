import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class OrderItemResponseDto {
  @Expose() 
  @ApiProperty() 
  id: string;

  @Expose() 
  @ApiProperty() 
  quantity: number;

  @Expose()
  @ApiProperty() 
  priceAtPurchase: number;

  @Expose()
  @Type(() => ProductResponseDto)
  @ApiProperty({ type: ProductResponseDto })
  product: ProductResponseDto;
}
