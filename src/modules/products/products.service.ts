import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll() {
    return this.productsRepository.findAll();
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const updatedProduct = await this.productsRepository.update(id, updateProductDto);
    return updatedProduct;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productsRepository.delete(id);
    return { message: 'Ürün başarıyla silindi', id };
  }
}
