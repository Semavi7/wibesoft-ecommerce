import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column('int')
  quantity: number;

  // Sipariş anındaki fiyatı saklıyoruz (Snapshot)
  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase: number;
}