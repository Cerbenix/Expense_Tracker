import React from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseSelect: (expenseId: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onExpenseSelect }) => {
  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id} onClick={() => onExpenseSelect(expense.id)}>
          <p>Date: {expense.date}</p>
          <p>Description: {expense.description}</p>
          <p>Amount: {expense.amount}</p>
          {expense.paidBy === 'you' ? (
            <p>You paid: {expense.amount}</p>
          ) : (
            <p>Owed to {expense.paidBy}: {expense.amount}</p>
          )}

          {/* Add expandable details here based on expense.expanded */}
          {expense.expanded && (
            <div>
              {/* Show the participants and their individual expenses here */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
