import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DollarSign, Bell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockDebts } from "@/utils/mockData";

const Debts = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const debts = useMemo(() => {
    if (isDemoMode) {
      return generateMockDebts(15);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Debts">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4" />
              Debt Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && debts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell className="font-medium text-xs">{debt.tenantName}</TableCell>
                        <TableCell className="text-xs">Property #{debt.propertyId}</TableCell>
                        <TableCell className="text-xs">{debt.description}</TableCell>
                        <TableCell className="text-xs font-semibold">${debt.amount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(debt.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={debt.status === 'Paid' ? 'default' : debt.status === 'Partially Paid' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {debt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {debt.status !== 'Paid' && (
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Bell className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Debt management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Track debts, send reminders, and mark debts as paid</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Debts;
