import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderStatus } from './enums/order-status.enum';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class OrdersRepository {
  private orderRepo: Repository<Order>;

  constructor(private readonly dataSource: DataSource) {
    this.orderRepo = this.dataSource.getRepository(Order);
  }

  async createOrderWithTransaction(userId: string, shippingAddress: string): Promise<Order> {

    return this.dataSource.transaction(async (manager) => {

      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Sepetiniz boş, sipariş oluşturulamaz.');
      }

      let calculatedTotalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {

        const product = await manager.findOne(Product, {
          where: { id: cartItem.product.id },
          lock: { mode: 'pessimistic_write' }
        });

        if (!product) {
          throw new NotFoundException(`${cartItem.product.name} ürünü artık satışta değil.`);
        }

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(`${product.name} için yeterli stok kalmadı! (Kalan: ${product.stock})`);
        }

        product.stock -= cartItem.quantity;

        await manager.save(product); 

        const currentPrice = Number(product.price); 
        const lineTotal = currentPrice * cartItem.quantity;
        calculatedTotalAmount += lineTotal;

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = cartItem.quantity;
        orderItem.priceAtPurchase = currentPrice;
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.userId = userId;
      order.shippingAddress = shippingAddress;
      order.totalAmount = calculatedTotalAmount;
      order.status = OrderStatus.PENDING;
      order.items = orderItems;

      const savedOrder = await manager.save(Order, order);

      await manager.delete(CartItem, { cart: { id: cart.id } });

      return savedOrder;
    });
  }

  async findAllByUserId(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });
  }
}