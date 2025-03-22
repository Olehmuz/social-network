import { useEffect } from "react";
import { ChatListItem } from "./chat-list-item";
import { Button } from "@/shared/ui/button";
import { Edit, LogOut, MessagesSquare, Settings } from "lucide-react";
import { DialogHeader, DialogFooter } from "@/shared/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { useNavigate, useParams } from "react-router";
import useAuthStore from "@/shared/store/auth.store";
import { CreateRoomMultiselect } from "./create-room-multiselect";
import useFetch from "@/shared/hooks/useFetch";
import useSocket from "@/shared/hooks/useSocket";
import { Room } from "@/entities";

const ChatList = () => {
  const activeRoomId = useParams().chatId;
  const navigate = useNavigate();
  const { logout } = useAuthStore()

  const { data: rooms, loading, setData } = useFetch<Room>('rooms');
  const { socketListen } = useSocket();

  useEffect(() => {
    if(!activeRoomId) {
      if(rooms.length) {
        navigate('/'+rooms[0].id);
      }
    }
  }, [activeRoomId, rooms]);

  useEffect(() => {
    socketListen('room-created', (room: Room) => {
      setData((prev) => [...prev, room]);
    });
  }, []);

  if(!loading && !rooms) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className=" h-full overflow-y-auto">
        {rooms?.map((room) => (
          <ChatListItem key={room.id} room={room} isActive={activeRoomId === room.id} />
        ))}
      </div>
      <div className="flex justify-around border-t-2 border-border pt-1 pb-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' className="m-1"><Edit /></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new group</DialogTitle>
              <DialogDescription>
                Create a new group to start a conversation with multiple people.
              </DialogDescription>
            </DialogHeader>
            <CreateRoomMultiselect />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant='outline' className="m-1" onClick={() => console.log('Chats')}><MessagesSquare /></Button>
        <Button variant='outline' className="m-1" onClick={() => console.log('Settings')}><Settings /></Button>
        <Button variant='outline' className="m-1" onClick={() => logout()}><LogOut /></Button>
      </div>
    </div>
  );
}

export { ChatList };