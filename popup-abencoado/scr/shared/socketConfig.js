import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Configuração única para evitar múltiplas instâncias
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true
});

export default socket;