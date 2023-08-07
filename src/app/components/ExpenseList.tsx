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
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          onClick={() => onExpenseSelect(expense.id)}
          className="cursor-pointer"
        >
          <div className="flex flex-row justify-between bg-gray-50 border-b-[1px] p-2">
            <div className="w-1/2 mx-2">
              <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
              <p className="font-bold">{expense.description}</p>
            </div>

            {user && (
              <div className="flex flex-col w-1/2">
                <p className="text-gray-400">
                  {expense.paidBy} paid: <span className="font-bold text-black">{expense.amount.toFixed(2)}$</span>
                </p>

                {expense.paidBy === user.name ? (
                  <p className="text-gray-400">
                    You lent:
                    <span className="text-green-400 font-bold">
                      {" "}
                      {(
                        expense.amount -
                        expense.amount / expense.participants.length
                      ).toFixed(2)}
                      $
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-400">
                    You owe {expense.paidBy}{" "}
                    <span className="text-red-400 font-bold">
                      {(expense.amount / expense.participants.length).toFixed(
                        2
                      )}
                      $
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
                  {participant.name} owes{" "}
                  {(expense.amount / expense.participants.length).toFixed(2)}$
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
