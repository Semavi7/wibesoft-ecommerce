import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Bağdat Cad. No:15 İstanbul' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}
