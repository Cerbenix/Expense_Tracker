import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface CreateGroupFormProps {
  onSubmit: (groupName: string, participants: string[]) => void;
  onCancel: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState<string[]>(["", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleAddMemberField = () => {
    if (participants.length < 10) {
      setParticipants([...participants, ""]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (groupName.trim() !== "") {
      const filteredParticipants = participants.filter(
        (participant) => participant.trim() !== ""
      );
      onSubmit(groupName, filteredParticipants);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-1/5">
      <Typography variant="h4" className="mb-5">
        Create New Group
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <TextField
          label="Group Name"
          variant="outlined"
          color="primary"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <div className="flex flex-col">
          {participants.map((participant, index) => (
            <TextField
              key={index}
              label={`Member ${index + 1}`}
              variant="outlined"
              color="primary"
              value={participant}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="mt-2"
            />
          ))}
        </div>
        <Button
          variant="text"
          color="success"
          type="button"
          onClick={handleAddMemberField}
          className="my-2"
        >
          Add Member
        </Button>
        <div className="flex justify-between">
          <Button variant="contained" color="success" className="bg-green-700 text-white" type="submit">
            Create Group
          </Button>
          <Button variant="outlined" color="error" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;
