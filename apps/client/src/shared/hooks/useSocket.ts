import { io } from 'socket.io-client';
import useAuthStore from '../store/auth.store';

  const userId = useAuthStore.getState().userId;
  const token = useAuthStore.getState().token;

  const socket = io('http://localhost:3001/',{
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 10000,
    reconnectionAttempts: 3,
    // retries: 3
  });

const useSocket = () => {
  const socketEmit = (action: any, payload: any, fn: any) => {
    socket.emit(action, payload, fn);
  };

  const socketListen = (action: any, fn: any) => {
    socket.on(action, fn);
  };

  return { socketEmit, socketListen, userId, socket };
};

export default useSocket;