import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Card } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um novo cartão para o usuário
  async create(user: User, createCardDto: CreateCardDto): Promise<Card> {
    // Verifica se já existe um cartão com o mesmo título para o mesmo usuário
    const existingCard = await this.prisma.card.findFirst({
      where: {
        title: createCardDto.title,
        userId: user.id,
      },
    });

    if (existingCard) {
      throw new ConflictException(`You already have a card with the title '${createCardDto.title}'!`);
    }

    // Cria o novo cartão no banco de dados
    return this.prisma.card.create({
      data: {
        ...createCardDto,
        userId: user.id,
      },
    });
  }

  // Lista todos os cartões do usuário
  async findAll(user: User): Promise<Card[]> {
    return this.prisma.card.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  // Busca um cartão específico por ID pertencente ao usuário
  async findOne(id: number, user: User): Promise<Card> {
    const card = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });

    if (!card || card.userId !== user.id) {
      throw new NotFoundException('Card not found or does not belong to you!');
    }

    return card;
  }

  // Remove um cartão por ID após verificar se ele pertence ao usuário
  async remove(id: number, user: User): Promise<void> {
    const card = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });

    if (!card || card.userId !== user.id) {
      throw new NotFoundException('Card not found or does not belong to you!');
    }

    // Deleta o cartão do banco de dados
    await this.prisma.card.delete({
      where: {
        id,
      },
    });
  }
}
