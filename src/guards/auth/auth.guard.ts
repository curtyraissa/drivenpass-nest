import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtém o objeto de solicitação a partir do contexto
    const request = context.switchToHttp().getRequest();

    // Obtém o cabeçalho de autorização da solicitação
    const authorizationHeader = request.headers.authorization;

    // Verifica se o cabeçalho de autorização existe e começa com 'Bearer '
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return false;
    }

    // Divide o cabeçalho de autorização para extrair o token JWT
    const token = authorizationHeader.split(' ')[1];

    try {
      // Verifica e decodifica o token JWT usando o serviço JwtService
      const decodedToken = this.jwtService.verify(token);

      // Obtém o ID do usuário a partir do token decodificado
      const userId = decodedToken.userId;

      // Busca o usuário no serviço UsersService com base no ID
      const user = await this.usersService.findUserById(userId);

      // Se o usuário não for encontrado, a autenticação falha
      if (!user) {
        return false;
      }

      // Define o objeto 'user' na solicitação para que ele possa ser acessado posteriormente pelo controlador
      request.user = user;

      // A autenticação é bem-sucedida
      return true;
    } catch (error) {
      // Em caso de erro na verificação ou decodificação do token, a autenticação falha
      return false;
    }
  }
}
