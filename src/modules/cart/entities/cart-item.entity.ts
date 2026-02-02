import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true }) 
  product: Product;

  @Column('int')
  quantity: number;

  subTotal?: number;
}