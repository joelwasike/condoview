import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "primary" | "default";
}

const StatCard = ({ title, value, subtitle, variant = "default" }: StatCardProps) => {
  return (
    <div
      className={cn(
        "p-6 rounded-xl transition-all duration-200 animate-fade-in",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-card text-card-foreground shadow-card hover:shadow-card-hover"
      )}
    >
      <p className={cn(
        "text-sm font-medium mb-2",
        variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        {title}
      </p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subtitle && (
        <p className={cn(
          "text-sm",
          variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
