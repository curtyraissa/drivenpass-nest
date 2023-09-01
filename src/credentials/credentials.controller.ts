import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }

  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.credentialsService.findOne(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.credentialsService.remove(id, user);
  }
}
