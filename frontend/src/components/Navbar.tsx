import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="font-bold">Dashboard</h1>
      <button
        onClick={() => handleLogout()}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
