import { Typography, Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";

interface ExpenseFormProps {
  groups: Group[];
  selectedGroup: Group | null;
  onClose: () => void;
  onSubmit: (expense: Expense) => void;
  user: Participant | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  groups,
  selectedGroup,
  onClose,
  onSubmit,
  user,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    selectedGroup ? selectedGroup.id : null
  );
  const [amount, setAmount] = useState<number>(0);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(user || null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedGroupId && selectedParticipant) {
      const selectedGroup = groups.find(
        (group) => group.id === selectedGroupId
      );

      if (selectedGroup) {
        const newExpense: Expense = {
          id: `expense-${Date.now()}`,
          description: description,
          participants: [...selectedGroup.members],
          amount: amount,
          paidBy: selectedParticipant.name,
          date: date,
          settled: false,
          expanded: false,
        };

        onSubmit(newExpense);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-1/5">
      <Typography variant="h4" className="mb-5">
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          select
          label="Select Group"
          variant="outlined"
          color="primary"
          value={selectedGroupId || ""}
          onChange={(e) => setSelectedGroupId(e.target.value || null)}
          
        >
          <MenuItem value="" disabled>
            Select a group
          </MenuItem>
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          variant="outlined"
          color="primary"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        {selectedGroup && (
          <TextField
            select
            label="Select Paid By"
            variant="outlined"
            color="primary"
            value={selectedParticipant ? selectedParticipant.name : ""}
            onChange={(e) =>
              setSelectedParticipant(
                selectedGroup.members.find(
                  (member) => member.name === e.target.value
                ) || null
              )
            }
          >
            {selectedGroup.members.map((member) => (
              <MenuItem key={member.name} value={member.name}>
                {member.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Description"
          variant="outlined"
          color="primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Date"
          variant="outlined"
          color="primary"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <Button
            variant="contained"
            color="success"
            type="submit"
            className="my-2 bg-green-700 text-white"
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            className="my-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
