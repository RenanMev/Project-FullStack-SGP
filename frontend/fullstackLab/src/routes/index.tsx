import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ProtectedLayout from './ProtectedLayout';
import NotFound from '@/pages/notFound';
import ProjectsList from '@/pages/Projects/ProjectsPage';
import CreateProjects from '@/pages/CreateProjects/CreateProjects';
import Collaborators from '@/pages/Collaborators/Collaborators';
import RouteAuth from './RouteAuth';
import Dashboard from '@/pages/Dashboard/Dashboard';
import EditProject from '@/pages/Projects/EditProject';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RouteAuth />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/createProjects" element={<CreateProjects />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/projects/:id" element={<EditProject/>} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;