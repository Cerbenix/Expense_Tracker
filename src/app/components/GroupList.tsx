import React, { useState } from "react";
import CreateGroupForm from "./CreateGroupForm";
import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface GroupListProps {
  groups: Group[];
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: (groupName: string, members: string[]) => void;
  onDeleteGroup: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  onGroupSelect,
  onCreateGroup,
  onDeleteGroup,
}) => {
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);

  const handleCreateGroup = (groupName: string, members: string[]) => {
    onCreateGroup(groupName, members);
    setShowCreateGroupForm(false);
  };

  return (
    <div>
      <div className="flex flex-row justify-between p-4">
        <Typography variant="h6">Groups</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setShowCreateGroupForm(true)}
          className="bg-green-700 text-white"
        >
          Add Group
        </Button>
      </div>
      {groups.length === 0 ? (
        <div className="flex justify-center">
        <Typography variant="body1" className="p-4 text-gray-400">
        You do not have any groups yet
        </Typography>
      </div>
      ) : (
        <ul className="px-4 space-y-1">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex items-center justify-between border-[1px] p-2 cursor-pointer rounded-md hover:bg-green-600 hover:text-white transition-all"
            >
              <span onClick={() => onGroupSelect(group.id)} className="font-bold">
                {group.name}
              </span>
              <DeleteIcon
                onClick={() => onDeleteGroup(group.id)}
                className="text-red-500 cursor-pointer hover:text-red-700 transition-all bg-white rounded-full p-0.5"
              />
            </li>
          ))}
        </ul>
      )}
      {showCreateGroupForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center">
          <CreateGroupForm
            onSubmit={handleCreateGroup}
            onCancel={() => setShowCreateGroupForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default GroupList;
