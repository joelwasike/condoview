import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Sale", value: 1100, color: "hsl(217, 91%, 60%)" },
  { name: "Rent", value: 2300, color: "hsl(160, 84%, 39%)" },
];

const PropertyDonut = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-card-foreground">Property Sale & Rent</h3>
        <button className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative h-44 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
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
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Total</span>
          <span className="text-2xl font-semibold text-card-foreground">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-chart-blue shadow-sm" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-card-foreground transition-colors">Total Sale</span>
          </div>
          <span className="text-sm font-semibold text-card-foreground">1.1k</span>
        </div>
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-chart-green shadow-sm" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-card-foreground transition-colors">Total Rent</span>
          </div>
          <span className="text-sm font-semibold text-card-foreground">2.3k</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyDonut;
