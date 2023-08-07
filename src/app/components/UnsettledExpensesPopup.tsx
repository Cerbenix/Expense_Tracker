import React, { useState, useEffect } from "react";
import { Dialog, Button, Typography } from "@mui/material";

interface UnsettledExpensesPopupProps {
  open: boolean;
  onClose: () => void;
  participant: Participant;
  onSettleExpense: (participant: Participant, expenseOwed: ExpenseOwed) => void;
  expenses: Expense[];
}

const UnsettledExpensesPopup: React.FC<UnsettledExpensesPopupProps> = ({
  open,
  onClose,
  participant,
  onSettleExpense,
  expenses,
}) => {
  const findExpenseDescription = (expenseId: string) => {
    const expense = expenses.find((expense) => expense.id === expenseId);
    return expense ? expense.description : "";
  };

  const [unsettledExpensesOwed, setUnsettledExpensesOwed] = useState<ExpenseOwed[]>(
    []
  );

  useEffect(() => {
    const updatedUnsettledExpenses = participant.expensesOwed
      .filter((expenseOwed) => !expenseOwed.settled && expenseOwed.amount > 0)
      .map((expenseOwed) => ({ ...expenseOwed }));
    setUnsettledExpensesOwed(updatedUnsettledExpenses);
  }, [participant]);

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-4 w-[400px]">
        <Typography variant="h4" className="font-bold">
          {participant.name}
        </Typography>
        <Typography variant="h6" className="font-bold">
          Unpaid expenses:
        </Typography>
        <div>
          {unsettledExpensesOwed.length > 0 ? (
            <ul>
              {unsettledExpensesOwed.map((expenseOwed) => (
                <li
                  key={expenseOwed.expenseId}
                  className="flex flex-row justify-between items-center my-2 font-bold"
                >
                  {findExpenseDescription(expenseOwed.expenseId)}:{" "}
                  {Math.abs(expenseOwed.amount)}$
                  <Button
                    onClick={() => onSettleExpense(participant, expenseOwed)}
                    variant="contained"
                    color="success"
                    className="ml-4 bg-green-700 text-white"
                  >
                    Settle
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1" className="mt-4">
              No unsettled expenses
            </Typography>
          )}
        </div>
        <div className="flex flex-row justify-end mt-4">
          <Button onClick={onClose} variant="outlined" color="error">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default UnsettledExpensesPopup;
