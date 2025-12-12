import { LayoutDashboard, Building2, Users, DollarSign, TrendingUp, Megaphone, MessageCircle, CreditCard, Settings, LogOut, AlertTriangle, Calendar, ClipboardList, FileText, Mail, Send, Bell, Receipt, Wallet, Wrench, CheckCircle, Home, Package, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isExpanded: boolean;
}

const NavItem = ({ icon, label, to, isExpanded }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2.5 py-2 px-2.5 rounded-lg transition-all duration-200 w-full",
        isExpanded ? "justify-start" : "justify-center flex-col",
        isActive
          ? "text-sidebar-accent-foreground bg-sidebar-accent"
          : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
      )
    }
  >
    <span className="flex-shrink-0">{icon}</span>
    {isExpanded && (
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    )}
    {!isExpanded && (
      <span className="text-[9px] font-medium text-center leading-tight mt-0.5">{label}</span>
    )}
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar_expanded');
    return saved ? saved === 'true' : false;
  });
  
  // Get user role from localStorage
  const userRole = useMemo(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.role : null;
    } catch {
      return null;
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebar_expanded', String(newState));
    // Dispatch custom event to notify DashboardLayout
    window.dispatchEvent(new Event('sidebarToggle'));
  };

  // Define menu items based on role
  const menuItems = useMemo(() => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Overview", to: "/" },
      { icon: Settings, label: "Settings", to: "/settings" },
    ];

    switch (userRole) {
      case 'agency_director':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Users, label: "Management", to: "/management" },
          { icon: Building2, label: "Properties", to: "/properties" },
          { icon: DollarSign, label: "Accounting", to: "/accounting" },
          { icon: TrendingUp, label: "Analytics", to: "/analytics" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: CreditCard, label: "Subscription", to: "/subscription" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'salesmanager':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Building2, label: "Occupancy", to: "/occupancy" },
          { icon: Users, label: "Clients", to: "/clients" },
          { icon: AlertTriangle, label: "Alerts", to: "/alerts" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'commercial':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Building2, label: "Listings", to: "/listings" },
          { icon: Calendar, label: "Visits", to: "/visits" },
          { icon: ClipboardList, label: "Requests", to: "/requests" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'admin':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Mail, label: "Inbox", to: "/inbox" },
          { icon: FileText, label: "Documents", to: "/documents" },
          { icon: Send, label: "Utilities", to: "/utilities" },
          { icon: DollarSign, label: "Debts", to: "/debts" },
          { icon: Bell, label: "Reminders", to: "/reminders" },
          { icon: FileText, label: "Leases", to: "/leases" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'accounting':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: TrendingUp, label: "Collections", to: "/collections" },
          { icon: Building2, label: "Landlord Payments", to: "/landlord-payments" },
          { icon: CreditCard, label: "Tenant Payments", to: "/tenant-payments" },
          { icon: Receipt, label: "Reports", to: "/reports" },
          { icon: FileText, label: "Expenses", to: "/expenses" },
          { icon: Users, label: "Tenants", to: "/tenants" },
          { icon: CreditCard, label: "Deposits", to: "/deposits" },
          { icon: Wallet, label: "Cashier", to: "/cashier" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'technician':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: CheckCircle, label: "Inspections", to: "/inspections" },
          { icon: Calendar, label: "Tasks", to: "/tasks" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'landlord':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Home, label: "Properties", to: "/properties" },
          { icon: Users, label: "Tenants", to: "/tenants" },
          { icon: DollarSign, label: "Payments", to: "/payments" },
          { icon: CreditCard, label: "Rents", to: "/rents" },
          { icon: FileText, label: "Expenses", to: "/expenses" },
          { icon: Wrench, label: "Works", to: "/works" },
          { icon: FileText, label: "Documents", to: "/documents" },
          { icon: Package, label: "Inventory", to: "/inventory" },
          { icon: BarChart3, label: "Tracking", to: "/tracking" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'tenant':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: DollarSign, label: "Payments", to: "/payments" },
          { icon: Wrench, label: "Maintenance", to: "/maintenance" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      case 'superadmin':
        return [
          { icon: LayoutDashboard, label: "Overview", to: "/" },
          { icon: Receipt, label: "Transactions", to: "/transactions" },
          { icon: Users, label: "Clients", to: "/clients" },
          { icon: Megaphone, label: "Ads", to: "/advertisements" },
          { icon: MessageCircle, label: "Messages", to: "/messages" },
          { icon: Settings, label: "Settings", to: "/settings" },
        ];
      
      default:
        return baseItems;
    }
  }, [userRole]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_role');
    navigate('/login');
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col py-3 z-50 transition-all duration-300",
        isExpanded ? "w-56" : "w-20 items-center"
      )}
    >
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-[9px] font-medium py-0.5 px-1.5 text-center z-10">
          DEMO
        </div>
      )}
      
      {/* Header with Logo and Toggle */}
      <div className={cn("flex items-center relative mb-5", isExpanded ? "justify-between px-3" : "justify-center", isDemoMode && "mt-4")}>
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-primary-foreground rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground ml-auto"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Toggle button when collapsed - positioned at bottom */}
      {!isExpanded && (
        <div className="absolute bottom-20 left-0 right-0 px-2 z-30">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground bg-sidebar-accent/20 flex items-center justify-center"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex flex-col gap-1 flex-1 w-full", isExpanded ? "px-2.5" : "px-2", !isExpanded && "pb-16")}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.to}
              icon={<Icon className="w-4 h-4" />}
              label={item.label}
              to={item.to}
              isExpanded={isExpanded}
            />
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn("w-full", isExpanded ? "px-2.5" : "px-2", !isExpanded && "mb-16")}>
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 py-2 px-2.5 rounded-lg transition-all duration-200 w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50",
            isExpanded ? "justify-start" : "flex-col justify-center"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isExpanded && (
            <span className="text-xs font-medium">Log Out</span>
          )}
          {!isExpanded && (
            <span className="text-[9px] font-medium text-center leading-tight mt-0.5">Log Out</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
