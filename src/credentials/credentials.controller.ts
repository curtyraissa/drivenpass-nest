import { AuthGuard } from '../guards/auth/auth.guard';
import { User } from '../decorators/user/user.decorator';
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  async create(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    try {
      return await this.credentialsService.createCredential(user, createCredentialDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.credentialsService.getAllCredentials(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    try {
      return await this.credentialsService.getCredentialById(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    try {
      await this.credentialsService.deleteCredentialById(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
