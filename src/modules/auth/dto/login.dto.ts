import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ahmet@wibesoft.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'GucluSifre123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}