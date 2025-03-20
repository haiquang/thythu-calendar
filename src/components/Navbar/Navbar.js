import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InfoIcon from '@mui/icons-material/Info';
import { Popover, Typography, Box } from '@mui/material';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const localUser = localStorage.getItem('calendar_username');
  
  // Add state for popover
  const [anchorEl, setAnchorEl] = useState(null);

  async function handleLogout() {
    try {
      if (currentUser) {
        await logout();
      } else {
        localStorage.removeItem('calendar_username');
      }
      
      navigate('/login');
    } catch {
      alert('Failed to log out');
    }
  }
  
  // Handle info icon click
  const handleInfoClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInfoClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'info-popover' : undefined;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Lịch Thy Thư</Link>
        <div className="navbar-info" onClick={handleInfoClick}>
          <InfoIcon style={{ cursor: 'pointer' }} />
        </div>
        
        {/* Info Popover */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleInfoClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin ứng dụng
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Màu sắc sự kiện:</strong>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#3174ad', mr: 1 }} /> 
              Nghỉ phép / Nghỉ phiên
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#32a852', mr: 1 }} /> 
              Ra trực
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#a83232', mr: 1 }} /> 
              Trực đêm
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#a16e1e', mr: 1 }} /> 
              Trực 24
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#a83271', mr: 1 }} /> 
              Làm hành chính, không trực
            </Typography>
            <Typography variant="body2">
              <strong>Hướng dẫn:</strong> Click vào ngày để tạo sự kiện mới. Chỉ quản trị viên có thể xóa sự kiện.
            </Typography>
          </Box>
        </Popover>
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
