import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';

// Aplica o guard de autenticação em todo o controlador
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }

  // Define um endpoint POST para criar uma nova credencial
  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  // Define um endpoint GET para listar todas as credenciais do usuário
  @Get()
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  // Define um endpoint GET para buscar uma credencial específica por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.credentialsService.findOne(id, user);
  }

  // Define um endpoint DELETE para remover uma credencial por ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o código de resposta HTTP para 'NO_CONTENT' (204)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.credentialsService.remove(id, user);
  }
}
