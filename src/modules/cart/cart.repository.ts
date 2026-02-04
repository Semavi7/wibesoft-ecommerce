import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartRepository {
  private cartRepo: Repository<Cart>;
  private cartItemRepo: Repository<CartItem>;

  constructor(private readonly dataSource: DataSource) {
    this.cartRepo = this.dataSource.getRepository(Cart);
    this.cartItemRepo = this.dataSource.getRepository(CartItem);
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { items: { createdAt: 'ASC' } }
    });
  }

  async createCart(userId: string): Promise<Cart> {
    const newCart = this.cartRepo.create({
      user: { id: userId } as any,
      items: []
    });
    return this.cartRepo.save(newCart);
  }

  async addOrUpdateItem(cartId: string, product: Product, quantity: number): Promise<void> {
    const existingItem = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cartId },
        product: { id: product.id }
      }
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cart: { id: cartId } as any,
        product: product,
        quantity: quantity
      });
      await this.cartItemRepo.save(newItem);
    }
  }

  async removeItem(itemId: string): Promise<void> {
    await this.cartItemRepo.delete(itemId);
  }

  async clearCart(cartId: string): Promise<void> {
    await this.cartItemRepo.delete({ cart: { id: cartId } });
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    await this.cartItemRepo.update(itemId, { quantity });
  }
}