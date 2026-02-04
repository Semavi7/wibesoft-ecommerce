import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.createOrderWithTransaction(userId, dto.shippingAddress);
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.findAllByUserId(userId);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne(id);
    if (!order) throw new NotFoundException('Sipariş bulunamadı');
    return order;
  }
}