import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @User() user: UserPrisma,
  ) {
    const note = await this.notesService.create(user, createNoteDto);
    return note;
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    const notes = await this.notesService.findAll(user);
    return notes;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    const note = await this.notesService.findOne(id, user);
    return note;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: CreateNoteDto,
    @User() user: UserPrisma,
  ) {
    const note = await this.notesService.update(id, user, updateNoteDto);
    return note;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    await this.notesService.remove(id, user);
  }
}
