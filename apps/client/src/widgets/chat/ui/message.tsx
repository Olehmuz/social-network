import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";

interface MessageProps {
  message: string;
  updatedAt: Date;
  sender: string;
  imageUrl?: string;
  isOwnMessage?: boolean;
}

const Message = ({ message, updatedAt, sender, imageUrl, isOwnMessage }: MessageProps) => {
  return (
    <div className={cn("message m-2 flex items-end", isOwnMessage && "justify-end")}>
      {!isOwnMessage && (<Avatar className="border-black border text-black mb-[1px]">
        <AvatarFallback className="bg-white">{(sender[0]+sender[1]).toUpperCase()}</AvatarFallback>
      </Avatar>)}
      <div className="flex flex-col ml-2">
        <div className="message-content bg-white p-2 rounded-md">
          {!isOwnMessage && <p className="text-xs">{sender}</p>}
          <p className="text-sm">{message}</p>
          <div>
            <p className="text-xs text-right text-slate-400 mt-1">
              {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Message };