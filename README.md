# Libris Arcana - Livraria

O portal para mundos escondidos. Uma livraria online com tema fantasma/arcano.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM v6
- React Hook Form
- Zustand (estado global: carrinho, cliente e admin)
- Sonner (notificações)

## Estrutura do Projeto

```
src/
├── components/
│   ├── CardLivro.tsx       # Card de exibição dos livros com botões de detalhes e carrinho
│   ├── InputPesquisa.tsx   # Hero section com imagem de fundo, busca e botões
│   ├── Oraculo.tsx         # Seção do Oráculo que indica livros aleatórios
│   ├── Titulo.tsx          # Header/Navbar com logo, menu, ícones e estado do cliente
│   └── Contato.tsx         # Página de contato com canais de atendimento
├── context/
│   ├── CarrinhoContext.ts  # Store Zustand do carrinho (persistido no localStorage)
│   ├── ClienteContext.ts   # Store Zustand do cliente autenticado
│   └── AdminContext.ts     # Store Zustand do administrador autenticado
├── utils/
│   ├── LivroType.ts        # Tipagem dos livros
│   ├── ClienteType.ts      # Tipagem do cliente
│   └── AdminType.ts        # Tipagem do administrador
├── App.tsx                 # Página principal (diferenciais, carrossel, oráculo)
├── Detalhes.tsx            # Página de detalhes do livro
├── Layout.tsx              # Layout com navbar e roteamento
├── Login.tsx               # Página de login do cliente
├── Cadastro.tsx            # Página de cadastro do cliente
├── Carrinho.tsx            # Página do carrinho de compras e checkout
├── AdminLogin.tsx          # Página de login do administrador
├── Admin.tsx               # Painel administrativo (pedidos e livros)
├── main.tsx                # Ponto de entrada e configuração de rotas
└── index.css               # Estilos globais e tema cosmic
```

## Funcionalidades

### Header (Titulo.tsx)
- Logo da livraria (`logo1.png`)
- Menu de navegação (Home, Lançamentos, Gêneros, Contato) com fonte Poppins
- Ícones de pesquisa, carrinho (com badge de contagem) e perfil
- Menu responsivo para mobile
- Exibe nome do cliente logado e botão de sair
- Background `bg-cosmic` com efeito de estrelas

### Hero Section (InputPesquisa.tsx)
- Imagem de fundo (`fundo.png`) com overlay gradiente
- Texto alinhado à esquerda para dar destaque à imagem
- Título "Libris Arcana" com gradiente dourado
- Botões "Explorar Biblioteca" e "O Oráculo"
- Campo de pesquisa com busca por título, autor ou categoria
- Transição suave inferior para a próxima seção

### Diferenciais
- 4 cards com bordas arredondadas e tom roxo claro
- Frete Mágico, Compra Segura, Qualidade Garantida, Atendimento Encantado
- Títulos com gradiente dourado
- Transição suave com linha roxa

### Carrossel de Livros
- Scroll horizontal com botões de navegação
- Cards responsivos (280px/300px)
- Barra de scroll oculta
- Transição suave no topo da seção

### Oráculo (Oraculo.tsx)
- Componente separado que recebe `livros` como prop
- Botão "Consultar o Oráculo" com animação de loading
- Indica um livro aleatório da base de dados
- Card de resultado com fade-in animado
- Link para página de detalhes do livro indicado

### Cards dos Livros (CardLivro.tsx)
- Capa do livro com hover de zoom
- Título, autor, avaliação, preço, editora e ano
- Botão "Ver detalhes" (gradiente dourado)
- Botão "Adicionar ao carrinho" (roxo)
- Efeito hover com elevação e brilho

### Página de Detalhes (Detalhes.tsx)
- Layout responsivo com imagem à esquerda e informações à direita
- Título, autor, editora, ano, preço, estoque e descrição
- Botão "Adicionar ao Carrinho" com notificação
- Extras: formatos disponíveis, entrega mágica (frete grátis acima de R$ 199) e troca em até 7 dias

### Cadastro (Cadastro.tsx)
- Formulário com dados pessoais, endereço de entrega e gêneros favoritos
- Validação de senha com confirmação
- Seleção de gêneros de leitura preferidos
- Integração com a API para criar o cliente

### Login (Login.tsx)
- Autenticação via API (`/login`)
- Opção "Manter Conectado" (persiste no localStorage)
- Mostrar/ocultar senha
- Link para a página de cadastro

### Carrinho (Carrinho.tsx)
- Gerenciado pela store Zustand (`CarrinhoContext`), persistido no localStorage
- Ajuste de quantidade e remoção de itens
- Resumo do pedido com subtotal, frete e total
- Frete grátis para compras acima de R$ 199
- Finalização do pedido (exige cliente logado)

### Página de Contato (Contato.tsx)
- Canais de atendimento: e-mail, telefone, WhatsApp, endereço, redes sociais e horário
- Ilustração do gato da livraria com brilho roxo animado

### Painel Administrativo (Admin.tsx)
- Login restrito (AdminLogin.tsx) com token de autenticação
- Aba **Pedidos**: lista de pedidos com status, alteração de status, envio e exclusão
- Aba **Livros**: cadastro, edição e exclusão de livros
- Requer autenticação; redireciona para `/admin/login` se não estiver logado

## Integração com API

As chamadas utilizam a variável de ambiente `VITE_API_URL`. Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=
```

Principais endpoints consumidos:
- `GET/POST /livros`
- `POST /login`, `POST /admin/login`
- `POST /clientes`
- `POST /pedidos`
- `GET /administrador/pedidos`
- `POST/PUT/DELETE /administrador/livros`

## Cores do Tema

| Cor | Uso |
|-----|-----|
| `#0a0014` | Fundo principal (preto com tom roxo) |
| `#1a0f2e` | Seções alternadas (roxo escuro) |
| `#160D24` | Cards e elementos internos |
| Dourado `yellow-*` | Títulos, botões, ícones, destaques |
| Roxo `purple-*` | Bordas, textos secundários, overlays |

## Fontes

- **Poppins** — Menu e textos gerais (sans-serif moderna)
- **Cinzel** — Disponível via Google Fonts (serif para títulos decorativos)

## Como Rodar

1. Configure o arquivo `.env` com a URL da API (veja acima).
2. Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Página principal com hero, diferenciais, carrossel e oráculo |
| `/login` | Login do cliente |
| `/cadastro` | Cadastro do cliente |
| `/detalhes/:livroId` | Detalhes de um livro específico |
| `/carrinho` | Carrinho de compras e checkout |
| `/contato` | Página de contato |
| `/admin/login` | Login do administrador |
| `/admin/painel` | Painel administrativo |