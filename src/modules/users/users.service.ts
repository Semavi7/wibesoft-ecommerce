import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanımda.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. Kaydet
    const userToSave = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.usersRepository.create(userToSave);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); 

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id); 
    await this.usersRepository.delete(id);
    return { message: 'Kullanıcı başarıyla silindi', id };
  }
}