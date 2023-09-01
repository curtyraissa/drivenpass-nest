import { Controller, Delete, Body, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseAccountDto } from './dto/create-erase.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user/user.decorator';
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  async eraseAccount(@User() user: UserPrisma, @Body() eraseAccountDto: EraseAccountDto): Promise<void> {
    return this.eraseService.eraseAccount(user, eraseAccountDto);
  }
}
