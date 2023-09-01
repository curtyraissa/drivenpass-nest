import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Card } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createCardDto: CreateCardDto): Promise<Card> {
    const existingCard = await this.prisma.card.findFirst({
      where: {
        title: createCardDto.title,
        userId: user.id,
      },
    });

    if (existingCard) {
      throw new ConflictException(`You already have a card with the title '${createCardDto.title}'!`);
    }

    return this.prisma.card.create({
      data: {
        ...createCardDto,
        userId: user.id,
      },
    });
  }

  async findAll(user: User): Promise<Card[]> {
    return this.prisma.card.findMany({
      where: {
        userId: user.id,
      },
    });
  }

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

  async remove(id: number, user: User): Promise<void> {
    const card = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });

    if (!card || card.userId !== user.id) {
      throw new NotFoundException('Card not found or does not belong to you!');
    }

    await this.prisma.card.delete({
      where: {
        id,
      },
    });
  }
}
