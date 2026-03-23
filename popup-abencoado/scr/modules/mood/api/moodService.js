import socket from '../../../shared/socketConfig';

export const moodService = {
  // RF04: Enviar humor ao backend
  send(mood) {
    return new Promise((resolve) => {
      socket.emit('mood:submit', { mood, date: new Date() });
      
      // Espera confirmação do servidor para garantir persistência (RN03)
      socket.once('mood:confirmed', (response) => {
        resolve(response);
      });
    });
  }
};