type Group = {
  id: string;
  name: string;
  members: Participant[];
  expenses: Expense[];
};

interface Expense {
  id: string;
  description: string;
  participants: Participant[];
  amount: number;
  paidBy: string;
  date: string;
  settled: boolean;
  expanded: boolean;
}

type ExpenseOwed = {
  expenseId: string;
  amount: number;
  settled: boolean;
};

type Participant = {
  name: string;
  expensesOwed: ExpenseOwed[];
};

