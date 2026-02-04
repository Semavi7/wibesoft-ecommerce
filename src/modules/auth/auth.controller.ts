import { Controller, Post, Body, UseGuards, Res, HttpCode, Get } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Giriş Yap ve HttpOnly Cookie Al' })
  @ApiBody({ type: LoginDto })
  async login(@CurrentUser() user, @Res({ passthrough: true }) response: Response) {
    const { accessToken, user: userData } = await this.authService.login(user);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 
    });

    return {
      message: 'Giriş başarılı',
      user: plainToInstance(UserResponseDto, userData, { excludeExtraneousValues: true })
    };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Kayıt Ol' })
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, newUser, { excludeExtraneousValues: true });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Çıkış Yap (Cookie siler)' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    return { message: 'Çıkış yapıldı' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Profil Bilgisi (Test)' })
  getProfile(@CurrentUser() user) {
    return user;
  }
}