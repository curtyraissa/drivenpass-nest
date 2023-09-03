import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../guards/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    PrismaModule,UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [CardsController],
  providers: [CardsService, AuthGuard],
})
export class CardsModule {}
