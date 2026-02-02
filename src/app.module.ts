import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './modules/products/entities/product.entity';
import { ProductsModule } from './modules/products/products.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: "postgres",
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        entities: [Product, User],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ProductsModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
