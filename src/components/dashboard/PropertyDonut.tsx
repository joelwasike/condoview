import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Sale", value: 1100, color: "hsl(217, 91%, 60%)" },
  { name: "Rent", value: 2300, color: "hsl(160, 84%, 39%)" },
];

const PropertyDonut = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Property Sale & Rent</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-card-foreground">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-blue" />
            <span className="text-sm text-muted-foreground">Total Sale</span>
          </div>
          <span className="text-sm font-medium text-card-foreground">1.1k</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-green" />
            <span className="text-sm text-muted-foreground">Total Rent</span>
          </div>
          <span className="text-sm font-medium text-card-foreground">2.3k</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyDonut;
