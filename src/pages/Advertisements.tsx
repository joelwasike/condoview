import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Megaphone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Advertisements = () => {
  return (
    <DashboardLayout title="Advertisements">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Advertisements</h2>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Advertisement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Advertisement Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Advertisement management functionality will be implemented here</p>
              <p className="text-xs mt-1.5">View and manage all active advertisements</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Advertisements;
