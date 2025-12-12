import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "primary" | "default";
  trend?: string;
}

const StatCard = ({ title, value, subtitle, variant = "default", trend }: StatCardProps) => {
  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl transition-all duration-300 animate-fade-in overflow-hidden",
        variant === "primary"
          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
          : "bg-card text-card-foreground shadow-sm border border-border hover:shadow-md hover:border-border/80"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <p className={cn(
            "text-xs font-medium tracking-wide uppercase",
            variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground"
          )}>
            {title}
          </p>
          {trend && (
            <span className={cn(
              "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
              variant === "primary"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-accent/10 text-accent"
            )}>
              <TrendingUp className="w-2.5 h-2.5" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-semibold mb-1.5 tracking-tight">{value}</p>
        {subtitle && (
          <p className={cn(
            "text-xs leading-relaxed",
            variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {variant === "primary" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-16 translate-x-16" />
      )}
    </div>
  );
};

export default StatCard;
