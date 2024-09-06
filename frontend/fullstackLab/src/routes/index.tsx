// src/routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ProtectedLayout from './ProtectedLayout';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Adicione outras rotas protegidas aqui */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
