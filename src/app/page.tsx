"use client";
import React, { useState } from "react";
import GroupList from "./components/GroupList";
import ExpenseList from "./components/ExpenseList";
import ParticipantBalance from "./components/ParticipantBalance";
import ExpenseForm from "./components/ExpenseForm";
import Header from "./components/Header";

const MainPage: React.FC = () => {
  const [user, setUser] = useState<Participant | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleGroupSelect = (groupId: string) => {
    const selectedGroup = groups.find((group) => group.id === groupId) || null;
    setSelectedGroup(selectedGroup);
    setSelectedExpenses(
      selectedGroup
        ? selectedGroup.expenses.map((expense) => ({
            ...expense,
            expanded: false,
          }))
        : []
    );
  };

  const handleCreateGroup = (groupName: string, memberNames: string[]) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupName,
      members: memberNames.map((name) => ({ name, expensesOwed: [] })),
      expenses: [],
    };

    if (user) {
      newGroup.members.push({ name: user.name, expensesOwed: [] });
    }

    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
    setSelectedExpenses([]);
  };

  const handleExpenseSelect = (expenseId: string) => {
    setSelectedExpenses((prevExpenses) => {
      return prevExpenses.map((expense) =>
        expense.id === expenseId
          ? { ...expense, expanded: !expense.expanded }
          : expense
      );
    });
  };

  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  const handleExpenseFormSubmit = (expense: Expense) => {
    if (selectedGroup) {
      const updatedGroup: Group = {
        ...selectedGroup,
        expenses: [...selectedGroup.expenses, expense],
      };

      const updatedGroups = groups.map((group) =>
        group.id === selectedGroup.id ? updatedGroup : group
      );

      setGroups(updatedGroups);
      setSelectedGroup(updatedGroup);
      setSelectedExpenses([...updatedGroup.expenses]);
      setShowExpenseForm(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Header user={user} onUserChange={setUser} />
      <div className="flex flex-row">
        <div className="w-1/4">
          {/* Header */}

          {/* Group List */}
          <GroupList
            groups={groups}
            onGroupSelect={handleGroupSelect}
            onCreateGroup={handleCreateGroup}
          />
          {/* Add Expense Button */}
        </div>
        <div className="w-1/2">
          <button onClick={handleAddExpense}>Add Expense</button>
          {/* Expense List */}
          <ExpenseList
            expenses={selectedExpenses}
            onExpenseSelect={handleExpenseSelect}
          />
          {/* Settlement History - Add this later as you requested it */}
        </div>
        <div className="w-1/4">
          {/* Your Total Balance - Add this later as you requested it */}
          {selectedGroup && (
            <ParticipantBalance participants={selectedGroup.members} />
          )}
        </div>
        {showExpenseForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center">
            {/* Display the expense form as a pop-up window */}
            <ExpenseForm
              groups={groups}
              selectedGroup={selectedGroup}
              onClose={() => setShowExpenseForm(false)}
              onSubmit={handleExpenseFormSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
