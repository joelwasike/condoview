import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  DollarSign, 
  Wrench, 
  Home, 
  CreditCard,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import './DemoRoleSelection.css';

const roles = [
  {
    id: 'agency_director',
    name: 'Agency Director',
    description: 'Manage properties, users, finances, and analytics',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'salesmanager',
    name: 'Sales Manager',
    description: 'Manage occupancy, clients, and alerts',
    icon: Users,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Manage listings, visits, and requests',
    icon: Building2,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'admin',
    name: 'Administrative',
    description: 'Manage documents, utilities, debts, and leases',
    icon: DollarSign,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Manage payments, expenses, and financial reports',
    icon: CreditCard,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'technician',
    name: 'Technician',
    description: 'Manage inspections, tasks, and maintenance',
    icon: Wrench,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'landlord',
    name: 'Landlord',
    description: 'Manage properties, tenants, payments, and expenses',
    icon: Home,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'tenant',
    name: 'Tenant',
    description: 'View payments, maintenance requests, and lease info',
    icon: Users,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Manage companies, users, and system-wide settings',
    icon: BarChart3,
    color: 'from-gray-700 to-gray-800'
  },
];

const DemoRoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Set demo mode in localStorage
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('demo_role', roleId);
    // Set a demo user object
    localStorage.setItem('user', JSON.stringify({
      id: 'demo-user',
      role: roleId,
      name: `Demo ${roles.find(r => r.id === roleId)?.name}`,
      email: `demo@${roleId}.com`
    }));
    // Set a demo token to satisfy ProtectedRoute
    localStorage.setItem('token', 'demo-token');
    // Navigate to dashboard
    window.location.href = '/';
  };

  return (
    <div className="demo-role-selection">
      <div className="demo-container">
        <div className="demo-header">
          <h1>Demo Dashboard</h1>
          <p>Select a role to explore the dashboard with demo data</p>
          <button 
            onClick={() => navigate('/login')}
            className="back-to-login"
          >
            ← Back to Login
          </button>
        </div>

        <div className="roles-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className={`role-icon bg-gradient-to-br ${role.color}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="role-content">
                  <h3>{role.name}</h3>
                  <p>{role.description}</p>
                </div>
                <ArrowRight className="role-arrow" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemoRoleSelection;
