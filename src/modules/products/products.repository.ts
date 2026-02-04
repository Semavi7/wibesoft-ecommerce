import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsRepository {
  private productRepo: Repository<Product>;

  constructor(private readonly dataSource: DataSource) {
    this.productRepo = this.dataSource.getRepository(Product);
  }

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Product>) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }
}