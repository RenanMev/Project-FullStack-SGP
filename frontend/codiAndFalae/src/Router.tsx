// src/routes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Importando as páginas
import LoginPage from './pages/auth/LoginPage';
import PrivateRoute from './components/common/PrivateRoutes';
// import RegisterPage from './pages/auth/RegisterPage';
// import DashboardPage from './pages/dashboard/DashboardPage';
// import ProjectListPage from './pages/projects/ProjectListPage';
// import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
// import UserListPage from './pages/users/UserListPage';
// import NotFoundPage from './pages/notFound/NotFoundPage';

// Proteção de rotas (exemplo básico)

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><ProjectListPage /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailsPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />

        <Route path="/dashboard" element={<Navigate to="/" />} />

        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
