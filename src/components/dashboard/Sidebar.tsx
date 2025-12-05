import { LayoutDashboard, Building2, Users, DollarSign, MessageCircle, LogOut, FileText, Settings, TrendingUp, Wrench, Briefcase, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const NavItem = ({ icon, label, to }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all duration-200 w-full",
        isActive
          ? "text-sidebar-accent-foreground bg-sidebar-accent"
          : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
      )
    }
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || '';

  const getRoleNavItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", to: `/${role}` },
    ];

    switch (role) {
      case 'superadmin':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Companies", to: `/${role}/companies` },
          { icon: <Users className="w-5 h-5" />, label: "Users", to: `/${role}/users` },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Financial", to: `/${role}/financial` },
        ];
      case 'tenant':
        return [
          ...baseItems,
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}/payments` },
          { icon: <Wrench className="w-5 h-5" />, label: "Maintenance", to: `/${role}/maintenance` },
          { icon: <FileText className="w-5 h-5" />, label: "Lease", to: `/${role}/lease` },
        ];
      case 'landlord':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Properties", to: `/${role}/properties` },
          { icon: <Users className="w-5 h-5" />, label: "Tenants", to: `/${role}/tenants` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}/payments` },
        ];
      case 'salesmanager':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Properties", to: `/${role}/properties` },
          { icon: <Users className="w-5 h-5" />, label: "Clients", to: `/${role}/clients` },
          { icon: <FileText className="w-5 h-5" />, label: "Alerts", to: `/${role}/alerts` },
        ];
      case 'admin':
        return [
          ...baseItems,
          { icon: <FileText className="w-5 h-5" />, label: "Documents", to: `/${role}/documents` },
          { icon: <Settings className="w-5 h-5" />, label: "Reminders", to: `/${role}/reminders` },
        ];
      case 'accounting':
        return [
          ...baseItems,
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}/payments` },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Expenses", to: `/${role}/expenses` },
        ];
      case 'technician':
        return [
          ...baseItems,
          { icon: <Wrench className="w-5 h-5" />, label: "Maintenance", to: `/${role}/maintenance` },
          { icon: <FileText className="w-5 h-5" />, label: "Quotes", to: `/${role}/quotes` },
          { icon: <Building2 className="w-5 h-5" />, label: "Inventory", to: `/${role}/inventory` },
        ];
      case 'commercial':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Listings", to: `/${role}/listings` },
          { icon: <Briefcase className="w-5 h-5" />, label: "Visits", to: `/${role}/visits` },
        ];
      case 'agencydirector':
        return [
          ...baseItems,
          { icon: <Users className="w-5 h-5" />, label: "Users", to: `/${role}/users` },
          { icon: <Building2 className="w-5 h-5" />, label: "Properties", to: `/${role}/properties` },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Financial", to: `/${role}/financial` },
        ];
      default:
        return baseItems;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8">
        <div className="w-6 h-6 bg-primary-foreground rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1 w-full px-2">
        {getRoleNavItems().map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="w-full px-2">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all duration-200 w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
