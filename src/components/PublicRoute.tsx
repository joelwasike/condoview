import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users to their dashboard
    const role = user.role?.toLowerCase();
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
    return <Navigate to={roleRoutes[role] || '/superadmin'} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

