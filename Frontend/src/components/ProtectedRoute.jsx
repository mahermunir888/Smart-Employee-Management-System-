import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If there's no user or token, redirect to login
  if (!user || !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRole is specified, check if user has the required role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 