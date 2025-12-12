import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockExpenses } from "@/utils/mockData";

const Expenses = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const expenses = useMemo(() => {
    if (isDemoMode) {
      return generateMockExpenses(15);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Expenses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Expenses</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Expense
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Expense Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium text-xs">{expense.description}</TableCell>
                        <TableCell className="text-xs">{expense.category}</TableCell>
                        <TableCell className="text-xs">Property #{expense.propertyId}</TableCell>
                        <TableCell className="text-xs font-semibold">${expense.amount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={expense.status === 'Paid' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Expense management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Track and manage property expenses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
