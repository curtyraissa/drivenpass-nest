import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User, Note } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createNoteDto: CreateNoteDto): Promise<Note> {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        userId: user.id,
      },
    });
  }

  async update(id: number, user: User, updateNoteDto: CreateNoteDto): Promise<Note> {
    const existingNote = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!existingNote || existingNote.userId !== user.id) {
      throw new NotFoundException('Note not found or does not belong to you!');
    }

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

  async findAll(user: User): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        userId: user.id,
      },
    });
  }

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

  async remove(id: number, user: User): Promise<void> {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note || note.userId !== user.id) {
      throw new NotFoundException('Note not found or does not belong to you!');
    }

    await this.prisma.note.delete({
      where: {
        id,
      },
    });
  }
}

