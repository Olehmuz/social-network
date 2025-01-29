import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { SendHorizonal } from "lucide-react";
import { Message } from "./message";
import { useRef, useEffect } from "react";

const messages = [
  {
    message: "Hey there, how's it going?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "I'm good, thanks! How about you?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Doing well, just working on a project.",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "That sounds interesting. Need any help?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Actually, yes. Could you review my code?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "Sure, send it over!",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Hey there, how's it going?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "I'm good, thanks! How about you?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Doing well, just working on a project.",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "That sounds interesting. Need any help?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Actually, yes. Could you review my code?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "Sure, send it over!",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Hey there, how's it going?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "I'm good, thanks! How about you?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Doing well, just working on a project.",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "That sounds interesting. Need any help?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Actually, yes. Could you review my code?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "Sure, send it over!",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Hey there, how's it going?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "I'm good, thanks! How about you?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Doing well, just working on a project.",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "That sounds interesting. Need any help?",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
  {
    message: "Actually, yes. Could you review my code?",
    updatedAt: new Date(),
    sender: "Alice",
    isOwnMessage: false
  },
  {
    message: "Sure, send it over!",
    updatedAt: new Date(),
    sender: "Bob",
    isOwnMessage: true
  },
]

const ChatArea = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, []);

  return (
    <div className="chat-area flex flex-col h-full bg-slate-400 bg-opacity-10">
      <div className="h-screen overflow-y-auto block border-b-2 border-border pb-4">
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="m-2 flex">
        <Input className="bg-white" placeholder="Type a message..." />
        <Button className="ml-2"><SendHorizonal /></Button>
      </div>
    </div>
  );
}

export { ChatArea };