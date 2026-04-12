# SRS — Especificação de Requisitos de Software

**Projeto:** Pop-up Abençoado  
**Versão:** 1.0  
**Data:** 2026

---

## 1. Introdução

### 1.1 Objetivo

Descrever os requisitos funcionais, não funcionais e regras de negócio do sistema **Pop-up Abençoado** — uma aplicação fullstack de notificações motivacionais com persistência em banco de dados.

### 1.2 Escopo

O sistema deve executar na inicialização do browser, exibir um popup obrigatório, coletar o humor do usuário, retornar uma mensagem motivacional personalizada via backend e armazenar o histórico de interações em banco de dados MySQL.

### 1.3 Definições

| Termo | Definição |
| ----- | --------- |
| Popup | Componente de interface que bloqueia a interação com o restante da página até ser respondido |
| Humor | Estado emocional selecionado pelo usuário a partir de opções predefinidas |
| Mensagem motivacional | Texto gerado pelo backend com base no humor selecionado |
| API Route | Endpoint de backend integrado ao Next.js, acessado via HTTP |

---

## 2. Requisitos Funcionais

### MoSCoW - FR

#### Must Have - FR

| ID | Requisito |
| -- | --------- |
| RF-01 | O sistema deve iniciar automaticamente quando o usuário abre a aplicação no browser |
| RF-02 | O sistema deve exibir um popup obrigatório que bloqueia a interface até o usuário interagir |
| RF-03 | O sistema deve oferecer ao usuário a seleção de seu estado emocional (humor) entre opções predefinidas |
| RF-04 | O sistema deve enviar o humor selecionado ao backend via requisição HTTP |
| RF-05 | O backend deve processar o humor e retornar uma mensagem motivacional correspondente |
| RF-06 | O sistema deve exibir a mensagem motivacional ao usuário após o processamento |
| RF-07 | O backend deve armazenar cada interação (humor, mensagem e timestamp) no banco de dados MySQL |

#### Should Have - FR

| ID | Requisito |
| -- | --------- |
| RF-08 | O sistema deve permitir futura visualização do histórico de interações do usuário |
| RF-09 | O backend deve validar o payload recebido antes de processar (campo `mood` presente e não vazio) |
| RF-10 | O sistema deve exibir feedback visual de carregamento enquanto aguarda a resposta do backend |

#### Could Have - FR

| ID | Requisito |
| -- | --------- |
| RF-11 | O sistema poderia permitir que o usuário personalize as mensagens motivacionais exibidas |
| RF-12 | O sistema poderia suportar múltiplos idiomas (i18n) |
| RF-13 | O sistema poderia enviar notificações push para lembrar o usuário de registrar seu humor diariamente |

#### Won't Have (nesta versão) - FR

| ID | Requisito |
| -- | --------- |
| RF-14 | Autenticação e controle de acesso de usuários |
| RF-15 | Dashboard de analytics com visualização agregada de humores |
| RF-16 | Integração com calendários ou sistemas externos |

---

## 3. Requisitos Não Funcionais

### MoSCoW - NFR

#### Must Have - NFR

| ID | Requisito |
| -- | --------- |
| NRF-01 | O tempo de resposta total (frontend → backend → frontend) deve ser inferior a 2 segundos |
| NRF-02 | O sistema deve ser compatível com Windows e Linux |
| NRF-03 | A persistência no banco de dados deve ser confiável — toda interação completa deve ser registrada |
| NRF-04 | O sistema deve ter arquitetura modular, separando UI, lógica de negócio e acesso a dados |

#### Should Have - NFR

| ID | Requisito |
| -- | --------- |
| NRF-05 | O consumo de CPU em idle deve ser inferior a 5% |
| NRF-06 | O consumo de RAM deve ser inferior a 150 MB |
| NRF-07 | A inserção no banco de dados deve ser concluída em menos de 100 ms |
| NRF-08 | A taxa de erro nas inserções deve ser inferior a 1% |

#### Could Have - NFR

| ID | Requisito |
| -- | --------- |
| NRF-09 | Cobertura de testes automatizados superior a 70% |
| NRF-10 | O sistema poderia ter suporte a deploy via Docker |

---

## 4. Regras de Negócio

| ID | Regra |
| -- | ----- |
| RN-01 | O usuário deve obrigatoriamente interagir com o popup antes de acessar qualquer outra parte da interface |
| RN-02 | Apenas uma execução do popup é permitida por inicialização da aplicação |
| RN-03 | Os dados de cada interação devem ser armazenados no banco após a resposta ser exibida ao usuário |
| RN-04 | O backend deve sempre retornar uma mensagem, mesmo que o humor recebido não tenha mapeamento explícito (mensagem padrão/fallback) |

---

## 5. Restrições

- O backend deve ser implementado exclusivamente via Next.js API Routes, sem servidor separado.
- A aplicação deve funcionar nos browsers modernos (Chrome, Firefox, Edge — versões dos últimos 2 anos).
