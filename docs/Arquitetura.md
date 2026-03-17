# Arquitetura do Sistema

## Estilo

- Cliente-Servidor
- Event-driven
- Comunicação em tempo real

---

## Stack

### Frontend

- React.js
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO

### Banco de Dados

- MySQL

---

## Fluxo

1. Frontend inicia
2. Popup exibido
3. Usuário seleciona humor
4. Evento enviado via Socket.IO
5. Backend processa
6. Mensagem gerada
7. Dados salvos no MySQL
8. Mensagem enviada ao frontend
9. Popup exibido

---

## Componentes

- UI (React)
- Socket Client
- API (Express)
- WebSocket Server
- Service Layer
- Banco de Dados

---

## Persistência

Tabela: user_logs

- id
- mood
- message
- created_at

---

## Comunicação

- WebSocket via Socket.IO
