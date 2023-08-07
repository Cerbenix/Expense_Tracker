import { Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface HeaderProps {
  user: Participant | null;
  onUserChange: (user: Participant) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUserChange }) => {
  const [userName, setUserName] = useState(user?.name || '');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleUserNameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (userName.trim() !== '') {
      const newUser: Participant = { name: userName, expensesOwed: [] };
      onUserChange(newUser);
      setFormSubmitted(true);
    }
  };

  return (
    <div className="bg-gray-200 text-black py-2 px-5 flex flex-row justify-between items-center h-[72px] shadow-lg z-0">
      <Typography variant="h4">Expense Tracker</Typography>

      {formSubmitted ? (
        <Typography variant="h5">Hello, {userName}!</Typography>
      ) : (
        <form className='flex flex-row' onSubmit={handleUserNameSubmit}>
          <TextField
            className="w-full bg-white rounded-md"
            label="Your Name"
            variant="outlined"
            value={userName}
            onChange={handleNameChange}
          />
          <button
            className='w-full ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-white hover:text-blue-500 transition-all'
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Header;
