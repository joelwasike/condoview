import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Property Dashboard" }: HeaderProps) => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {isDemoMode && (
            <span className="px-2 py-0.5 bg-yellow-500 text-yellow-900 text-[10px] font-semibold rounded-full">
              DEMO MODE
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {isDemoMode ? 'Exploring with demo data' : 'Welcome back! Here\'s your property overview'}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="w-9 h-9 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border shadow-sm">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border shadow-sm relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
        </button>
        <Avatar className="w-9 h-9 border-2 border-border shadow-sm ring-2 ring-background">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
