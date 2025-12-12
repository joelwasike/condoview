import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";

const Tracking = () => {
  return (
    <DashboardLayout title="Business Tracking">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Business Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <OverviewChart />
              <RevenueChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tracking;
