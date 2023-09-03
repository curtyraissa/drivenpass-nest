import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Cryptr from 'cryptr';
import { User, Credential } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma nova credencial para o usuário
  async create(user: User, createCredentialDto: CreateCredentialDto) {
    // Verifica se já existe uma credencial com o mesmo título para o mesmo usuário
    const existingCredential = await this.prisma.credential.findFirst({
      where: {
        title: createCredentialDto.title,
        userId: user.id,
      },
    });

    if (existingCredential) {
      throw new ConflictException(`You already have '${createCredentialDto.title}' as a title!`);
    }

    // Criptografa a senha antes de armazená-la no banco de dados
    const encryptedPassword = this.encryptPassword(createCredentialDto.password);

    // Cria a nova credencial no banco de dados
    const newCredential = await this.prisma.credential.create({
      data: {
        title: createCredentialDto.title,
        url: createCredentialDto.url,
        username: createCredentialDto.username,
        password: encryptedPassword,
        userId: user.id,
      },
    });

    return newCredential;
  }

  // Lista todas as credenciais do usuário, descriptografando as senhas
  async findAll(user: User) {
    const credentials = await this.prisma.credential.findMany({
      where: {
        userId: user.id,
      },
    });

    // Descriptografa as senhas antes de retornar as credenciais
    const decryptedCredentials = credentials.map((c) => {
      const decryptedPassword = this.decryptPassword(c.password);
      return { ...c, password: decryptedPassword };
    });

    return decryptedCredentials;
  }

  // Busca uma credencial específica por ID, descriptografando a senha
  async findOne(id: number, user: User) {
    const credential = await this.credentialErrors(id, user);

    // Descriptografa a senha antes de retornar a credencial
    credential.password = this.decryptPassword(credential.password);

    return credential;
  }

  // Remove uma credencial por ID após verificar se ela pertence ao usuário
  async remove(id: number, user: User) {
    await this.credentialErrors(id, user);

    // Deleta a credencial do banco de dados
    await this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }

  // Remove todas as credenciais de um usuário por ID de usuário
  async deleteAllByUserId(userId: number) {
    await this.prisma.credential.deleteMany({
      where: {
        userId,
      },
    });
  }

  // Função privada que verifica se uma credencial existe e pertence ao usuário
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

  // Função privada para criptografar uma senha
  private encryptPassword(password: string): string {
    const cryptr = new Cryptr('your-secret-key');
    return cryptr.encrypt(password);
  }

  // Função privada para descriptografar uma senha
  private decryptPassword(password: string): string {
    const cryptr = new Cryptr('your-secret-key');
    return cryptr.decrypt(password);
  }
}
