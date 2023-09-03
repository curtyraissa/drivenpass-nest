import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

// Cria um decorator personalizado chamado 'User'
export const User = createParamDecorator((data: string, context: ExecutionContext) => {
  // Obtém o objeto de solicitação a partir do contexto
  const request = context.switchToHttp().getRequest();
  
  // Verifica se o objeto de solicitação possui a propriedade 'user'
  if (!request.user) {
    // Se não houver um usuário na solicitação, lança uma NotFoundException
    throw new NotFoundException('User not found.');
  }
  
  // Retorna o usuário autenticado da solicitação, que será injetado como um parâmetro
  return request.user;
});
