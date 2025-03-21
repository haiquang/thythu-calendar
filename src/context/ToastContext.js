import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const addToast = (message, severity = 'info', autoHideDuration = 5000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, severity, autoHideDuration }]);
    return id;
  };

  // Remove a toast notification by id
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  };

  // Convenience methods for different toast types
  const success = (message, autoHideDuration) => addToast(message, 'success', autoHideDuration);
  const error = (message, autoHideDuration) => addToast(message, 'error', autoHideDuration);
  const warning = (message, autoHideDuration) => addToast(message, 'warning', autoHideDuration);
  const info = (message, autoHideDuration) => addToast(message, 'info', autoHideDuration);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
