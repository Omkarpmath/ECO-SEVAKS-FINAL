import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them there after they login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}