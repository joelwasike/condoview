import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";

const Accounting = () => {
  return (
    <DashboardLayout title="Accounting">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value="$125,450"
            subtitle="This month"
            variant="primary"
            trend="+12.5%"
          />
          <StatCard
            title="Total Expenses"
            value="$45,230"
            subtitle="This month"
            trend="+8.3%"
          />
          <StatCard
            title="Net Profit"
            value="$80,220"
            subtitle="This month"
            trend="+15.7%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Tenant Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <Wallet className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>Tenant payments management will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Landlord Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <TrendingDown className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>Landlord payments management will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Accounting;
