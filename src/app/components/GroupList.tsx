import React, { useState } from "react";
import CreateGroupForm from "./CreateGroupForm";
import { Button, Typography } from "@mui/material";

interface GroupListProps {
  groups: Group[];
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: (groupName: string, members: string[]) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  onGroupSelect,
  onCreateGroup,
}) => {
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);

  const handleCreateGroup = (groupName: string, members: string[]) => {
    onCreateGroup(groupName, members);
    setShowCreateGroupForm(false);
  };

  return (
    <div>
      <div className="flex flex-row justify-between p-2">
      
      <Typography variant="h6">
        Groups
      </Typography>

      <Button variant="outlined" onClick={() => setShowCreateGroupForm(true)}>
        Add Group
      </Button>
      </div>
      
      <ul className="p-2">
        {groups.map((group) => (
          <li key={group.id} onClick={() => onGroupSelect(group.id)}>
            {group.name}
          </li>
        ))}
      </ul>
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
