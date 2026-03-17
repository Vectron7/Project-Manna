# SRS

## 1. Introdução

### 1.1 Objetivo

Descrever os requisitos de um sistema fullstack de notificações motivacionais com persistência em banco de dados.

### 1.2 Escopo

O sistema deve:

- Executar na inicialização do sistema
- Exibir popup obrigatório
- Coletar humor do usuário
- Enviar dados ao backend
- Processar e retornar mensagem motivacional
- Armazenar histórico no banco

---

## 2. RF

- RF01: Iniciar automaticamente com o sistema
- RF02: Exibir popup obrigatório
- RF03: Permitir seleção de humor
- RF04: Enviar humor ao backend via WebSocket
- RF05: Receber mensagem motivacional
- RF06: Exibir mensagem ao usuário
- RF07: Armazenar dados no banco MySQL
- RF08: Permitir futura visualização de histórico

---

## 3. NRF

- NRF01: Tempo de resposta < 2s
- NRF02: Baixo consumo de recursos
- NRF03: Compatível com Windows e Linux
- NRF04: Comunicação em tempo real
- NRF05: Arquitetura modular
- NRF06: Persistência confiável (MySQL)

---

## 4. Regras de Negócio

- RN01: Usuário deve interagir com popup
- RN02: Apenas uma execução por inicialização
- RN03: Dados devem ser armazenados após interação

---

## 5. Casos de Uso

### UC01 – Inicializar Sistema

- Sistema inicia automaticamente

### UC02 – Selecionar Humor

- Usuário escolhe estado emocional

### UC03 – Processar Dados

- Backend recebe e processa humor

### UC04 – Exibir Mensagem

- Mensagem motivacional exibida

### UC05 – Persistir Dados

- Dados armazenados no banco
