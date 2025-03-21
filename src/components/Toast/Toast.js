import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';

const Toast = ({ toasts, removeToast }) => {
  const handleClose = (id) => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    removeToast(id);
  };

  return (
    <Stack 
      spacing={2}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        zIndex: 2000,
        maxWidth: '80vw'
      }}
    >
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.autoHideDuration}
          onClose={handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ position: 'relative', mt: 1 }}
        >
          <Alert
            onClose={handleClose(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default Toast;
