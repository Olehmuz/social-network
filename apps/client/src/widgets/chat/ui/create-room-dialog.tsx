import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { CreateRoomMultiselect } from "./create-room-multiselect";
import { Input } from "@/shared/ui/input";
import { User } from "@/entities";
import useFetch from "@/shared/hooks/useFetch";
import { useState } from "react";
import { RoomType } from "@/entities";
import { Button } from "@/shared/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router";

import { Room } from "@/entities";
import { requestAPI } from "@/shared/lib/requestAPI";

const createRoom = (roomName: string, users: User[], roomType: RoomType) => {
  return requestAPI<Room>('room', 'POST', {
    name: roomName,
    userIds: users.map((user) => user.id),
    type: roomType,
  });
}

export const CreateRoomDialog = ({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(RoomType.GROUP);

  const navigate = useNavigate();

  const { data: users = [] } = useFetch<User[]>('users');

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className="m-1" onClick={() => setIsDialogOpen(true)}><Edit /></Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription>
            Create a new group to start a conversation with multiple people.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <Select onValueChange={(value) => setSelectedRoomType(value as RoomType)} value={selectedRoomType}>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(RoomType).map((type) => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <CreateRoomMultiselect users={users || []} selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} />
        <DialogFooter>
          <Button type="submit" onClick={() => {
            createRoom(groupName, selectedUsers, selectedRoomType).then((room) => {
              setIsDialogOpen(false);
              navigate('/' + room.id);
            });
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};