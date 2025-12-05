import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Property Dashboard" }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your property overview</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-11 h-11 rounded-xl bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border shadow-sm">
          <Search className="w-5 h-5" />
        </button>
        <button className="w-11 h-11 rounded-xl bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border shadow-sm relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
        </button>
        <Avatar className="w-11 h-11 border-2 border-border shadow-sm ring-2 ring-background">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
