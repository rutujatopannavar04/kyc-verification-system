import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect admin to admin dashboard
  if (user?.role === 'admin' && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export { RequireAuth };
