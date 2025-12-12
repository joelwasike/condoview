import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", online: 85, offline: 45 },
  { month: "Feb", online: 92, offline: 38 },
  { month: "Mar", online: 78, offline: 42 },
  { month: "Apr", online: 65, offline: 35 },
  { month: "May", online: 88, offline: 48 },
  { month: "Jun", online: 72, offline: 32 },
  { month: "Jul", online: 95, offline: 52 },
  { month: "Aug", online: 68, offline: 28 },
  { month: "Sep", online: 82, offline: 45 },
  { month: "Oct", online: 75, offline: 38 },
  { month: "Nov", online: 90, offline: 42 },
  { month: "Dec", online: 58, offline: 32 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <p className="text-xs font-medium text-card-foreground mb-1.5">{label}</p>
        <p className="text-[10px] text-chart-blue flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-chart-blue" />
          Online: ${payload[0].value}k
        </p>
        <p className="text-[10px] text-chart-green flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-chart-green" />
          Offline: ${payload[1].value}k
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1.5">Total Revenue</h3>
          <p className="text-2xl font-semibold text-card-foreground">$678,345</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-blue shadow-sm" />
            <span className="text-xs font-medium text-muted-foreground">Online Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-green shadow-sm" />
            <span className="text-xs font-medium text-muted-foreground">Offline Sales</span>
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }}
              tickMargin={10}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="online"
              fill="hsl(217, 91%, 60%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={16}
            />
            <Bar
              dataKey="offline"
              fill="hsl(160, 84%, 39%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
