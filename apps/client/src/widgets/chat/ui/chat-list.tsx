import { useEffect, useState } from "react";
import { ChatListItem } from "./chat-list-item";
import { Button } from "@/shared/ui/button";
import { Loader, LogOut, MessagesSquare, Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useAuthStore from "@/shared/store/auth.store";
import useFetch from "@/shared/hooks/useFetch";
import useSocket from "@/shared/hooks/useSocket";
import { Room } from "@/entities"; 
import { CreateRoomDialog } from "./create-room-dialog";



const ChatList = () => {
  const activeRoomId = useParams().chatId;
  const navigate = useNavigate();
  const { logout } = useAuthStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: rooms, loading, setData } = useFetch<Room[]>('rooms');
  const { socketListen } = useSocket();

  useEffect(() => {
    if(!activeRoomId) {
      if(rooms && rooms.length) {
        navigate('/'+rooms[0].id);
      }
    }
  }, [activeRoomId, rooms]);


  useEffect(() => {
    socketListen('room-created', (room: Room) => {
      if(rooms?.find((r) => r.id === room.id)) {
        return;
      }

      setData((prev) => [...prev ?? [], room]);
    });
  }, []);

  if(loading) {
    return <div className="flex flex-col items-center justify-center h-full"><Loader className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-full overflow-y-auto">
        {rooms?.length ? rooms?.map((room) => (
          <ChatListItem key={room.id} room={room} isActive={activeRoomId === room.id} />
        )) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xl font-semibold text-slate-500 mt-4">No rooms found</div>
            <div className="mt-2">
              <Button variant='outline' onClick={() => setIsDialogOpen(true)}>Create a new room</Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-around border-t-2 border-border pt-1 pb-1">
        <CreateRoomDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        <Button variant='outline' className="m-1" onClick={() => {
          console.log('join-room')
        }}><MessagesSquare /></Button>
        <Button variant='outline' className="m-1" onClick={() => {
          console.log('settings')
        }}><Settings /></Button>
        <Button variant='outline' className="m-1" onClick={() => logout()}><LogOut /></Button>
      </div>
    </div>
  );
}

export { ChatList };