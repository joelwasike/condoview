import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Plus, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockTasks } from "@/utils/mockData";
import { technicianService } from "@/services/technicianService";

const Tasks = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiTasks, isLoading } = useQuery({
    queryKey: ['technician-tasks'],
    queryFn: () => technicianService.getTasks(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const tasks = useMemo(() => {
    if (isDemoMode) {
      return generateMockTasks(12);
    }
    return Array.isArray(apiTasks) ? apiTasks : [];
  }, [isDemoMode, apiTasks]);

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Maintenance Tasks</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Task
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Task Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Assigned To</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Est. Hours</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium text-xs">{task.title || task.name || `Task ${task.id}`}</TableCell>
                        <TableCell className="text-xs">{task.assignedTo || task.assignedToName || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.priority === 'High' || task.priority === 'high' ? 'destructive' : task.priority === 'Medium' || task.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {task.priority || 'Medium'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.status === 'Completed' || task.status === 'completed' ? 'default' : task.status === 'In Progress' || task.status === 'in_progress' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {task.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-xs">{task.estimatedHours || task.hours || '-'}h</TableCell>
                        <TableCell className="text-right">
                          {task.status !== 'Completed' && task.status !== 'completed' && (
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
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tasks found</p>
                <p className="text-xs mt-1.5">Maintenance tasks will appear here when assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
