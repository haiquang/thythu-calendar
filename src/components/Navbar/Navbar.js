import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const localUser = localStorage.getItem('calendar_username');;

  async function handleLogout() {
    try {
      if (currentUser) {
        await logout();
      } else {
        localStorage.removeItem('calendar_username');;
      }
      
      navigate('/login');
    } catch {
      alert('Failed to log out');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Lịch Thy Thư</Link>
      </div>
      <div className="navbar-menu">
        {currentUser || localUser ? (
          <>
            <div>{localUser || currentUser?.email}</div>
            <button onClick={handleLogout} className="logout-button">
              Đăng xuất
            </button>
          </>
        ) : ''}
      </div>
    </nav>
  );
};

export default Navbar;
