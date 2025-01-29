import { Room } from "@/entities";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";

interface ChatListItemProps {
  room: Room;
  isActive: boolean;
}

const ChatListItem = ({ room, isActive }: ChatListItemProps) => {
  const { name, createdAt } = room;

  return (
    <Link to={`/${room.id}`}
      className={cn('font-normal chat-item border-b border-border flex items-center cursor-pointer text-black no-underline hover:text-black', {
        'text-white hover:text-white bg-[#3390ec] text': isActive,
      })}
    >
      <div className="chat-item-avatar m-2 ">
        <Avatar className="border-black border text-black">
          <AvatarFallback>{(name[0]+name[1]).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="chat-item-content">
        <div className="chat-item-header">
          <div className="chat-item-name">{name}</div>
          <div className="chat-item-time">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </Link>
  );
}

export { ChatListItem };