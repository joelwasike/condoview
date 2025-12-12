import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 580 },
  { month: "Feb", value: 620 },
  { month: "Mar", value: 590 },
  { month: "Apr", value: 640 },
  { month: "May", value: 520 },
  { month: "Jun", value: 480 },
  { month: "Jul", value: 380 },
  { month: "Aug", value: 420 },
  { month: "Sep", value: 580 },
  { month: "Oct", value: 550 },
  { month: "Nov", value: 620 },
  { month: "Dec", value: 590 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        $ {payload[0].value.toFixed(2)}
      </div>
    );
  }
  return null;
};

const OverviewChart = () => {
  const [period, setPeriod] = useState("Month");

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-0.5">Total Overview</h3>
          <p className="text-xs text-muted-foreground">Property value trends over time</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs font-medium text-card-foreground bg-secondary border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
        >
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 11 }}
              tickFormatter={(value) => `$${value}`}
              tickMargin={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 7, fill: "hsl(217, 91%, 60%)", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
