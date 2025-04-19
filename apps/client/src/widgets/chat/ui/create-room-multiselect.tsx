import Multiselect from "multiselect-react-dropdown";
import { useMemo } from "react";

const CreateRoomMultiselect = ({ users, selectedUsers, onSelectionChange }: { users: any[], selectedUsers: any[], onSelectionChange: (selectedUsers: any[]) => void }) => {

  const onSelect = (selectedList: any) => {
    onSelectionChange(selectedList);
  };

  const onRemove = (selectedList: any) => {
    onSelectionChange(selectedList);
  };

  const usersOptions = useMemo(() => users.map((user) => ({
    name: user.nickname,
    id: user.id,
  })), [users]);

  console.log('usersOptions', usersOptions);

  return (
    <div className="grid py-2">
      {users.length > 0 ? (
        <Multiselect
          options={usersOptions}
          selectedValues={selectedUsers}
          onSelect={onSelect}
          onRemove={onRemove}
          displayValue="name"
          placeholder="Select users"
          showCheckbox
        />
      ) : (
        <p>No users available to select.</p>
      )}
    </div>
  )

};

export { CreateRoomMultiselect };