import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import CalendarView from './components/Calendar/CalendarView';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={
              <PrivateRoute>
                <CalendarView />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
