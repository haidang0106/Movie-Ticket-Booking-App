import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected — Chỉ ADMIN / SUPER_ADMIN */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<div className="p-6 text-text-secondary">Customers — đang phát triển...</div>} />
          <Route path="transaction" element={<div className="p-6 text-text-secondary">Transaction — đang phát triển...</div>} />
          <Route path="settings" element={<div className="p-6 text-text-secondary">Settings — đang phát triển...</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
