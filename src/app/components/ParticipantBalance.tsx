import { Typography } from "@mui/material";
import React, { useState } from "react";
import UnsettledExpensesPopup from "./UnsettledExpensesPopup";

interface ParticipantBalanceProps {
  participants: Participant[];
  expenses: Expense[];
  onSettleExpense: (participant: Participant) => void;
}

function calculateTotalBalance(expensesOwed: ExpenseOwed[]): number {
  const unsettledExpensesOwed = expensesOwed.filter(
    (expense) => !expense.settled
  );
  return unsettledExpensesOwed.reduce(
    (total, expense) => total + expense.amount,
    0
  );
}

const ParticipantBalance: React.FC<ParticipantBalanceProps> = ({
  participants,
  expenses,
  onSettleExpense,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant>(participants[0]);
  const [openUnsettledExpenses, setOpenUnsettledExpenses] = useState(false);

  const handleParticipantClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setOpenUnsettledExpenses(true);
  };

  const handleCloseUnsettledExpenses = () => {
    setOpenUnsettledExpenses(false);
  };

  const handleSettleExpense = (participant: Participant) => {
    onSettleExpense(participant);
  };

  return (
    <div className="flex flex-col p-2">
      <Typography variant="h5">Group Balances</Typography>

      <ul className="space-y-2">
        {participants.map((participant) => {
          const totalBalance = calculateTotalBalance(participant.expensesOwed);
          const balanceColor =
            totalBalance >= 0 ? "text-red-400" : "text-green-400";
          const formattedBalance = Math.abs(totalBalance).toFixed(2);
          const balanceText = totalBalance >= 0 ? "Owes" : "Gets back";

          return (
            <li
              key={participant.name}
              className="flex items-center cursor-pointer"
              onClick={() => handleParticipantClick(participant)}
            >
              <div className="flex flex-col">
                <span className="mr-2 font-bold">{participant.name}:</span>
                <span className={balanceColor}>
                  {balanceText}: {formattedBalance}$
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <UnsettledExpensesPopup
        open={openUnsettledExpenses}
        onClose={handleCloseUnsettledExpenses}
        participant={selectedParticipant}
        onSettleExpense={handleSettleExpense}
        expenses={expenses}
      />
    </div>
  );
};

export default ParticipantBalance;
