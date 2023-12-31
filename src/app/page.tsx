"use client";
import React, { useState } from "react";
import GroupList from "./components/GroupList";
import ExpenseList from "./components/ExpenseList";
import ParticipantBalance from "./components/ParticipantBalance";
import ExpenseForm from "./components/ExpenseForm";
import Header from "./components/Header";
import { Button, Typography } from "@mui/material";

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

  const handleSettleExpense = (
    participant: Participant,
    expenseOwed: ExpenseOwed
  ) => {
    if (selectedGroup) {
      const updatedParticipant: Participant = {
        ...participant,
        expensesOwed: participant.expensesOwed.map((expense) =>
          expense.expenseId === expenseOwed.expenseId
            ? { ...expense, settled: true }
            : expense
        ),
      };

      const expense = selectedGroup.expenses.find(
        (expense) => expense.id === expenseOwed.expenseId
      );

      if (expense) {
        const paidByParticipant = selectedGroup.members.find(
          (member) => member.name === expense.paidBy
        );

        if (paidByParticipant) {
          const updatedPaidByExpensesOwed = paidByParticipant.expensesOwed.map(
            (expense) =>
              expense.expenseId === expenseOwed.expenseId
                ? {
                    ...expense,
                    amount: expense.amount + expenseOwed.amount,
                    settled: expense.amount - expenseOwed.amount === 0,
                  }
                : expense
          );

          const updatedPaidByParticipant: Participant = {
            ...paidByParticipant,
            expensesOwed: updatedPaidByExpensesOwed,
          };

          const updatedParticipants = selectedGroup.members.map((member) =>
            member.name === paidByParticipant.name
              ? updatedPaidByParticipant
              : member
          );

          const isExpenseSettled =
            updatedPaidByExpensesOwed.find(
              (expense) => expense.expenseId === expenseOwed.expenseId
            )?.amount === 0;

          const updatedGroup: Group = {
            ...selectedGroup,
            members: updatedParticipants.map((member) =>
              member.name === updatedParticipant.name
                ? updatedParticipant
                : member
            ),
            expenses: selectedGroup.expenses.map((expense) =>
              expense.id === expenseOwed.expenseId
                ? { ...expense, settled: isExpenseSettled }
                : expense
            ),
          };

          const updatedGroups = groups.map((group) =>
            group.id === updatedGroup.id ? updatedGroup : group
          );

          setGroups(updatedGroups);
          setSelectedGroup(updatedGroup);
          setSelectedExpenses([...updatedGroup.expenses]);
        }
      }
    }
  };

  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  const handleExpenseFormSubmit = (expense: Expense) => {
    if (selectedGroup) {
      const participantsCount = selectedGroup.members.length;
      const amountPerParticipant = expense.amount / participantsCount;

      const updatedGroup: Group = {
        ...selectedGroup,
        expenses: [...selectedGroup.expenses, expense],
        members: selectedGroup.members.map((participant) => {
          if (participant.name === expense.paidBy) {
            return {
              ...participant,
              expensesOwed: [
                ...participant.expensesOwed,
                {
                  expenseId: expense.id,
                  amount: -(expense.amount - amountPerParticipant),
                  settled: false,
                },
              ],
            };
          } else {
            return {
              ...participant,
              expensesOwed: [
                ...participant.expensesOwed,
                {
                  expenseId: expense.id,
                  amount: amountPerParticipant,
                  settled: false,
                },
              ],
            };
          }
        }),
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

  const handleGroupDelete = (groupId: string) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
    setSelectedGroup(null);
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

  return (
    <div className="flex flex-col">
      <Header user={user} onUserChange={setUser} />
      <div className="flex flex-row w-2/3 self-center min-h-[92vh]">
        <div className="w-1/3">
          <GroupList
            groups={groups}
            onGroupSelect={handleGroupSelect}
            onCreateGroup={handleCreateGroup}
            onDeleteGroup={handleGroupDelete}
            user={user}
          />
        </div>
        <div className="w-1/2 border-x-[1px] border-b-[1px] border-gray-300 shadow-2xl">
          

          {selectedGroup === null? (
            <div className="flex justify-center">
              <Typography variant="body1" className="p-4 text-gray-400">
                No expenses to show. Create a group and add an expense.
              </Typography>
            </div>
          ) : (
            <ExpenseList
              expenses={selectedExpenses}
              onExpenseSelect={handleExpenseSelect}
              user={user}
              group={selectedGroup}
              onAddExpense={handleAddExpense}
            />
          )}
        </div>
        <div className="w-1/3">
          {selectedGroup && (
            <ParticipantBalance
              participants={selectedGroup.members}
              expenses={selectedGroup.expenses}
              onSettleExpense={handleSettleExpense}
            />
          )}
        </div>
        {showExpenseForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center">
            <ExpenseForm
              groups={groups}
              selectedGroup={selectedGroup}
              onClose={() => setShowExpenseForm(false)}
              onSubmit={handleExpenseFormSubmit}
              user={user}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
