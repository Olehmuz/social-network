import { Room } from "@/entities/room.model";
import useFetch from "@/shared/hooks/useFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ArrowLeft, Loader, UserPlus, Trash2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import { Button } from "@/shared/ui/button";
import { requestAPI } from "@/shared/lib/requestAPI";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { User } from "@/entities";
import { CreateRoomMultiselect } from "./create-room-multiselect";
import { useGetCurrentUserId } from "@/shared/hooks/useGetCurrentUserId";
import { RequestMethod } from "@/shared/lib/requestAPI";
import useSocket from "@/shared/hooks/useSocket";

export const ChatSettings = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const currentUserId = useGetCurrentUserId();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("Members");

  const { data: room, loading: roomLoading, setData: setRoom } = useFetch<Room>(
    `rooms/${chatId}`,
  );

  const { socketListen } = useSocket();

  useEffect(() => {
    socketListen('room-updated', (room: Room) => {
      if(room.id === chatId) {
        setRoom(room);
      }
    });
  }, []);

  const { data: users = [] } = useFetch<User[]>('users');

  const isOwner = room?.owner?.id === currentUserId;

  const addUsersToRoom = async () => {
    try {
      await requestAPI(`rooms/${chatId}/users`, RequestMethod.POST, {
        userIds: selectedUsers.map(user => user.id)
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to add users:', error);
    }
  };

  const deleteRoom = async () => {
    try {
      await requestAPI(`rooms/${chatId}`, RequestMethod.DELETE);
      
      navigate('/');
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      await requestAPI(`rooms/${chatId}/leave`, RequestMethod.POST);
      navigate('/');
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(`/${chatId}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, chatId]);

  const tabs = ["Members", "Media", "Files", "Links", "Music", "Voice", "GIFs"];

  return (
    <div className="flex flex-col h-full bg-slate-400 bg-opacity-10">
      <div className="p-2 py-4 border-b border-border bg-white flex items-center justify-between">
        <Link to={`/${chatId}`} className="text-[#3390ec] hover:text-[#3390ec]/80 absolute">
          <span className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-6 h-6" /> Back
          </span>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-base font-bold">Info</span>
        </div>
      </div>

      {!roomLoading && room ? (
        <div className="flex flex-col items-center justify-start mt-4 max-w-xl mx-auto w-full">
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
          
          {/* Tab navigation */}
          <div className="w-full overflow-x-auto mt-4">
            <div className="flex justify-center border-b border-gray-200 bg-white rounded-t-md">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  className={`px-3 pb-3 pt-4 text-base font-medium transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "text-[#3390ec] border-b-2 border-[#3390ec]"
                      : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
          
          {/* Members list */}
          {activeTab === "Members" && (
            <div className="w-full overflow-y-auto bg-white">
              {room?.users?.map((user) => {
                const isOnline = user.id === currentUserId || Math.random() > 0.7;
                const minutesAgo = Math.floor(Math.random() * 15) + 2;
                
                return (
                  <div key={user.id} className="flex items-center px-3 py-2 border-b border-gray-100">
                    <Avatar className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {user.nickname.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{user.nickname}</p>
                          <p className="text-sm text-blue-500">
                            {isOnline 
                              ? 'online' 
                              : `last seen ${minutesAgo} minutes ago`}
                          </p>
                        </div>
                        {user.id === room.owner.id && (
                          <span className="text-sm text-gray-400">owner</span>
                        )}
                        {user.id !== room.owner.id && Math.random() > 0.8 && (
                          <span className="text-sm text-gray-400">турист</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex w-full max-w-md gap-4 mt-10 px-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2 py-6"
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              <UserPlus className="h-6 w-6" />
              <span>Add</span>
            </Button>
            
            {isOwner ? (
              <Button 
                variant="outline" 
                className="flex-1 gap-2 py-6 text-destructive hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-6 w-6" />
                <span>Delete</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex-1 gap-2 py-6 text-destructive hover:text-destructive"
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                <LogOut className="h-6 w-6" />
                <span>Leave</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full flex-1">
          <Loader className="animate-spin text-slate-500" />
        </div>
      )}

      {/* Add Users Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Users to Room</DialogTitle>
            <DialogDescription>
              Select users to add to this room
            </DialogDescription>
          </DialogHeader>
          <CreateRoomMultiselect 
            users={users?.filter(user => !room?.users.some(roomUser => roomUser.id === user.id)) || []} 
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addUsersToRoom}>
              Add Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Room Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this room?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={leaveRoom}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};