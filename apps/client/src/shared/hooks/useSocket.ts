import { io } from 'socket.io-client';
import useAuthStore from '../store/auth.store';


const useSocket = () => {
  const userId = useAuthStore.getState().userId;
  const token = useAuthStore.getState().token;


  const socket = io('http://localhost:3001/',{
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 3,
    retries: 3
  });
  
  const socketEmit = (action: any, payload: any, fn: any) => {
    socket.emit(action, payload, fn);
  };

  const socketListen = (action: any, fn: any) => {
    socket.on(action, fn);
  };

  useAuthStore.subscribe((state) => {
    console.log('Token updated', state.token);
    const newToken = state.token;
    socket.auth = { token: newToken }; // Оновлюємо токен у socket.auth
    socket.disconnect(); // Перепідключаємося з новим токеном
    socket.connect();
  });

  return { socketEmit, socketListen, userId, socket };
};

export default useSocket;