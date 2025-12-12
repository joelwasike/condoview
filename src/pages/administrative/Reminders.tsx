import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockReminders } from "@/utils/mockData";

const Reminders = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const reminders = useMemo(() => {
    if (isDemoMode) {
      return generateMockReminders(10);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Reminders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Reminders</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Reminder
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4" />
              Reminder Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && reminders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell className="text-xs">{reminder.type}</TableCell>
                        <TableCell className="font-medium text-xs">{reminder.title}</TableCell>
                        <TableCell className="text-xs">{reminder.description}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={reminder.completed ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {reminder.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!reminder.completed && (
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
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Reminder management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Create, manage, and delete reminders for important tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reminders;
