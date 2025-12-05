import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Check localStorage as fallback
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.role) {
          // User exists in localStorage but not in context - this shouldn't happen
          // but let's handle it gracefully by redirecting to login to refresh state
          return <Navigate to="/login" replace />;
        }
      } catch (e) {
        // Invalid user data
      }
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    // Redirect to user's default dashboard instead of "/"
    const roleRoutes: Record<string, string> = {
      superadmin: '/superadmin',
      tenant: '/tenant',
      landlord: '/landlord',
      salesmanager: '/salesmanager',
      admin: '/admin',
      accounting: '/accounting',
      technician: '/technician',
      commercial: '/commercial',
      agencydirector: '/agencydirector',
    };
    const defaultRoute = roleRoutes[user.role.toLowerCase()] || '/superadmin';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

