# Habit Legends

Transforme sua rotina em uma aventura.

O **Habit Legends** é uma aplicação web de produtividade gamificada em que o usuário cria missões pessoais, define a dificuldade de cada desafio e recebe **XP** e **ouro** ao concluir suas tarefas. As recompensas podem ser utilizadas para comprar itens, personalizar o avatar, desbloquear conquistas e avançar por uma jornada inspirada em jogos de RPG.

## Demonstração

Acesse o projeto online:

**https://habitlegends-3b9e7.web.app/**

> Para apresentar o projeto em processos seletivos, recomenda-se disponibilizar uma conta de demonstração separada, sem utilizar credenciais pessoais.

## Funcionalidades

- Cadastro e login com Firebase Authentication
- Sessão persistente e rotas protegidas
- Criação, edição e exclusão de missões
- Missões únicas, diárias e semanais
- Dificuldades com recompensas diferentes
- Sistema de XP, níveis e ouro
- Sequência de dias ativos
- Histórico de missões concluídas
- Mercado de itens
- Compra de itens com ouro
- Inventário do jogador
- Personalização de avatar
- Sistema de equipamentos por categorias
- Jornada com regiões e objetivos
- Sistema de conquistas
- Diário de aventuras
- Interface responsiva
- Deploy no Firebase Hosting

## Sistema de recompensas

| Dificuldade | XP | Ouro |
|---|---:|---:|
| Comum | 40 | 15 |
| Rara | 90 | 35 |
| Épica | 150 | 60 |
| Lendária | 250 | 100 |

Os valores podem ser ajustados na configuração do projeto.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

## Estrutura principal

```text
src/
├── components/
│   ├── avatar/
│   ├── achievements/
│   ├── journey/
│   ├── journal/
│   ├── missions/
│   ├── store/
│   └── ui/
├── contexts/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── services/
├── types/
├── utils/
└── data/
```

A estrutura exata pode variar conforme a versão atual do projeto.

## Fluxo principal

```text
Criar conta
→ Criar missão
→ Concluir missão
→ Receber XP e ouro
→ Subir de nível
→ Comprar item
→ Equipar item
→ Personalizar avatar
→ Desbloquear conquistas
→ Avançar na jornada
```

## Firebase

O projeto utiliza os seguintes serviços:

### Authentication

Responsável por cadastro, login, recuperação de senha, persistência de sessão e proteção de rotas.

### Cloud Firestore

```text
users/{uid}
users/{uid}/tasks/{taskId}
users/{uid}/taskCompletions/{completionId}
users/{uid}/inventory/{itemId}
users/{uid}/achievements/{achievementId}
users/{uid}/journey/{regionId}
users/{uid}/activityLog/{activityId}

storeItems/{itemId}
achievements/{achievementId}
journeyRegions/{regionId}
```

### Firebase Hosting

Responsável pela publicação da aplicação.

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm
- Projeto configurado no Firebase

### Instalação

```bash
git clone URL_DO_REPOSITORIO
cd habit-legends
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação será executada em:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Inicia o projeto em modo de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Executa localmente a versão de produção.

```bash
npm run lint
```

Executa a análise de qualidade do código, caso o script esteja configurado.

## Deploy

```bash
npm run build
firebase login
firebase use --add
firebase deploy
```

Para publicar apenas o Hosting:

```bash
firebase deploy --only hosting
```

## Modelos principais

### Usuário

```ts
type Player = {
  uid: string;
  displayName: string;
  email: string;
  characterName: string;
  title: string;
  level: number;
  currentXp: number;
  totalXp: number;
  gold: number;
  streak: number;
  longestStreak: number;
  completedTasks: number;
};
```

### Missão

```ts
type HabitTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "common" | "rare" | "epic" | "legendary";
  frequency: "once" | "daily" | "weekly";
  xpReward: number;
  goldReward: number;
  isActive: boolean;
};
```

### Item do mercado

```ts
type StoreItem = {
  id: string;
  name: string;
  description: string;
  category:
    | "hair"
    | "outfit"
    | "weapon"
    | "accessory"
    | "pet"
    | "background";
  rarity: "common" | "rare" | "epic" | "legendary";
  price: number;
  requiredLevel: number;
  imageUrl: string;
  isAvailable: boolean;
};
```

## Segurança

O projeto utiliza regras do Firestore para limitar o acesso aos dados.

Princípios adotados:

- cada usuário acessa apenas seus próprios dados;
- itens globais do mercado são somente leitura para o cliente;
- definições de conquistas e regiões não podem ser alteradas pela interface;
- recompensas não devem confiar em valores enviados pelo formulário;
- operações importantes devem utilizar transações.

Para uma versão comercial, recomenda-se mover operações sensíveis, como conclusão de missões e compra de itens, para Cloud Functions.

## Avatar por camadas

O avatar é montado por meio de camadas sobrepostas.

```text
background
backAccessory
body
outfit
hair
faceAccessory
chestAccessory
leftHandWeapon
rightHandWeapon
pet
foreground
```

Cada item pode possuir posição, escala e rotação próprias para garantir o alinhamento correto no personagem.

## Aprendizados do projeto

O desenvolvimento do Habit Legends envolveu:

- autenticação;
- modelagem de banco de dados NoSQL;
- operações CRUD;
- listeners em tempo real;
- transações no Firestore;
- gerenciamento de estado;
- rotas protegidas;
- responsividade;
- animações;
- gamificação;
- arquitetura baseada em componentes;
- regras de negócio;
- deploy em produção.

## Melhorias futuras

- Notificações de missões
- Aplicação PWA
- Baús e recompensas diárias
- Missões especiais
- Bosses semanais
- Ranking entre amigos
- Guildas
- Mais itens e personalizações
- Cloud Functions
- Testes automatizados
- Painel administrativo para gerenciar itens, conquistas e regiões

## Autor

**Luka Anders**

Estudante de Análise e Desenvolvimento de Sistemas, com foco em Desenvolvimento Front-End, Desenvolvimento Web e Análise de Dados.

## Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.
