import { Controller, Delete, Body, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseAccountDto } from './dto/create-erase.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';

// Aplica o guard de autenticação em todo o controlador
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  // Define um endpoint DELETE para a rota 'erase'
  @Delete()
  async eraseAccount(@User() user: UserPrisma, @Body() eraseAccountDto: EraseAccountDto): Promise<void> {
    // Chama o serviço de exclusão de conta com o usuário autenticado e os dados fornecidos no corpo da solicitação
    return this.eraseService.eraseAccount(user, eraseAccountDto);
  }
}
