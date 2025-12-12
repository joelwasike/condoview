import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Wrench, Plus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockTasks } from "@/utils/mockData";

const Works = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const works = useMemo(() => {
    if (isDemoMode) {
      return generateMockTasks(10).map((t, i) => ({
        ...t,
        type: i % 2 === 0 ? 'Work Order' : 'Claim',
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Works & Claims">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Works & Claims</h2>
          <div className="flex gap-2">
            <Button className="gap-1.5 text-xs" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Create Work Order
            </Button>
            <Button variant="outline" className="gap-1.5 text-xs" size="sm">
              <AlertTriangle className="w-3.5 h-3.5" />
              Create Claim
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="w-4 h-4" />
              Work Orders & Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && works.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Assigned To</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Est. Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {works.map((work: any) => (
                      <TableRow key={work.id}>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {work.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-xs">{work.title}</TableCell>
                        <TableCell className="text-xs">{work.assignedTo}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={work.priority === 'High' ? 'destructive' : work.priority === 'Medium' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {work.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={work.status === 'Completed' ? 'default' : work.status === 'In Progress' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {work.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(work.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">{work.estimatedHours}h</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Wrench className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Work orders and claims management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Create work orders, manage claims, and track maintenance work</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Works;
