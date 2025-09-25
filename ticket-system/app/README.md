# Sistema de Gerenciamento de Tickets

Este é um sistema de gerenciamento de tickets desenvolvido com React Native, criado como parte de um trabalho para o Senai. Este documento detalha a estrutura do projeto, funcionalidades, e as melhorias implementadas.

## Funcionalidades

*   **Login de Administrador:** Acesso restrito para administradores gerenciarem tickets.
*   **Login de Aluno:** Acesso para alunos abrirem e acompanharem seus tickets.
*   **Gerenciamento de Tickets:** Criação, visualização e atualização de tickets.
*   **Temas:** Suporte a temas claro e escuro para melhor experiência do usuário.
*   **Recuperação de Senha (Aluno):** Funcionalidade para alunos redefinirem suas senhas usando a matrícula.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
ticket-system/
├── app/                  # Contém o código-fonte do aplicativo React Native
│   ├── assets/           # Imagens e outros recursos estáticos
│   ├── src/              # Código-fonte principal da aplicação
│   │   ├── components/   # Componentes reutilizáveis da UI
│   │   ├── navigation/   # Configuração de navegação (AdminTabs)
│   │   ├── screens/      # Telas principais da aplicação
│   │   │   ├── admins/   # Telas específicas para administradores (Login, Cadastro, Histórico de Turmas)
│   │   │   ├── students/ # Telas específicas para alunos (Login, Início, Recebimento, Validação, Recuperação de Senha)
│   │   │   └── ChooseRoleScreen.jsx # Tela de escolha de perfil (Aluno/Admin)
│   │   └── store/        # Configuração do Redux (gerenciamento de estado)
│   │   └── utils/        # Funções utilitárias e dados mock
│   ├── App.js            # Componente raiz da aplicação e configuração de navegação principal
│   ├── app.json          # Configurações do Expo
│   ├── package.json      # Dependências e scripts do projeto
│   └── ...
├── LICENSE               # Informações sobre a licença do projeto
└── README.md             # Este arquivo de documentação
```

## Melhorias Implementadas

As seguintes melhorias foram realizadas no projeto:

1.  **Remoção de Redundâncias e Comentários Úteis:**
    *   O código foi revisado para remover redundâncias e adicionar comentários explicativos onde necessário, visando melhorar a legibilidade e manutenção do código.

2.  **Renomeação de Classes:**
    *   A tela `HistoryScreen` (localizada em `src/screens/admins/HistoryScreen.jsx`) foi renomeada para `ClassListScreen` para refletir com mais precisão sua funcionalidade de listar turmas, e não um histórico geral.
    *   O componente `LoginScreen` em `src/screens/students/LoginScreen.jsx` foi renomeado para `StudentLoginScreen` para evitar conflito de nomes com `LoginScreen` em `src/screens/admins/LoginScreen.jsx`, que foi renomeado para `AdminLoginScreen`.

3.  **Funcionalidade de Recuperação de Senha (Aluno):**
    *   Foi implementada uma nova tela `ForgotPasswordScreen` (`src/screens/students/ForgotPasswordScreen.jsx`).
    *   Nesta tela, o aluno pode inserir sua matrícula e uma nova senha para redefini-la. A validação verifica se a matrícula existe e se as senhas digitadas coincidem.
    *   Um link "Esqueceu a senha?" foi adicionado à `StudentLoginScreen` para acesso a esta funcionalidade.

4.  **Ajustes nos Headers das Telas:**
    *   As telas `RegisterScreen` e `ClassHistoryScreen` (anteriormente `HistoryScreen`) agora possuem um header consistente com as demais telas.
    *   Este header inclui um botão para retornar à tela de `AdminLogin` e um botão para alternar entre os temas claro/escuro, proporcionando uma experiência de usuário unificada.
    *   O `AdminTabs` também foi ajustado para incluir o botão de voltar para o `AdminLogin` e o botão de tema.

## Como Rodar o Projeto

Para configurar e rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js e o Expo CLI instalados em sua máquina.

*   [Node.js](https://nodejs.org/)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

1.  Clone o repositório:
    ```shell
    git clone https://github.com/GustavoTavaresDosSantos/ticket-system.git
    ```
2.  Navegue até o diretório do aplicativo:
    ```shell
    cd ticket-system/app
    ```
3.  Instale as dependências:
    ```shell
    npm install
    ```

### Execução

Para iniciar o servidor de desenvolvimento do Expo:

```shell
npm start
```

Isso abrirá uma nova aba no seu navegador com o Expo Dev Tools. Você pode então:

*   Abrir o aplicativo em um emulador Android ou iOS.
*   Escanear o código QR com o aplicativo Expo Go no seu dispositivo móvel.

## Usuários de Teste

O sistema foi configurado com os seguintes usuários de teste:

### Alunos:

1.  **João Silva (DS-V1)**
    *   Matrícula: `12345678`
    *   Senha: `123456`
    *   Turma: Desenvolvimento de Sistemas/V1
    *   Recreio: 15:00 às 15:15
2.  **Maria Santos (DS-V2)**
    *   Matrícula: `87654321`
    *   Senha: `123456`
    *   Turma: Desenvolvimento de Sistemas/V2
    *   Recreio: 15:30 às 15:45
3.  **Pedro Oliveira (MA-V1)**
    *   Matrícula: `11111111`
    *   Senha: `123456`
    *   Turma: Mecânica Automotiva/V1
    *   Recreio: 16:00 às 16:15
4.  **Aluno de Teste (Teste)**
    *   Matrícula: `99999999`
    *   Senha: `999999`
    *   Turma: Turma de Teste
    *   Recreio: 00:00 às 23:59

### Administrador:

*   **Administrador**
    *   Login: `admin123`
    *   Senha: `admin123`

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

