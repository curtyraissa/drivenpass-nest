import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User, Credential } from '@prisma/client';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async createCredential(user: User, createCredentialDto: CreateCredentialDto): Promise<Credential> {
    const { title, url, username, password } = createCredentialDto;

    const existingCredential = await this.credentialsRepository.findCredentialByTitleAndUserId(title, user.id);
    if (existingCredential) {
      throw new ConflictException(`You already have '${title}' as a title!`);
    }

    const cryptr = new Cryptr('your-secret-key');
    const encryptedPassword = cryptr.encrypt(password);

    return this.credentialsRepository.createCredential(
      { title, url, username, password },
      user.id
    );
  }

  async getAllCredentials(user: User): Promise<Credential[]> {
    return this.credentialsRepository.findAllCredentials(user.id);
  }

  async getCredentialById(id: number, user: User): Promise<Credential> {
    const credential = await this.credentialsRepository.findCredentialByIdAndUserId(id, user.id);
    if (!credential) {
      throw new NotFoundException('Credential not found');
    }
    return credential;
  }

  async deleteCredentialById(id: number, user: User): Promise<void> {
    const credential = await this.credentialsRepository.findCredentialByIdAndUserId(id, user.id);
    if (!credential) {
      throw new NotFoundException('Credential not found');
    }
    await this.credentialsRepository.deleteCredentialByIdAndUserId(id, user.id);
  }
}
