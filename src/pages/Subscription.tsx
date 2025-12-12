import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Subscription = () => {
  return (
    <DashboardLayout title="Subscription">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                </div>
                <Badge className="gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Subscription management functionality will be implemented here
                </p>
                <Button>Manage Subscription</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Payment history will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
