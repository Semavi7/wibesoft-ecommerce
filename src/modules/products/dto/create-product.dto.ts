import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'sabun' }) 
  @IsString() 
  name: string;

  @ApiProperty({ example: 'Kaliteli bir sabun' }) 
  @IsString() 
  description: string;

  @ApiProperty({ example: 125, minimum: 0 }) 
  @IsNumber()
  @Min(0) 
  price: number;

  @ApiProperty({ example: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Sabun.JPG' }) 
  @IsString() 
  imageUrl: string;

  @ApiProperty({ example: 125, minimum: 0 }) 
  @IsNumber() 
  @Min(0) 
  stock: number;
}
