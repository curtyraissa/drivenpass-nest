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

// Aplica o guard de autenticação em todo o controlador
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // Define um endpoint POST para criar uma nova nota
  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @User() user: UserPrisma,
  ) {
    // Chama o serviço para criar uma nota com os dados fornecidos
    const note = await this.notesService.create(user, createNoteDto);
    return note;
  }

  // Define um endpoint GET para listar todas as notas do usuário
  @Get()
  async findAll(@User() user: UserPrisma) {
    // Chama o serviço para buscar todas as notas do usuário autenticado
    const notes = await this.notesService.findAll(user);
    return notes;
  }

  // Define um endpoint GET para buscar uma nota específica por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    // Chama o serviço para buscar uma nota por ID pertencente ao usuário autenticado
    const note = await this.notesService.findOne(id, user);
    return note;
  }

  // Define um endpoint PUT para atualizar uma nota existente por ID
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: CreateNoteDto,
    @User() user: UserPrisma,
  ) {
    // Chama o serviço para atualizar uma nota por ID pertencente ao usuário autenticado
    const note = await this.notesService.update(id, user, updateNoteDto);
    return note;
  }

  // Define um endpoint DELETE para remover uma nota por ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o código de resposta HTTP para 'NO_CONTENT' (204)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    // Chama o serviço para remover uma nota por ID pertencente ao usuário autenticado
    await this.notesService.remove(id, user);
  }
}
