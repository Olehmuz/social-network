import { useState, useEffect } from 'react';
import useSocket from './useSocket';
import { Room } from '@/entities';

export const useRooms = () => {
  const { socketEmit, socketListen, socket } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = () => {
    socketListen('get-rooms', (response: Room[]) => {
      setRooms(response);
    });

    socketEmit('get-rooms', null, (response: Room[]) => {
      setRooms(response);
    });
  };

  useEffect(() => {
    const handleConnect = () => {
      fetchRooms();
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('get-rooms');
    };
  }, [socket]);

  return { rooms, fetchRooms, socket };
};
