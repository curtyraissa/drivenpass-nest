import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Cryptr from 'cryptr';
import { User, Credential } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createCredentialDto: CreateCredentialDto) {
    const existingCredential = await this.prisma.credential.findFirst({
      where: {
        title: createCredentialDto.title,
        userId: user.id,
      },
    });

    if (existingCredential) {
      throw new ConflictException(`You already have '${createCredentialDto.title}' as a title!`);
    }

    const encryptedPassword = this.encryptPassword(createCredentialDto.password);

    const newCredential = await this.prisma.credential.create({
      data: {
        title: createCredentialDto.title,
        url: createCredentialDto.url,
        username: createCredentialDto.username,
        password: encryptedPassword,
        userId: createCredentialDto.userId,
      },
    });

    return newCredential;
  }

  async findAll(user: User) {
    const credentials = await this.prisma.credential.findMany({
      where: {
        userId: user.id,
      },
    });

    const decryptedCredentials = credentials.map((c) => {
      const decryptedPassword = this.decryptPassword(c.password);
      return { ...c, password: decryptedPassword };
    });

    return decryptedCredentials;
  }

  async findOne(id: number, user: User) {
    const credential = await this.credentialErrors(id, user);
    credential.password = this.decryptPassword(credential.password);
    return credential;
  }

  async remove(id: number, user: User) {
    await this.credentialErrors(id, user);
    await this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllByUserId(userId: number) {
    await this.prisma.credential.deleteMany({
      where: {
        userId,
      },
    });
  }

  private async credentialErrors(id: number, user: User) {
    const credential = await this.prisma.credential.findUnique({
      where: {
        id,
      },
    });

    if (!credential || credential.userId !== user.id) {
      throw new NotFoundException('Credential not found or does not belong to you!');
    }

    return credential;
  }

  private encryptPassword(password: string): string {
    const cryptr = new Cryptr('your-secret-key');
    return cryptr.encrypt(password);
  }

  private decryptPassword(password: string): string {
    const cryptr = new Cryptr('your-secret-key');
    return cryptr.decrypt(password);
  }
}
