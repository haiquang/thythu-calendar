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
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userRef = ref(database, 'users');
    const tempusers = [];
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      for (let id in data) {
        tempusers.push({ id, ...data[id] });
      }
      setUsers(tempusers);
      localStorage.setItem('users', JSON.stringify(tempusers));
      return () => unsubscribe();
    })
  }, [])

  const handleContinue = async () => {
    if (!selectedUser) {
      setError('Làm ơn hãy chọn một người dùng');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Store the selected username in localStorage
      localStorage.setItem('calendar_username', selectedUser.name);
      
      navigate('/calendar');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
    setLoading(false);
  };

  const handleAdminLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await login(username, password);
      setOpenAdminDialog(false);
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
          
          <Autocomplete
            id="user-select"
            options={users}
            getOptionLabel={(option) => option.name}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            filterOptions={(options, { inputValue }) => {
              const filterValue = inputValue?.toLowerCase();
              if (!filterValue) return options;
              if (!options) return [];
              return options.filter(
                option => 
                  option.name.toLowerCase().includes(filterValue)
              );
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Tìm và chọn người dùng" 
                margin="normal"
                placeholder="Type to search users"
              />
            )}
            fullWidth
            disablePortal
            blurOnSelect
          />
          
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleContinue}
              disabled={loading}
              size="large"
            >
              Tiếp tục
            </Button>
          </Box>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button 
            color="secondary" 
            onClick={() => setOpenAdminDialog(true)}
            size="small"
          >
            Bạn là Admin?
          </Button>
        </Box>
      </Card>

      <Dialog open={openAdminDialog} onClose={() => setOpenAdminDialog(false)}>
        <DialogTitle>Đăng nhập Admin</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminDialog(false)}>Cancel</Button>
          <Button onClick={handleAdminLogin} disabled={loading}>Login</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
