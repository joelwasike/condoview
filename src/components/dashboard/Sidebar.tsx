import { LayoutDashboard, Building2, Shield, DollarSign, MessageCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

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
        <NavItem
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          to="/"
        />
        <NavItem
          icon={<Building2 className="w-5 h-5" />}
          label="Properties"
          to="/properties"
        />
        <NavItem
          icon={<Shield className="w-5 h-5" />}
          label="Insurance"
          to="/insurance"
        />
        <NavItem
          icon={<DollarSign className="w-5 h-5" />}
          label="Income"
          to="/income"
        />
        <NavItem
          icon={<MessageCircle className="w-5 h-5" />}
          label="Chat"
          to="/chat"
        />
      </nav>

      {/* Logout */}
      <div className="w-full px-2">
        <button className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all duration-200 w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50">
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
