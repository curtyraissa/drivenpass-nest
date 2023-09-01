import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { EraseAccountDto } from './dto/create-erase.dto';

@Injectable()
export class EraseService {
  constructor(private readonly prisma: PrismaService) {}

  async eraseAccount(user: User, eraseAccountDto: EraseAccountDto): Promise<void> {
    const { password } = eraseAccountDto;
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // Deleta as credenciais, notas, cartões, etc. relacionados ao usuário
    await this.prisma.credential.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await this.prisma.note.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await this.prisma.card.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Deleta a sessão do usuário
    await this.prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Deleta o próprio usuário
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
}
