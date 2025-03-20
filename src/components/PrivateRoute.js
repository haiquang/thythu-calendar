import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const storedUsername = localStorage.getItem('calendar_username');

  return (currentUser || storedUsername) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
