import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Wrench, Plus, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Maintenance = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const requests = useMemo(() => {
    if (isDemoMode) {
      return [
        { id: 1, title: 'Leaky faucet in kitchen', property: 'Property 1', status: 'Pending', date: new Date().toISOString(), priority: 'Medium' },
        { id: 2, title: 'Broken window in bedroom', property: 'Property 1', status: 'In Progress', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), priority: 'High' },
        { id: 3, title: 'AC not working', property: 'Property 1', status: 'Completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), priority: 'High' },
      ];
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Maintenance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Maintenance Requests</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Request
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="w-4 h-4" />
              Maintenance Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && requests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-xs">{request.title}</TableCell>
                        <TableCell className="text-xs">{request.property}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={request.priority === 'High' ? 'destructive' : 'secondary'}
                            className="text-[10px]"
                          >
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={request.status === 'Completed' ? 'default' : request.status === 'In Progress' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(request.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Camera className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Wrench className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Maintenance request management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Create maintenance requests, upload photos, and track request status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
