import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Check localStorage as fallback while loading
  const storedUserStr = localStorage.getItem('user');
  const storedUser = storedUserStr ? (() => {
    try {
      return JSON.parse(storedUserStr);
    } catch {
      return null;
    }
  })() : null;

  if (loading) {
    // If we have a stored user but context is still loading, wait a bit
    if (storedUser) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Use stored user as fallback if context user is not available yet
  const currentUser = user || storedUser;

  if (!currentUser) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role?.toLowerCase())) {
    console.log('ProtectedRoute: User role not allowed, redirecting');
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
    const defaultRoute = roleRoutes[currentUser.role?.toLowerCase()] || '/superadmin';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

