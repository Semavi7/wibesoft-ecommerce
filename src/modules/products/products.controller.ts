import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tüm ürünleri listele' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    return plainToInstance(ProductResponseDto, products, { excludeExtraneousValues: true });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Tekil ürün detayı getir' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }

  @Post()
  @ApiOperation({ summary: 'Yeni ürün oluştur' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const newProduct = await this.productsService.create(createProductDto);
    return plainToInstance(ProductResponseDto, newProduct, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ürünü güncelle' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productsService.update(id, updateProductDto);
    return plainToInstance(ProductResponseDto, updatedProduct, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ürünü sil' })
  @ApiResponse({ status: 200, description: 'Ürün başarıyla silindi.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}