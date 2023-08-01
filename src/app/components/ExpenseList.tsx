import { Typography } from "@mui/material";
import React from "react";

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseSelect: (expenseId: string) => void;
  user: Participant | null;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onExpenseSelect,
  user,
}) => {
  return (
    <div className="flex flex-col">
      {expenses.map((expense) => (
        <div key={expense.id} onClick={() => onExpenseSelect(expense.id)}>
          <div className="flex flex-row justify-between bg-gray-50 border-b-[1px] p-2">
            <div className="flex flex-row items-center">
              <p>{expense.date}</p>
              <p className="mx-2">{expense.description}</p>
            </div>

            {user && (
              <div className="flex flex-col ">
                <p>
                  {expense.paidBy} paid: {expense.amount.toFixed(2)}$
                </p>

                {expense.paidBy === user.name ? (
                  <p>
                    You lent:
                    <span className="text-green-400">
                      {" "}
                      {(expense.amount - expense.amount / expense.participants.length).toFixed(2)}$
                    </span>
                  </p>
                ) : (
                  <p>
                    You owe {expense.paidBy}{" "}
                    <span className="text-red-400">
                      {(expense.amount / expense.participants.length).toFixed(2)}$
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {expense.expanded && (
            <div className="flex flex-col p-2">
              <Typography variant="h6">Participants:</Typography>
              {expense.participants.map((participant) => (
                <p key={participant.name}>
                  {participant.name} owes {(expense.amount / expense.participants.length).toFixed(2)}$
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
