import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../guards/auth/auth.guard';
import { UsersModule } from '../users/users.module'; 
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [PrismaModule, UsersModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [NotesController],
  providers: [NotesService, AuthGuard],
})
export class NotesModule {}
