import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Sepeti Siparişe Dönüştür (Checkout)' })
  @ApiQuery({ name: 'userId', required: true, description: 'Test Kullanıcı ID' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<OrderResponseDto> {
    
    const order = await this.ordersService.create(userId, createOrderDto);
    return plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının geçmiş siparişlerini getir' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async findAll(@Query('userId', ParseUUIDPipe) userId: string): Promise<OrderResponseDto[]> {
    
    const orders = await this.ordersService.findAllByUser(userId);
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