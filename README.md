# 🙏 Pop-up Abençoado

<p align="center">
  <em>Sistema fullstack de notificações motivacionais personalizadas com base no humor do usuário</em>
</p>

<p align="center">
  <a href="#equipe">Equipe</a> •
  <a href="#tema">Tema</a> •
  <a href="#escopo">Escopo</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#stack">Stack</a> •
  <a href="#estrutura-de-pastas">Estrutura de Pastas</a> •
  <a href="#como-rodar">Como Rodar</a> •
  <a href="#variáveis-de-ambiente">Variáveis de Ambiente</a> •
  <a href="#processo">Processo</a> •
  <a href="#métricas">Métricas</a>
</p>

---

## Equipe

| Nome | Papel |
| ---- | ----- |
| **Gustavo Vieira** | FullStack |
| **Jenifer Gomes** | Frontend |
| **Luís Gabriel** | UX/UI |
| **Philipe Gonçalves** | Backend |
| **Victor Herédia** | Integraçãp |

---

## Tema

Aplicação web fullstack que exibe um popup motivacional obrigatório ao iniciar o sistema. O usuário informa seu humor e recebe uma mensagem personalizada, gerada pelo backend e persistida em banco de dados.

---

## Escopo

**Popup obrigatório na inicialização** — ao abrir o sistema, um popup é exibido e bloqueia a interface até que o usuário interaja com ele.

**Seleção de humor** — o usuário escolhe como está se sentindo entre opções predefinidas.

**Mensagem motivacional dinâmica** — com base no humor selecionado, o backend retorna uma mensagem personalizada exibida imediatamente no frontend.

### Fora do escopo (versão atual)

- Autenticação de usuários
- Visualização do histórico de interações
- Personalização das mensagens pelo usuário

---

## Arquitetura

```.
┌─────────────────────────────────────────────────────┐
│                     Next.js                         │
│                                                     │
│   ┌──────────────┐   HTTP (fetch)  ┌─────────────┐  │
│   │   Frontend   │ ──────────────► │  API Routes │  │
│   │   React.js   │ ◄────────────── │  (backend)  │  │
│   └──────────────┘                 └─────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

O sistema roda inteiramente dentro do Next.js — as **API Routes** servem como backend integrado, eliminando a necessidade de um servidor separado. O frontend faz chamadas HTTP via `fetch` para as rotas `/api/*`, que processam o humor.

---

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Frontend | React.js (via Next.js) |
| Backend | Next.js API Routes |

---

## Estrutura de Pastas

```.
popup-abencoado/
├── app/
│   ├── page.jsx              # Página principal com o popup
│   ├── layout.jsx            # Layout raiz da aplicação
│   └── api/
│       └── mood/
│           └── route.js      # POST /api/mood — recebe humor, retorna mensagem
├── components/
│   ├── Popup.jsx             # Componente do popup obrigatório
│   ├── HumorSelector.jsx     # Seleção de humor do usuário
│   └── MensagemMotivacional.jsx
├── lib/
│   |
│   └── mensagens.js          # Mapeamento humor → mensagem motivacional
├── public/                   # Assets estáticos
├── .env.local                # Variáveis de ambiente (não versionado)
├── .env.example              # Exemplo de variáveis de ambiente
├── next.config.js
└── package.json
```

---

## Como Rodar

### Pré-requisitos

- Node.js
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/<org>/popup-abencoado.git
cd popup-abencoado

# Instale as dependências
npm install
```

```.

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Produção

```bash
npm run build
npm start
```

---

## Processo

Acompanhe o processo de desenvolvimento clicando [aqui](docs/process.md).

---

## Métricas

Veja as métricas usadas no desenvolvimento clicando [aqui](docs/metrics.md).
