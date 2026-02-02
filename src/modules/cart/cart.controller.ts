import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Kullanıcının sepetini getir' })
  @ApiQuery({ name: 'userId', required: true, description: 'Test edilecek Kullanıcı ID (UUID)' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async getCart(
    @Query('userId', ParseUUIDPipe) userId: string 
  ): Promise<CartResponseDto> {
    
    const cart = await this.cartService.getCart(userId);
    return plainToInstance(CartResponseDto, cart, { excludeExtraneousValues: true });
  }

  @Post()
  @ApiOperation({ summary: 'Sepete ürün ekle' })
  @ApiQuery({ name: 'userId', required: true, description: 'Test edilecek Kullanıcı ID (UUID)' })
  @ApiResponse({ status: 201, type: CartResponseDto })
  async addToCart(
    @Query('userId', ParseUUIDPipe) userId: string, 
    @Body() dto: AddToCartDto
  ): Promise<CartResponseDto> {
    
    const updatedCart = await this.cartService.addToCart(userId, dto);
    return plainToInstance(CartResponseDto, updatedCart, { excludeExtraneousValues: true });
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Sepetten ürün çıkar' })
  @ApiQuery({ name: 'userId', required: true, description: 'Test edilecek Kullanıcı ID (UUID)' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async removeItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Query('userId', ParseUUIDPipe) userId: string 
  ): Promise<CartResponseDto> {
    
    const updatedCart = await this.cartService.removeFromCart(userId, itemId);
    return plainToInstance(CartResponseDto, updatedCart, { excludeExtraneousValues: true });
  }
}