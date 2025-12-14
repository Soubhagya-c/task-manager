import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {

  const { isAuthenticated } = useAuth();
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link to="/dashboard">Dashboard</Link>
      {isAuthenticated ? <Link to="/profile">Profile</Link>  : <Link to="/login">Login</Link>}
    </nav>
  );
};

export default Navbar;
