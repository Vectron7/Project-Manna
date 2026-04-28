# Arquitetura do Sistema

## Estilo

O sistema adota o estilo **Cliente-Servidor** com frontend e backend integrados em uma única aplicação Next.js. A comunicação ocorre via **HTTP/REST** — o frontend faz chamadas `fetch` para as API Routes do próprio Next.js, que atuam como backend.

---

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Frontend | React.js (via Next.js App Router) |
| Backend | Next.js API Routes |

---

## Diagrama

```.
┌─────────────────────────────────────────────────────┐
│                     Next.js                         │
│                                                     │
│   ┌──────────────┐   HTTP (fetch)  ┌─────────────┐  │
│   │   Frontend   │ ──────────────► │  API Routes │  │
│   │   React.js   │ ◄────────────── │  /api/mood  │  │
│   └──────────────┘    JSON         └─────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Fluxo Principal

1. O usuário abre a aplicação no browser.
2. O frontend exibe o popup obrigatório.
3. O usuário seleciona o humor.
4. O frontend envia `POST /api/mood` com `{ mood: "feliz" }`.
5. A API Route valida o payload e seleciona a mensagem motivacional correspondente.
6. A API Route retorna `{ message: "..." }` com status `200`.
7. O frontend exibe a mensagem motivacional ao usuário.

---

## Componentes

| Componente | Responsabilidade |
| ---------- | ---------------- |
| **UI (React)** | Renderiza popup, seletor de humor e mensagem motivacional |
| **API Route `/api/mood`** | Recebe humor, seleciona mensagem, persiste no banco e retorna resposta |
| **Service Layer** | Lógica de mapeamento humor → mensagem, desacoplada da rota |

---

## Persistência

**Tabela:** `user_logs`

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `id` | `INT AUTO_INCREMENT` | Identificador único |
| `mood` | `VARCHAR(50)` | Humor selecionado pelo usuário |
| `message` | `TEXT` | Mensagem motivacional retornada |
| `created_at` | `TIMESTAMP` | Data e hora da interação |

---

## Decisões de Design

**Por que Next.js como backend?** As API Routes do Next.js eliminam a necessidade de um servidor Express separado, reduzindo a complexidade de deploy e manutenção para um projeto de escopo reduzido.

**Por que HTTP em vez de WebSocket?** O fluxo de interação é pontual — o usuário seleciona o humor uma vez por sessão. Não há necessidade de canal persistente bidirecional; uma requisição HTTP convencional atende com menor overhead.
