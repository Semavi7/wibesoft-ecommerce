import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty() @IsString() imageUrl: string;
  @ApiProperty() @IsNumber() @Min(0) stock: number;
}
