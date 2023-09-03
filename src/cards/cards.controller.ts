import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';

@UseGuards(AuthGuard) // Aplica o guard de autenticação em todo o controlador
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // Define um endpoint POST para criar um novo cartão
  @Post()
  async create(
    @Body() createCardDto: CreateCardDto,
    @User() user: UserPrisma,
  ) {
    const card = await this.cardsService.create(user, createCardDto);
    return card;
  }

  // Define um endpoint GET para listar todos os cartões do usuário
  @Get()
  async findAll(@User() user: UserPrisma) {
    const cards = await this.cardsService.findAll(user);
    return cards;
  }

  // Define um endpoint GET para buscar um cartão específico por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    const card = await this.cardsService.findOne(id, user);
    return card;
  }

  // Define um endpoint DELETE para remover um cartão por ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o código de resposta HTTP para 'NO_CONTENT' (204)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    await this.cardsService.remove(id, user);
  }
}
