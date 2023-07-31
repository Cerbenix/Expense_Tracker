import { Typography, Button, MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';

interface ExpenseFormProps {
  groups: Group[];
  selectedGroup: Group | null;
  onClose: () => void;
  onSubmit: (expense: Expense, updatedGroup: Group) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ groups, selectedGroup, onClose, onSubmit }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    selectedGroup ? selectedGroup.id : null
  );
  const [amount, setAmount] = useState<number>(0);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(
    selectedGroup ? selectedGroup.members[0] : null
  );
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedGroupId && selectedParticipant) {
      const newExpense: Expense = {
        id: `expense-${Date.now()}`,
        description: description,
        participants: [selectedParticipant],
        amount: amount,
        paidBy: selectedParticipant.name,
        date: date,
        settled: false,
        expanded: false,
      };
  
      // Find the selected group based on selectedGroupId
      const updatedGroup = groups.find((group) => group.id === selectedGroupId);

      if (updatedGroup) {
        // Calculate the changes in expensesOwed for each participant
        const updatedParticipants = updatedGroup.members.map((participant) => {
          if (participant.name === selectedParticipant.name) {
            // The expense was paid by this participant, reduce the expensesOwed
            return {
              ...participant,
              expensesOwed: [
                ...participant.expensesOwed,
                {
                  id: `expense-${Date.now()}`,
                  description: description,
                  amount: -amount,
                  paidBy: selectedParticipant.name,
                  date: date,
                },
              ],
            };
          } else {
            // The expense was not paid by this participant, update the expensesOwed with new expense
            return {
              ...participant,
              expensesOwed: [
                ...participant.expensesOwed,
                {
                  id: `expense-${Date.now()}`,
                  description: description,
                  amount: amount / (updatedGroup.members.length - 1),
                  paidBy: selectedParticipant.name,
                  date: date,
                },
              ],
            };
          }
        });

        // Update the selectedGroup with the updatedParticipants
        const updatedGroupWithExpenses: Group = {
          ...updatedGroup,
          members: updatedParticipants,
        };

        // Call the onSubmit prop with the new expense and the updated group
        onSubmit(newExpense, updatedGroupWithExpenses);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <Typography variant="h4" className="mb-5">
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <TextField
          select
          label="Select Group"
          variant="outlined"
          color="primary"
          value={selectedGroupId || ''}
          onChange={(e) => setSelectedGroupId(e.target.value || null)}
          className="mt-2"
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
          className="mt-2"
        />
        {selectedGroup && (
          <TextField
            select
            label="Select Paid By"
            variant="outlined"
            color="primary"
            value={selectedParticipant ? selectedParticipant.name : ''}
            onChange={(e) =>
              setSelectedParticipant(
                selectedGroup.members.find((member) => member.name === e.target.value) || null
              )
            }
            className="mt-2"
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
          className="mt-2"
        />
        <TextField
          label="Date"
          variant="outlined"
          color="primary"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2"
        />
        <div className='flex flex-row justify-between'>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          className="my-2"
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
