import React from "react";

interface ParticipantBalanceProps {
  participants: Participant[];
}

function calculateTotalBalance(expensesOwed: ExpenseOwed[]): number {
  return expensesOwed.reduce((total, expense) => total + expense.amount, 0);
}

const ParticipantBalance: React.FC<ParticipantBalanceProps> = ({
  participants,
}) => {
  return (
    <div>
      <h2>Participants and Balances</h2>

      <ul>
        {participants.map((participant) => (
          <li key={participant.name}>
            {participant.name}:{" "}
            {calculateTotalBalance(participant.expensesOwed)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantBalance;
