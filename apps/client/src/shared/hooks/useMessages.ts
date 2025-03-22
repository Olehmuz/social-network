import { useState, useEffect } from 'react';
import useSocket from './useSocket';
import { Message } from '@/entities';

export const useMessages = () => {
  const { socketEmit, socketListen, socket } = useSocket();
  const [rooms, setMessages] = useState<Message[]>([]);

  const fetchMessages = () => {
    socketListen('get-messages', (response: Message[]) => {
      setMessages(response);
    });

    socketEmit('get-messages', null, (response: Message[]) => {
      setMessages(response);
    });
  };

  useEffect(() => {
    const handleConnect = () => {
      fetchMessages();
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('get-messages');
    };
  }, [socket]);

  return { rooms, fetchMessages, socket };
};
