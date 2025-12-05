import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, CheckCircle, AlertTriangle, Clock, FileText, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const policies = [
  {
    id: 1,
    name: "Property Coverage - 19 Abernethy St",
    provider: "SafeGuard Insurance",
    coverage: "$500,000",
    premium: "$1,200/yr",
    status: "Active",
    renewalDate: "Mar 15, 2025",
    progress: 75,
  },
  {
    id: 2,
    name: "Liability Insurance - Ocean Drive",
    provider: "Pacific Insurance Co.",
    coverage: "$1,000,000",
    premium: "$2,400/yr",
    status: "Active",
    renewalDate: "Jun 22, 2025",
    progress: 45,
  },
  {
    id: 3,
    name: "Flood Insurance - Harbor View",
    provider: "Coastal Protect",
    coverage: "$250,000",
    premium: "$800/yr",
    status: "Pending",
    renewalDate: "Dec 10, 2024",
    progress: 95,
  },
  {
    id: 4,
    name: "Fire Insurance - Park Avenue",
    provider: "FireShield Inc.",
    coverage: "$750,000",
    premium: "$1,800/yr",
    status: "Active",
    renewalDate: "Sep 01, 2025",
    progress: 25,
  },
];

const stats = [
  { label: "Total Policies", value: "12", icon: FileText, color: "bg-primary" },
  { label: "Active Coverage", value: "$4.5M", icon: Shield, color: "bg-accent" },
  { label: "Annual Premium", value: "$18,400", icon: Building2, color: "bg-chart-blue" },
  { label: "Claims Filed", value: "2", icon: AlertTriangle, color: "bg-destructive" },
];

const Insurance = () => {
  return (
    <DashboardLayout title="Insurance">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Policies Table */}
      <div className="bg-card rounded-xl shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Insurance Policies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Policy Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Provider</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Coverage</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Premium</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-card-foreground">{policy.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{policy.provider}</td>
                  <td className="p-4 font-medium text-card-foreground">{policy.coverage}</td>
                  <td className="p-4 text-muted-foreground">{policy.premium}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        policy.status === "Active"
                          ? "bg-accent/10 text-accent"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {policy.status === "Active" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {policy.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">{policy.renewalDate}</span>
                      <Progress value={policy.progress} className="h-1.5" />
                    </div>
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

export default Insurance;
