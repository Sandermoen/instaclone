import io from 'socket.io-client';

export const connect = () => {
  const socket = io({
    query: { token: localStorage.getItem('token') },
  });
  return socket;
};
