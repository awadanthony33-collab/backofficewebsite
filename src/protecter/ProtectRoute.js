import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has logged in by checking sessionStorage
    const hasLogged = sessionStorage.getItem('isLoggedIn');
    
    if (hasLogged === 'true') 
    {
      setIsLoggedIn(true);
    } 
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;