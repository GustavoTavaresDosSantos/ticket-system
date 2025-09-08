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

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Instruções de Teste

## Usuários de Teste Criados

O sistema foi configurado com os seguintes usuários de teste:

### Alunos:

1. **João Silva (DS-V1)**

   - Matrícula: `12345678`
   - Senha: `123456`
   - Turma: Desenvolvimento de Sistemas/V1
   - Recreio: 15:00 às 15:15

2. **Maria Santos (DS-V2)**

   - Matrícula: `87654321`
   - Senha: `123456`
   - Turma: Desenvolvimento de Sistemas/V2
   - Recreio: 15:30 às 15:45

3. **Pedro Oliveira (MA-V1)**

   - Matrícula: `11111111`
   - Senha: `123456`
   - Turma: Mecânica Automotiva/V1
   - Recreio: 16:00 às 16:15

4. **Aluno de Teste (Teste)**
   - Matrícula: `99999999`
   - Senha: `999999`
   - Turma: Turma de Teste
   - Recreio: 00:00 às 23:59

### Administrador:

- **Administrador**
  - Login: `admin123`
  - Senha: `admin123`

## Como Testar

### 1. Executar o Projeto

```bash
cd app
npm start
```

### 2. Fluxo de Teste do Aluno

1. **Tela Inicial**: Escolha "Aluno"
2. **Login**: Use uma das matrículas e senhas acima
3. **HomeScreen**:
   - Visualize o horário do recreio da turma
   - Observe o contador de tempo até o recreio
   - O botão "Acessar Recreio" só fica habilitado 5 minutos antes do recreio
4. **ReceiveScreen** (quando habilitado):
   - Veja o mapa com sua localização
   - O botão "Validar Ticket" só funciona quando estiver no local correto
5. **ValidateScreen**:
   - Visualize o ticket gerado
   - Clique em "Rasgar Ticket" para simular o atendente
6. **Retorno à HomeScreen**:
   - Veja que o ticket foi marcado como resgatado

### 3. Validações Implementadas

- ✅ Só funciona de Segunda a Quinta-feira
- ✅ Só funciona no horário de aula (13:45 às 17:15)
- ✅ Acesso liberado apenas 5 minutos antes do recreio
- ✅ Um ticket por dia por aluno
- ✅ Verificação de localização (simulada)
- ✅ Tema claro/escuro funcional

### 4. Funcionalidades das Telas

#### HomeScreen

- Exibe horário do recreio da turma
- Contador em tempo real até o recreio
- Botão habilitado apenas no horário correto
- Indicação visual quando ticket já foi resgatado
- Botão de mudança de tema no header

#### ReceiveScreen

- Mapa com localização do usuário
- Marcador da escola no mapa
- Status da localização (correto/incorreto)
- Contador de tempo restante do recreio (incluindo 5 min extras)
- Botão habilitado apenas quando no local correto

#### ValidateScreen

- Ticket visual com design atrativo
- Informações do aluno e turma
- Número único do ticket
- Botão para o atendente rasgar o ticket
- Animação de ticket rasgado
- Redirecionamento automático para HomeScreen

### 5. Observações Importantes

- Para testar a funcionalidade completa, você pode ajustar os horários no código temporariamente
- A verificação de localização está simulada (considera correto se estiver a menos de 100m da coordenada da escola)
- O sistema persiste o estado do ticket usando AsyncStorage
- Todos os temas (claro/escuro) são aplicados consistentemente em todas as telas

### 6. Dependências Instaladas

- `expo-location`: Para geolocalização
- `react-native-maps`: Para exibição do mapa
- `expo-linear-gradient`: Para gradientes no ticket
- `@react-navigation/native`: Para navegação
- `@reduxjs/toolkit`: Para gerenciamento de estado
- `formik` e `yup`: Para validação de formulários
