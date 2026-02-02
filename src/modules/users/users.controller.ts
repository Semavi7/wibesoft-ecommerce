import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
// import { AuthGuard } from '@nestjs/passport'; 
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt')) 
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  @Get(':id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Tekil kullanıcı detayı getir' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur (Register)' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, newUser, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Kullanıcıyı güncelle' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return plainToInstance(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Kullanıcıyı sil' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla silindi.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}