import { Injectable, BadRequestException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from './entities/cart.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsService: ProductsService,
  ) {}

  private calculateCartTotals(cart: Cart): Cart {
    if (!cart || !cart.items) {
      cart.totalAmount = 0;
      return cart;
    }

    let total = 0;
    cart.items.forEach(item => {
      const price = Number(item.product.price);
      item.subTotal = price * item.quantity;
      total += item.subTotal;
    });

    cart.totalAmount = total;
    return cart;
  }

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    return this.calculateCartTotals(cart);
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<Cart> {
    const product = await this.productsService.findOne(dto.productId);
    
    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Yetersiz stok! Mevcut: ${product.stock}`);
    }

    const cart = await this.getCart(userId);
    await this.cartRepository.addOrUpdateItem(cart.id, product, dto.quantity);

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    await this.getCart(userId);
    
    await this.cartRepository.removeItem(itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.cartRepository.clearCart(cart.id);
    return { message: 'Sepet temizlendi' };
  }
}