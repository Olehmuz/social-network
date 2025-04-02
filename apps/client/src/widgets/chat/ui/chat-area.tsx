import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { Loader, SendHorizonal } from 'lucide-react';
import { Message } from './message';
import { Message as MessageEntity, Room } from '@/entities';
import { useRef, useEffect, useState, useMemo } from 'react';
import useFetch from '@/shared/hooks/useFetch';
import useSocket from '@/shared/hooks/useSocket';
import { useParams, Link } from 'react-router';
import { useGetCurrentUserId } from '@/shared/hooks/useGetCurrentUserId';
import { requestAPI } from '@/shared/lib/requestAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

const sendMessage = (activeRoomId: string, message: string) => {
  return requestAPI<MessageEntity>(`rooms/${activeRoomId}/messages`, 'POST', {
    message,
  });
};

const ChatArea = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [message, setNewMessage] = useState('');

  const { socketListen, socket } = useSocket();

  const activeRoomId = useParams().chatId || null;
  const userId = useGetCurrentUserId();

  const {
    data = [],
    setData,
    loading,
  } = useFetch<MessageEntity[]>(`rooms/${activeRoomId}/messages`);

  const { data: room, loading: roomLoading } = useFetch<Room>(
    `rooms/${activeRoomId}`,
  );

  console.log(room);

  useEffect(() => {
    socket.emit('join-room', { roomId: activeRoomId });

    return () => {
      socket.emit('leave-room', { roomId: activeRoomId });
    };
  }, [activeRoomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [data]);

  useEffect(() => {
    socketListen('message-retrieved', (message: MessageEntity) => {
      chatEndRef.current?.scrollIntoView();
      setData((prev) => {
        if (!prev) return [message];

        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, []);

  const messages = useMemo(
    () =>
      Array.isArray(data) &&
      data.map((message: MessageEntity) => ({
        message: message.message,
        updatedAt: new Date(message.updatedAt),
        sender: message.sender.nickname,
        isOwnMessage: message.sender.id === userId,
      })),
    [data, userId],
  );

  if (!activeRoomId || loading) {
    return (
      <div className="flex flex-col h-full bg-slate-400 bg-opacity-10">
        <div className="flex h-full items-center justify-center">
          <Loader className="animate-spin text-slate-500" />
        </div>
        <div className="m-2 flex">
          <Input
            className="bg-white"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button className="ml-2">
            <SendHorizonal />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-400 bg-opacity-10">
      <Link to={`/${activeRoomId}/settings`} className="p-2 border-b border-border bg-white text-black hover:text-black">
        {roomLoading || !room ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="chat-item-avatar">
              <Avatar className="border-black border text-black w-10 h-10 mr-2">
                {room?.image && <AvatarImage src={room?.image} />}
                <AvatarFallback>
                  {(room?.name[0] + room?.name[1]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-base font-semibold">{room?.name}</h2>
              <p className="text-xs text-slate-500">
                {room?.users?.length === 1
                  ? '1 member'
                  : `${room?.users?.length} members`}
              </p>
            </div>
          </div>
        )}
      </Link>

      <div className="h-screen overflow-y-auto block border-b-2 border-border pb-4">
        {messages && messages?.length == 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl font-semibold text-slate-500">
              {
                room?.type === 'group' ? 
                  'No messages yet. Start the conversation!' :
                  'No messages yet. Wait for the first message!'
              }
            </p>
          </div>
        )}
        {messages &&
          messages?.length > 0 &&
          messages.map((message, index) => (
            <Message key={index} {...message} />
          ))}
        <div ref={chatEndRef} />
      </div>

      {room?.type === 'group' || (room?.type === 'channel' && room?.owner?.id === userId) ? (
        <div className="m-2 flex">
          <Input
            className="bg-white"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(activeRoomId, message)
                  .then(() => {
                    setNewMessage('');
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }}
          />
          <Button
            className="ml-2"
            onClick={() => {
              sendMessage(activeRoomId, message)
                .then(() => {
                  setNewMessage('');
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <SendHorizonal />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export { ChatArea };
