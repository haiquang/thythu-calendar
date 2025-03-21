import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
// MUI imports
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Container,
  Autocomplete
} from '@mui/material';
import { database } from '../../firebase/config';
import { ref, push, set, onValue, remove } from 'firebase/database';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, []);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await login(username, password);
      navigate('/calendar');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <Card sx={{ width: '100%', maxWidth: 500, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Đăng nhập
          </Typography>
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Tên Đăng Nhập"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleLogin}
              disabled={loading}
              size="large"
            >
              Tiếp tục
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
