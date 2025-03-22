import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { Loader, SendHorizonal } from "lucide-react";
import { Message } from "./message";
import { Message as MessageEntity } from "@/entities";
import { useRef, useEffect, useState, useMemo } from "react";
import useFetch from "@/shared/hooks/useFetch";
import useSocket from "@/shared/hooks/useSocket";
import { useParams } from "react-router";
import { useGetCurrentUserId } from "@/shared/hooks/useGetCurrentUserId";
import ky from "@/shared/lib/ky";
import { requestAPI } from "@/shared/lib/requestAPI";

const sendMessage = (activeRoomId: string, message: string) => {
  return requestAPI<MessageEntity>(`rooms/${activeRoomId}/messages`, 'POST', {
    message
  });
}


const ChatArea = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [message, setNewMessage] = useState('');

  const activeRoomId = useParams().chatId;
  const userId = useGetCurrentUserId();

  const { data = [], loading, setData } = useFetch<MessageEntity>(`rooms/${activeRoomId}/messages`);
  console.log('data', data);
  const { socketListen } = useSocket();

  useEffect(() => {
    socketListen('message-retrieved', (message: MessageEntity) => {
      setData((prev) => [...prev, message]);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, []);
  const messages = useMemo(() => data.map((message: MessageEntity) => ({
    message: message.message,
    updatedAt: new Date(message.updatedAt),
    sender: message.sender.nickname,
    isOwnMessage: message.sender.id === userId,
  })), [data]);

  if (loading || !activeRoomId) {
    return (
      <div className="chat-area flex flex-col h-full bg-slate-400 bg-opacity-10">
        <div className="flex h-full items-center justify-center">
          <Loader className="animate-spin text-slate-500" />
        </div>
        <div className="m-2 flex">
          <Input className="bg-white" placeholder="Type a message..." />
          <Button className="ml-2"><SendHorizonal /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area flex flex-col h-full bg-slate-400 bg-opacity-10">
      <div className="h-screen overflow-y-auto block border-b-2 border-border pb-4">
        {messages.length == 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl font-semibold text-slate-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        {messages.length > 0 && messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="m-2 flex">
        <Input 
          className="bg-white" 
          placeholder="Type a message..." 
          value={message} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <Button 
          className="ml-2" 
          onClick={() => {
            sendMessage(activeRoomId, message)
              .then((res: MessageEntity) => {
                setNewMessage('');
                setData((prev) => [...prev, res]);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
}

export { ChatArea };