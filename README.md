# Sistema de Gerenciamento de Tickets

Este é um sistema de gerenciamento de tickets desenvolvido com React Native, criado como parte de um trabalho para o Senai.

## Funcionalidades

- **Login de Administrador:** Acesso restrito para administradores gerenciarem tickets.
- **Login de Aluno:** Acesso para alunos abrirem e acompanharem seus tickets.
- **Gerenciamento de Tickets:** Criação, visualização e atualização de tickets.
- **Temas:** Suporte a temas claro e escuro para melhor experiência do usuário.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
ticket-system/
├── app/                  # Contém o código-fonte do aplicativo React Native
│   ├── assets/           # Imagens e outros recursos estáticos
│   ├── src/              # Código-fonte principal da aplicação
│   │   ├── components/   # Componentes reutilizáveis da UI
│   │   ├── screens/      # Telas principais da aplicação
│   │   │   ├── admins/   # Telas específicas para administradores (Login, Histórico)
│   │   │   ├── students/ # Telas específicas para alunos (Login, Histórico)
│   │   │   └── ChooseRoleScreen.jsx # Tela de escolha de perfil (Aluno/Admin)
│   │   └── store/        # Configuração do Redux (gerenciamento de estado)
│   ├── App.js            # Componente raiz da aplicação
│   ├── app.json          # Configurações do Expo
│   ├── package.json      # Dependências e scripts do projeto
│   └── ...
└── README.md             # Este arquivo
```

## Como Rodar o Projeto

Para configurar e rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js e o Expo CLI instalados em sua máquina.

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/GustavoTavaresDosSantos/ticket-system.git
   ```

2. Navegue até o diretório do aplicativo:

   ```bash
   cd ticket-system/app
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

### Execução

Para iniciar o servidor de desenvolvimento do Expo:

```bash
npm start
```

Isso abrirá uma nova aba no seu navegador com o Expo Dev Tools. Você pode então:

- Abrir o aplicativo em um emulador Android ou iOS.
- Escanear o código QR com o aplicativo Expo Go no seu dispositivo móvel.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. (Nota: O arquivo LICENSE não está presente no repositório original, mas é uma boa prática incluí-lo.)


