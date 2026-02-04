import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Sepeti Siparişe Dönüştür (Checkout)' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(
    @CurrentUser() user: ICurrentUser,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<OrderResponseDto> {

    const order = await this.ordersService.create(user.id, createOrderDto);
    return plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının geçmiş siparişlerini getir' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async findAll(@CurrentUser() user: ICurrentUser): Promise<OrderResponseDto[]> {

    const orders = await this.ordersService.findAllByUser(user.id);
    return plainToInstance(OrderResponseDto, orders, { excludeExtraneousValues: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sipariş detayını getir' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {

    const order = await this.ordersService.findOne(id);
    return plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true });
  }
}