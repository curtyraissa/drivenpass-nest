import { Controller, Post, Body, Get, Param, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
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
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.usersService.generateJwtToken(user);

    return { accessToken };
  }
}
