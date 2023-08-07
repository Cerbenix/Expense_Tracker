import { Button, Typography } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import React from "react";

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseSelect: (expenseId: string) => void;
  user: Participant | null;
  group: Group | null;
  onAddExpense: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onExpenseSelect,
  user,
  group,
  onAddExpense
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between bg-gray-50 px-5 py-4 border-b-[1px] items-center">
            <Typography variant="h5">{group?.name}</Typography>

            <Button
              variant="contained"
              color="warning"
              onClick={() => onAddExpense()}
              className="bg-orange-500 text-white"
            >
              Add Expense
            </Button>
          </div>
      {expenses.map((expense) => (
        <div
          key={expense.id}
          onClick={() => onExpenseSelect(expense.id)}
          className={`cursor-pointer ${
            expense.settled ? "bg-green-100" : "bg-red-50"
          } border-b-[1px] p-2`}
        >
          <div>
            <div className="flex flex-row justify-between">
              <div className="w-1/2 mx-2">
                <p className="text-xs text-gray-400">
                  {formatDate(expense.date)}
                </p>
                <p className="font-bold">{expense.description}</p>
              </div>

              {user && (
                <div className="flex flex-col w-1/2">
                  <p className="text-gray-400">
                    {expense.paidBy} paid:{" "}
                    <span className="font-bold text-black">
                      {expense.amount.toFixed(2)}$
                    </span>
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
            <div>
              {group?.members.map((member) => {
                const settledExpensesOwed = member.expensesOwed.filter(
                  (expenseOwed) =>
                    expenseOwed.settled && expenseOwed.expenseId === expense.id
                );

                return (
                  <p key={member.name} className="text-green-600 ">
                    {settledExpensesOwed.map((expenseOwed) => (
                      <span key={expenseOwed.expenseId}>
                        <MonetizationOnIcon /> {member.name} sent:{" "}
                        {expenseOwed.amount}$
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>
          </div>

          {expense.expanded && (
            <div className="flex flex-col p-2 mt-2 border-t-[1px]">
              <Typography variant="h6">Participants:</Typography>
              {expense.participants.map((participant) => (
                <p key={participant.name}>
                  {participant.name}{" "}
                  {participant.name === expense.paidBy
                    ? `paid: ${(expense.amount).toFixed(2)}$`
                    : `owes ${(
                        expense.amount / expense.participants.length
                      ).toFixed(2)}$`}
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
