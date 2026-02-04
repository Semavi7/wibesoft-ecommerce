import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının sepetini getir' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async getCart(
    @CurrentUser() user: ICurrentUser
  ): Promise<CartResponseDto> {

    const cart = await this.cartService.getCart(user.id);
    return plainToInstance(CartResponseDto, cart, { excludeExtraneousValues: true });
  }

  @Post()
  @ApiOperation({ summary: 'Sepete ürün ekle' })
  @ApiResponse({ status: 201, type: CartResponseDto })
  async addToCart(
    @CurrentUser() user: ICurrentUser,
    @Body() dto: AddToCartDto
  ): Promise<CartResponseDto> {

    const updatedCart = await this.cartService.addToCart(user.id, dto);
    return plainToInstance(CartResponseDto, updatedCart, { excludeExtraneousValues: true });
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Sepetteki ürün adedini güncelle' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: ICurrentUser,
    @Body() dto: UpdateCartItemDto
  ): Promise<CartResponseDto> {

    const updateCart = await this.cartService.updateItemQuantity(user.id, itemId, dto);
    return plainToInstance(CartResponseDto, updateCart, { excludeExtraneousValues: true });
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Sepetten ürün çıkar' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async removeItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<CartResponseDto> {

    const updatedCart = await this.cartService.removeFromCart(user.id, itemId);
    return plainToInstance(CartResponseDto, updatedCart, { excludeExtraneousValues: true });
  }
}