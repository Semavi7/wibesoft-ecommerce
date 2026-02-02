import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value)) 
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  imageUrl: string;

  @Expose()
  @ApiProperty()
  stock: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}