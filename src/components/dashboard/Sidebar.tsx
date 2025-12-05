import { 
  LayoutDashboard, Building2, Users, DollarSign, MessageCircle, LogOut, FileText, Settings, 
  TrendingUp, Wrench, Briefcase, UserCog, Home, AlertTriangle, Calendar, Package, 
  BarChart3, Mail, Send, Bell, CreditCard, CheckCircle, Megaphone, ClipboardList,
  Receipt, Wallet, Search, Filter
} from "lucide-react";
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
      { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", to: `/${role}?tab=overview` },
    ];

    switch (role) {
      case 'superadmin':
        return [
          ...baseItems,
          { icon: <DollarSign className="w-5 h-5" />, label: "Transactions", to: `/${role}?tab=transactions` },
          { icon: <Users className="w-5 h-5" />, label: "Clients", to: `/${role}?tab=clients` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=ads` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'tenant':
        return [
          ...baseItems,
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}?tab=payments` },
          { icon: <Wrench className="w-5 h-5" />, label: "Maintenance", to: `/${role}?tab=maintenance` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'landlord':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Properties", to: `/${role}?tab=properties` },
          { icon: <Users className="w-5 h-5" />, label: "Tenants", to: `/${role}?tab=tenants` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}?tab=payments` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Rents", to: `/${role}?tab=rents` },
          { icon: <FileText className="w-5 h-5" />, label: "Expenses", to: `/${role}?tab=expenses` },
          { icon: <Wrench className="w-5 h-5" />, label: "Works", to: `/${role}?tab=works` },
          { icon: <FileText className="w-5 h-5" />, label: "Documents", to: `/${role}?tab=documents` },
          { icon: <Package className="w-5 h-5" />, label: "Inventory", to: `/${role}?tab=inventory` },
          { icon: <BarChart3 className="w-5 h-5" />, label: "Tracking", to: `/${role}?tab=tracking` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'salesmanager':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Occupancy", to: `/${role}?tab=occupancy` },
          { icon: <Users className="w-5 h-5" />, label: "Clients", to: `/${role}?tab=clients` },
          { icon: <AlertTriangle className="w-5 h-5" />, label: "Alerts", to: `/${role}?tab=alerts` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'admin':
        return [
          ...baseItems,
          { icon: <Mail className="w-5 h-5" />, label: "Inbox", to: `/${role}?tab=inbox` },
          { icon: <FileText className="w-5 h-5" />, label: "Documents", to: `/${role}?tab=documents` },
          { icon: <Send className="w-5 h-5" />, label: "Utilities", to: `/${role}?tab=utilities` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Debt", to: `/${role}?tab=debt` },
          { icon: <Bell className="w-5 h-5" />, label: "Reminders", to: `/${role}?tab=reminders` },
          { icon: <FileText className="w-5 h-5" />, label: "Leases", to: `/${role}?tab=leases` },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Automation", to: `/${role}?tab=automation` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'accounting':
        return [
          ...baseItems,
          { icon: <DollarSign className="w-5 h-5" />, label: "Collections", to: `/${role}?tab=collections` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Payments", to: `/${role}?tab=payments` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Tenant Payments", to: `/${role}?tab=tenant-payments` },
          { icon: <BarChart3 className="w-5 h-5" />, label: "Reports", to: `/${role}?tab=reports` },
          { icon: <FileText className="w-5 h-5" />, label: "Expenses", to: `/${role}?tab=expenses` },
          { icon: <Users className="w-5 h-5" />, label: "Tenants", to: `/${role}?tab=tenants` },
          { icon: <Wallet className="w-5 h-5" />, label: "Deposits", to: `/${role}?tab=deposits` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'technician':
        return [
          ...baseItems,
          { icon: <CheckCircle className="w-5 h-5" />, label: "Inspections", to: `/${role}?tab=inspections` },
          { icon: <Calendar className="w-5 h-5" />, label: "Tasks", to: `/${role}?tab=tasks` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'commercial':
        return [
          ...baseItems,
          { icon: <Building2 className="w-5 h-5" />, label: "Listings", to: `/${role}?tab=listings` },
          { icon: <Calendar className="w-5 h-5" />, label: "Visits", to: `/${role}?tab=visits` },
          { icon: <Users className="w-5 h-5" />, label: "Requests", to: `/${role}?tab=requests` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=chat` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
        ];
      case 'agencydirector':
        return [
          ...baseItems,
          { icon: <Users className="w-5 h-5" />, label: "Management", to: `/${role}?tab=management` },
          { icon: <Building2 className="w-5 h-5" />, label: "Properties", to: `/${role}?tab=properties` },
          { icon: <DollarSign className="w-5 h-5" />, label: "Accounting", to: `/${role}?tab=accounting` },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Analytics", to: `/${role}?tab=analytics` },
          { icon: <Megaphone className="w-5 h-5" />, label: "Ads", to: `/${role}?tab=advertisements` },
          { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", to: `/${role}?tab=messages` },
          { icon: <CreditCard className="w-5 h-5" />, label: "Subscription", to: `/${role}?tab=subscription` },
          { icon: <Settings className="w-5 h-5" />, label: "Settings", to: `/${role}?tab=settings` },
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
