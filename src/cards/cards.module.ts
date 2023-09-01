import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../guards/auth/auth.guard';
@Module({
  imports: [PrismaModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
