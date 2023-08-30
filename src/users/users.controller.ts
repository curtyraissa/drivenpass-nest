import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const result = await this.usersService.loginUser(loginDto.email, loginDto.password);
      return result;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
