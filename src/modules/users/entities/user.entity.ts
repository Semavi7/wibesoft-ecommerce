import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity'; 
import { Cart } from 'src/modules/cart/entities/cart.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
