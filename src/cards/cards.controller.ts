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

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(
    @Body() createCardDto: CreateCardDto,
    @User() user: UserPrisma,
  ) {
    const card = await this.cardsService.create(user, createCardDto);
    return card;
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    const cards = await this.cardsService.findAll(user);
    return cards;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    const card = await this.cardsService.findOne(id, user);
    return card;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    await this.cardsService.remove(id, user);
  }
}
