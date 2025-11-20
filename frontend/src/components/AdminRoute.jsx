import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}