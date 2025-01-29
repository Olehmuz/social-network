import Multiselect from "multiselect-react-dropdown";
import { useState } from "react";

const users = [
  { name: "Олександр", id: 1 },
  { name: "Марія", id: 2 },
  { name: "Іван", id: 3 },
  { name: "Олена", id: 4 },
];

const CreateRoomMultiselect = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onSelect = (selectedList: any) => {
    setSelectedUsers(selectedList);
  };

  const onRemove = (selectedList: any) => {
    setSelectedUsers(selectedList);
  };

  return (
    <div className="grid gap-4 py-4">
      <Multiselect
        options={users}
        selectedValues={selectedUsers}
        onSelect={onSelect}
        onRemove={onRemove}
        displayValue="name"
        placeholder="Select users"
        showCheckbox
      />
    </div>
  )

};

export { CreateRoomMultiselect };