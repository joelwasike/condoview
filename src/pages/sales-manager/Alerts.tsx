import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockAlerts } from "@/utils/mockData";
import { salesManagerService } from "@/services/salesManagerService";

const Alerts = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiAlerts, isLoading } = useQuery({
    queryKey: ['sales-manager-alerts'],
    queryFn: () => salesManagerService.getAlerts(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const alerts = useMemo(() => {
    if (isDemoMode) {
      return generateMockAlerts(8);
    }
    return Array.isArray(apiAlerts) ? apiAlerts : [];
  }, [isDemoMode, apiAlerts]);

  return (
    <DashboardLayout title="Alerts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Alerts</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Alert
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4" />
              Alert Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : alerts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Property ID</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Message</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell className="text-xs">{alert.type || alert.alertType || 'Alert'}</TableCell>
                        <TableCell className="text-xs">#{alert.propertyId || alert.property?.id || alert.id}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={alert.priority === 'High' || alert.priority === 'high' ? 'destructive' : alert.priority === 'Medium' || alert.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {alert.priority || 'Medium'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{alert.message || alert.description || '-'}</TableCell>
                        <TableCell className="text-xs">
                          {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={alert.resolved || alert.status === 'Resolved' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {alert.resolved || alert.status === 'Resolved' ? 'Resolved' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!(alert.resolved || alert.status === 'Resolved') && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No alerts found</p>
                <p className="text-xs mt-1.5">Alerts will appear here when there are issues requiring attention</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
