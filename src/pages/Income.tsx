import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";

const monthlyIncome = [
  { month: "Jan", rent: 12400, sale: 45000 },
  { month: "Feb", rent: 13200, sale: 0 },
  { month: "Mar", rent: 12800, sale: 78000 },
  { month: "Apr", rent: 14100, sale: 0 },
  { month: "May", rent: 13500, sale: 92000 },
  { month: "Jun", rent: 15200, sale: 0 },
  { month: "Jul", rent: 14800, sale: 125000 },
  { month: "Aug", rent: 16200, sale: 0 },
  { month: "Sep", rent: 15400, sale: 68000 },
  { month: "Oct", rent: 17100, sale: 0 },
  { month: "Nov", rent: 16800, sale: 0 },
  { month: "Dec", rent: 18200, sale: 156000 },
];

const expenses = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 7800 },
  { month: "Mar", value: 9100 },
  { month: "Apr", value: 8500 },
  { month: "May", value: 10200 },
  { month: "Jun", value: 9800 },
  { month: "Jul", value: 11500 },
  { month: "Aug", value: 10200 },
  { month: "Sep", value: 9400 },
  { month: "Oct", value: 8800 },
  { month: "Nov", value: 9200 },
  { month: "Dec", value: 12400 },
];

const transactions = [
  { id: 1, property: "19 Abernethy Street", type: "Rent", amount: "+$2,500", date: "Dec 1, 2024", status: "Completed" },
  { id: 2, property: "42 Ocean Drive", type: "Rent", amount: "+$1,800", date: "Dec 1, 2024", status: "Completed" },
  { id: 3, property: "15 Park Avenue", type: "Maintenance", amount: "-$450", date: "Nov 28, 2024", status: "Completed" },
  { id: 4, property: "88 Harbor View", type: "Sale", amount: "+$156,000", date: "Nov 25, 2024", status: "Completed" },
  { id: 5, property: "27 Sunset Boulevard", type: "Rent", amount: "+$950", date: "Nov 1, 2024", status: "Pending" },
];

const stats = [
  { label: "Total Income", value: "$678,345", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Rental Income", value: "$180,900", change: "+8.2%", trend: "up", icon: Wallet },
  { label: "Property Sales", value: "$564,000", change: "+15.8%", trend: "up", icon: TrendingUp },
  { label: "Expenses", value: "$115,100", change: "-3.4%", trend: "down", icon: CreditCard },
];

const Income = () => {
  return (
    <DashboardLayout title="Income">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-accent" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Income Chart */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Income Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly rental and sales income</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-chart-blue" />
                <span className="text-sm text-muted-foreground">Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-chart-green" />
                <span className="text-sm text-muted-foreground">Sales</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncome} barGap={4}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Bar dataKey="rent" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="sale" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Chart */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Expenses</h3>
          <p className="text-2xl font-bold text-card-foreground mb-3">$115,100</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenses}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fill="url(#expenseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-xl shadow-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-4 font-medium text-card-foreground">{tx.property}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      tx.type === "Rent" ? "bg-primary/10 text-primary" :
                      tx.type === "Sale" ? "bg-accent/10 text-accent" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${tx.amount.startsWith("+") ? "text-accent" : "text-destructive"}`}>
                    {tx.amount}
                  </td>
                  <td className="p-4 text-muted-foreground">{tx.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      tx.status === "Completed" ? "bg-accent/10 text-accent" : "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Income;
