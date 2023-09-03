import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [EraseController],
  providers: [EraseService],
})
export class EraseModule {}