import { Room } from "@/entities/room.model";
import useFetch from "@/shared/hooks/useFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ArrowLeft, Loader } from "lucide-react";
import { Link } from "react-router";

import { useParams } from "react-router";

export const ChatSettings = () => {
  const { chatId } = useParams();

  const { data: room, loading: roomLoading } = useFetch<Room>(
    `rooms/${chatId}`,
  );


  return (
    <div className="flex flex-col h-full bg-slate-400 bg-opacity-10">
      <div className="p-2 py-4 border-b border-border bg-white flex items-center justify-between">
        <Link to={`/${chatId}`} className="text-[#3390ec] hover:text-[#3390ec]/80">
          <span className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-6 h-6" /> Back
          </span>
        </Link>

        <div className="flex items-center justify-center">
          <span className="text-base font-bold">Info</span>
        </div>

        <div className="flex items-center justify-center">1</div>
      </div>

      {!roomLoading && room ? (
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center justify-center flex-col">
            <Avatar className="border-black border text-black w-32 h-32">
              {room?.image && <AvatarImage src={room?.image} />}
              <AvatarFallback>
                {(room?.name[0] + room?.name[1]).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <h2 className="text-base font-semibold">{room?.name}</h2>
              <p className="text-xs text-slate-500">
                {room?.users?.length === 1
                  ? '1 member'
                  : `${room?.users?.length} members`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Loader className="animate-spin text-slate-500" />
        </div>
      )}
    </div>
  );
};