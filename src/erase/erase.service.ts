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

    // Verifica se a senha fornecida corresponde à senha do usuário
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // Se a senha não corresponder, lança uma exceção de Unauthorized
      throw new UnauthorizedException('Invalid password');
    }

    // Deleta as credenciais relacionadas ao usuário
    await this.prisma.credential.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Deleta as notas relacionadas ao usuário
    await this.prisma.note.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Deleta os cartões relacionados ao usuário
    await this.prisma.card.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Deleta as sessões do usuário
    await this.prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Finalmente, deleta o próprio usuário
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
}
