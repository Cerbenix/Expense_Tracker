import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface UnsettledExpensesPopupProps {
  open: boolean;
  onClose: () => void;
  participant: Participant;
  onSettleExpense: (participant: Participant) => void;
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

  const unsettledExpensesOwed = participant.expensesOwed.filter((expenseOwed) => !expenseOwed.settled);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Unsettled Expenses</DialogTitle>
      <DialogContent>
        <ul>
          {unsettledExpensesOwed.map((expenseOwed) => (
            <li key={expenseOwed.expenseId}>
              {findExpenseDescription(expenseOwed.expenseId)}: {Math.abs(expenseOwed.amount)}$
              <Button onClick={() => onSettleExpense(participant)}>Settle</Button>
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsettledExpensesPopup;
