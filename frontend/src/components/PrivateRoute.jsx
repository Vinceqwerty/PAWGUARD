import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Requires login
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

// Requires specific role
export function RoleGuard({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}