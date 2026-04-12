# Casos de Uso

**Projeto:** Pop-up Abençoado  
**Versão:** 1.0  
**Data:** 2026

---

## Sumário

- [UC-01 — Inicializar Sistema](#uc-01--inicializar-sistema)
- [UC-02 — Selecionar Humor](#uc-02--selecionar-humor)
- [UC-03 — Processar Humor e Gerar Mensagem](#uc-03--processar-humor-e-gerar-mensagem)
- [UC-04 — Exibir Mensagem Motivacional](#uc-04--exibir-mensagem-motivacional)

---

## UC-01 — Inicializar Sistema

| Campo | Descrição |
| ----- | --------- |
| **Ator Principal** | Sistema (inicialização automática) |
| **Pré-condições** | Aplicação Next.js em execução e acessível no browser |
| **Pós-condições** | Popup obrigatório visível; interface bloqueada para demais interações |

### Fluxo Principal UC-01

1. O usuário acessa a URL da aplicação no browser.
2. O Next.js renderiza a página principal (`app/page.jsx`).
3. O componente `Popup` é montado e exibido imediatamente, sobrepondo o conteúdo da página.
4. A interface permanece bloqueada até que o usuário conclua a interação com o popup (UC-02).

### Fluxo de Exceção - UC-01

**FE-01-A — Falha ao carregar a página:**

O browser não consegue se conectar ao servidor Next.js. O popup não é exibido. O usuário vê a mensagem de erro padrão do browser. Nenhuma ação do sistema é possível até que a conectividade seja restaurada.

---

## UC-02 — Selecionar Humor

| Campo | Descrição |
| ----- | --------- |
| **Ator Principal** | Usuário |
| **Pré-condições** | Popup exibido (UC-01 concluído) |
| **Pós-condições** | Humor selecionado enviado ao backend; indicador de carregamento exibido |

### Fluxo Principal - UC-02

1. O popup exibe as opções de humor predefinidas (ex.: 😊 Feliz, 😐 Neutro, 😔 Triste, 😤 Estressado, 😴 Cansado).
2. O usuário clica em uma das opções.
3. O frontend envia `POST /api/mood` com o corpo `{ "mood": "<humor_selecionado>" }`.
4. O frontend exibe um indicador de carregamento enquanto aguarda a resposta.
5. O fluxo continua em UC-03.

### Fluxo de Exceção - UC-02

**FE-02-A — Usuário não seleciona nenhuma opção:**

O botão de confirmação permanece desabilitado. O popup não pode ser fechado sem uma seleção válida (RN-01).

---

## UC-03 — Processar Humor e Gerar Mensagem

| Campo | Descrição |
| ----- | --------- |
| **Ator Principal** | Sistema (API Route `/api/mood`) |
| **Pré-condições** | Requisição `POST /api/mood` recebida com payload válido |

### Fluxo Principal - UC-03

1. A API Route recebe a requisição e valida o campo `mood` (presente e não vazio).
2. A Service Layer consulta o mapeamento `humor → mensagem` e seleciona a mensagem correspondente.

### Fluxos de Exceção - UC-03

**FE-03-A — Payload inválido (campo `mood` ausente ou vazio)**

A API Route retorna `HTTP 400 Bad Request` com `{ "error": "INVALID_MOOD" }`. O frontend exibe mensagem de erro genérica e reabilita a seleção de humor para nova tentativa.

**FE-03-B — Humor sem mapeamento explícito:**

A Service Layer retorna a mensagem padrão de fallback (RN-04). O fluxo continua normalmente.

**FE-03-C — Falha na conexão com o banco de dados:**

A API Route retorna `HTTP 500 Internal Server Error`. A mensagem motivacional não é exibida. O frontend exibe: *"Não foi possível processar sua resposta. Tente novamente."*

---

## UC-04 — Exibir Mensagem Motivacional

| Campo | Descrição |
| ----- | --------- |
| **Ator Principal** | Sistema (Frontend) |
| **Pré-condições** | API Route retornou `HTTP 200` com mensagem válida |
| **Pós-condições** | Mensagem exibida ao usuário; popup pode ser fechado |

### Fluxo Principal - UC-04

1. O frontend recebe a resposta da API Route.
2. O indicador de carregamento é removido.
3. O componente `MensagemMotivacional` exibe a mensagem recebida.
4. O usuário lê a mensagem e fecha o popup, desbloqueando a interface.
