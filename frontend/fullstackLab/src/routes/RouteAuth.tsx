import React from 'react';
import { isAuthenticated } from '@/services/utils/auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RouteAuth: React.FC = () => {
  const authenticated = isAuthenticated();
  const location = useLocation();
  const currentPath = location.pathname;

  if (authenticated) {
    if (currentPath === "/" || currentPath === "/register") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default RouteAuth;