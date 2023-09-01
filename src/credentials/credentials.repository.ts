import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User, Credential } from '@prisma/client';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCredential(createCredentialDto: CreateCredentialDto, userId: number): Promise<Credential> {
    const { title, url, username, password } = createCredentialDto;

    try {
      return this.prisma.credential.create({
        data: {
          title,
          url,
          username,
          password,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('title_unique')) {
        throw new ConflictException(`You already have '${title}' as a title!`);
      }
      throw error;
    }
  }

  async findAllCredentials(userId: number): Promise<Credential[]> {
    return this.prisma.credential.findMany({
      where: {
        userId,
      },
    });
  }

  async findCredentialByIdAndUserId(id: number, userId: number): Promise<Credential | null> {
    const credential = await this.prisma.credential.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    return credential;
  }

  async deleteCredentialByIdAndUserId(id: number, userId: number): Promise<void> {
    const credential = await this.findCredentialByIdAndUserId(id, userId);

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    await this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }

  async findCredentialByTitleAndUserId(title: string, userId: number): Promise<any> {
    return await this.prisma.credential.findFirst({
        where: {
            title,
            userId,
        },
    });
}
}
