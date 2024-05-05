// Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from local storage or session storage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}


export default Logout;
