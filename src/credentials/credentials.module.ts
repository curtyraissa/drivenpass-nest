import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, UsersModule, JwtModule.register({secret: process.env.JWT_SECRET})],
  controllers: [CredentialsController],
  providers: [CredentialsService],
  exports: [CredentialsService]
})
export class CredentialsModule {}


