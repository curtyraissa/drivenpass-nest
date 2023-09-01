import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../guards/auth/auth.guard';
@Module({
  imports: [PrismaModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
