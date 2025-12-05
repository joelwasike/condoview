import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Sale", value: 1100, color: "hsl(217, 91%, 60%)" },
  { name: "Rent", value: 2300, color: "hsl(160, 84%, 39%)" },
];

const PropertyDonut = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-card rounded-2xl p-7 shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-card-foreground">Property Sale & Rent</h3>
        <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-52 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total</span>
          <span className="text-3xl font-bold text-card-foreground">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-chart-blue shadow-sm" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-card-foreground transition-colors">Total Sale</span>
          </div>
          <span className="text-base font-bold text-card-foreground">1.1k</span>
        </div>
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-chart-green shadow-sm" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-card-foreground transition-colors">Total Rent</span>
          </div>
          <span className="text-base font-bold text-card-foreground">2.3k</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyDonut;
