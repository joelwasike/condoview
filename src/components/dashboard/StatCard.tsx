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
        "group relative p-7 rounded-2xl transition-all duration-300 animate-fade-in overflow-hidden",
        variant === "primary"
          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
          : "bg-card text-card-foreground shadow-sm border border-border hover:shadow-md hover:border-border/80"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className={cn(
            "text-sm font-semibold tracking-wide uppercase",
            variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground"
          )}>
            {title}
          </p>
          {trend && (
            <span className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
              variant === "primary"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-accent/10 text-accent"
            )}>
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-4xl font-bold mb-2 tracking-tight">{value}</p>
        {subtitle && (
          <p className={cn(
            "text-sm leading-relaxed",
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
