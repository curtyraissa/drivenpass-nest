
<h1 align="center">Driven Pass</h1>

✅ Requisitos
- Geral
    - [ ]  O projeto deve ser desenvolvido inteiramente em NestJS.
    - [ ]  A porta utilizada pelo seu servidor deve ser a `3000` (padrão do Nest) em desenvolvimento.
    - [ ]  Versionamento usando Git é obrigatório, crie um repositório público no seu perfil do GitHub apenas com o código do back-end.
    - [ ]  Faça commits a cada funcionalidade implementada.
    - [ ]  Utilize o dotenv.
    - [ ]  Utilize o Prisma para gerenciar o banco de dados e executar as queries necessárias.
    - [ ]  É necessário implementar a camada de repository para executar o acesso ao banco, não utilize a camada de service para isso!
    - [ ]  Divida o código em módulos (`@Modules`)! Crie um para o Prisma e para cada uma das entidades separadamente.
- Modelagem
    - A modelagem do banco de dados desta aplicação ficará ao seu critério.
    - Leia os requisitos das rotas e elabore o schema de acordo com o que foi solicitado e o que você acredita ser necessário para a aplicação.
- Rotas
    - 🔓 Health (`/health`)
        - Rota somente para garantir que a aplicação está em pé.
        - [ ]  **GET** `/health`: Retorna a mensagem `“I’m okay!”` com o status code `200 OK`.
    - 🔓 Usuários (`/users`)
        - A aplicação deve fornecer uma forma das pessoas criarem contas e utiliza-las.
            - Criação de contas
                - O usuário deve fornecer um e-mail válido e uma senha para poder criar um usuário. Se o e-mail já estiver em uso, a aplicação não pode criar a conta (`409` `Conflict`). A senha precisa ser segura, ou seja, pelo menos 10 caracteres, 1 número, 1 letra minúscula, 1 letra maiúscula e um 1 caractere especial (`400 Bad Request`).
                - Por ser um dado extremamente sensível, a senha precisa ir para o banco criptografada. Utilize a biblioteca [bcrypt](https://www.npmjs.com/package/bcrypt) para isso.
            - Acesso de uma conta
                - O usuário deverá utilizar o e-mail e senha cadastrados. Caso ele forneça dados incompatíveis, a aplicação deverá avisá-lo (`401 Unauthorized`). Ao finalizar o login, ele deverá receber um token baseado na estratégia JWT. Utilize a biblioteca [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) para isso.
                - **Esse token deverá ser enviado em todas as requisições para identificar o usuário.**
    - 🔒 Credenciais (`/credentials`)
        - Credenciais se referem a informações de login para um site e/ou serviço. Cada usuário pode armazenar inúmeras credenciais (ex: “facebook” ⇒ user: driven, senha: dr1VeNF@ceb00k).
            - Criação de credenciais
                - Para registrar uma nova credencial, o usuário deverá fornecer uma url, um nome de usuário e uma senha. O usuário também precisa informar um título/nome/rótulo para essa credencial, uma vez que é possível cadastrar duas credenciais para um mesmo site.  Caso nenhum dos dados seja enviado, retorne `400 Bad Request`.
                - Cada credencial deve possuir um título/nome/rótulo único, ou seja, se o usuário tentar criar duas credenciais com o mesmo nome, a aplicação deve impedi-lo (o que não impede que outras pessoas usem esse título) `409 Conflict`.
                - Por ser um dado sensível, o campo de senha da credencial deve ser criptografado usando um segredo da aplicação. Use a biblioteca [cryptr](https://www.npmjs.com/package/cryptr) para isso.
            - Busca de credenciais
                - A aplicação deve fornecer uma forma de obter todas as credenciais ou uma credencial específica (através do seu id). Se o usuário procurar por uma credencial que não é dele (`403 Forbidden`) ou que não existe (`404 Not Found`), a aplicação deve avisar.
                - Todas as credenciais retornadas devem aparecer com a senha descriptografada (`200 Ok`).
            - Deleção de credenciais
                - Aplicação deve permitir que uma credencial seja deletada (dado o seu id). Se o id não existir (`404 Not Found`) ou pertencer a credencial de outra pessoa (`403 Forbidden`), a aplicação deve avisar.
    - 🔒 Notas Seguras (`/notes`)
        - Notas Seguras são informações livres em formato de texto.
            - Criação de notas seguras
                - Para registrar uma nova nota segura, o usuário deverá fornecer um título/nome/rótulo e a anotação si. Caso nenhum dos dados seja enviado, retorne `400 Bad Request`.
                - Cada anotação deve possuir um título único, ou seja, se o usuário tentar criar duas anotações com o mesmo nome, a aplicação deve impedi-lo (o que não impede que outras pessoas usem esse título) `409 Conflict`.
            - Busca de notas seguras
                - A aplicação deve fornecer uma forma de obter todas as notas seguras ou uma nota segura específica (através do seu id). Se o usuário procurar por uma nota segura que não é dele (`403 Forbidden`) ou que não existe (`404 Not Found`), a aplicação deve avisar.
            - Deleção de notas seguras
                - A aplicação deve permitir que uma nota segura seja deletada (dado o seu id). Se o id não existir (`404 Not Found`) ou pertencer a nota segura de outras pessoas (`403 Forbidden`), a aplicação deve avisar.
    - 🔒 Cartões (`/cards`)
        - Cartões representam cartões de crédito e/ou débito.
            - Criação de cartões
                - Para registrar um novo cartão, o usuário deverá fornecer o número do cartão, o nome impresso, o código de segurança, a data de expiração, a senha, se ele é virtual e o seu tipo (crédito, débito ou ambos).  Caso nenhum dos dados seja enviado, retorne `400 Bad Request`.
                - Cada cartão deve possuir um título/nome/rótulo único, ou seja, se o usuário tentar criar dois cartões com o mesmo nome, a aplicação deve impedi-lo (o que não impede que outras pessoas usem esse título) `409 Conflict`.
                - Por ser informações sensíveis, o código de segurança e a a senha do cartão devem ser criptografadas usando um segredo da aplicação. Use a biblioteca [cryptr](https://www.npmjs.com/package/cryptr) para isso.
            - Busca de cartões
                - A aplicação deve fornecer uma forma de obter todos os seus cartões ou um cartão específico (através do seu id). Se o usuário procurar por um cartão que não é dele (`403 Forbidden`) ou que não existe (`404 Not Found`), a aplicação deve avisar.
            - Deleção de cartões
                - A aplicação deve permitir que um cartão seja deletado (dado o seu id). Se o id não existir (`404 Not Found`) ou pertencer ao cartão de outra pessoa (`403 Forbidden`), a aplicação deve avisar.
    - 🔒 Deletar dados (`/erase`)
        - Rota que possibilita com que o usuário possa deletar sua conta.
        - Quando isso acontece, os dados de credenciais, notas, cartões e afins são deletados do banco de dados. E por fim, o próprio cadastro do usuário.
        - Como se trata de uma ação destrutiva, a senha deve ser enviada novamente no corpo da requisição para que a ação seja feita. Se estiver incorreta, enviar `401 Unauthorized`.
    
    *🔒: Recurso necessita autenticação*
    
    *🔓: Recurso não necessita autenticação*
    
- Testes automatizados (integração)
    - [ ]  Desenvolva testes de integração para todas as rotas.
    - [ ]  Configure um banco de dados somente para testes.
    - [ ]  Quando aplicável, use o padrão de projeto factories e a biblioteca faker.
- Deploy
    - O projeto deve ser deployado no [Render.com](http://Render.com) com o banco de dados no [ElephantSQL](https://www.elephantsql.com/) (ou serviços semelhantes).
    - Atente-se as configurações necessárias! Ajuste seus scripts/configurações para que:
        - A porta da aplicação seja dinâmica.
        - O back-end possa se conectar ao banco de dados.
        - A versão do node é compatível (a versão default do Render não funcionará com o Prisma). Leia mais na documentação abaixo:
            
            [Specifying a Node Version | Render](https://render.com/docs/node-version)
            
        - A instalação das dependências, o build do projeto, a execução do prisma (e eventual seed, se aplicável) deve ser feito antes da aplicação subir.
        - Atente-se ao comando utilizado para iniciar o back-end.
- Documentação com o Swagger
    - A especificação OpenAPI é um formato de definição independente de linguagem usado para descrever APIs RESTful. O NestJS fornece um módulo dedicado que permite gerar tal especificação aproveitando o recurso de decoradores.
    - Use o módulo do Swagger integrado ao NestJS (é necessário instalá-lo) e documente todos os endpoints da API.
    - A página de documentação deve abrir no `/api` da sua aplicação.


## 🛠 &nbsp;Skills
<div align="center">
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" width="52" alt="node logo"  />
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" width="52" alt="ts logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" width="52" alt="js logo"  />      
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" width="52" alt="express logo"  />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" height="40" width="52" alt="npm logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" width="52" alt="git logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="40" width="52" alt="github logo" />                                   
</div>
<hr/>

## 🚀 &nbsp;Links

- [Deploy]().<br/>

```zsh
# iniciar servidor
npm run start

# testar
npm run test:e2e
```

<hr/>

## 💬 &nbsp;Contact
<img align="left" src="https://avatars.githubusercontent.com/curtyraissa?size=100">

Feito por [Raissa Curty](https://github.com/curtyraissa)!

<a href="https://www.linkedin.com/in/raissa-curty/" target="_blank">
    <img style="border-radius:50%;" src="https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/linkedin/default.svg" width="52" height="40" alt="linkedin logo"  />
</a>&nbsp;