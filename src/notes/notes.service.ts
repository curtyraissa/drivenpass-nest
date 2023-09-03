import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User, Note } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma nova nota associada a um usuário
  async create(user: User, createNoteDto: CreateNoteDto): Promise<Note> {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        userId: user.id,
      },
    });
  }

  // Atualiza uma nota existente, verificando se pertence ao usuário autenticado
  async update(id: number, user: User, updateNoteDto: CreateNoteDto): Promise<Note> {
    // Verifica se a nota existe e se pertence ao usuário autenticado
    const existingNote = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!existingNote || existingNote.userId !== user.id) {
      throw new NotFoundException('Note not found or does not belong to you!');
    }

    // Atualiza a nota com os novos dados fornecidos
    return this.prisma.note.update({
      where: {
        id,
      },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
      },
    });
  }

  // Lista todas as notas de um usuário
  async findAll(user: User): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  // Busca uma nota específica por ID, verificando se pertence ao usuário autenticado
  async findOne(id: number, user: User): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note || note.userId !== user.id) {
      throw new NotFoundException('Note not found or does not belong to you!');
    }

    return note;
  }

  // Remove uma nota por ID, verificando se pertence ao usuário autenticado
  async remove(id: number, user: User): Promise<void> {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note || note.userId !== user.id) {
      throw new NotFoundException('Note not found or does not belong to you!');
    }

    // Deleta a nota do banco de dados
    await this.prisma.note.delete({
      where: {
        id,
      },
    });
  }
}
