import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DollarSign, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockPayments } from "@/utils/mockData";

const Payments = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const payments = useMemo(() => {
    if (isDemoMode) {
      return generateMockPayments(15);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Payments & Cash Flow">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4" />
              Payment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Paid Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium text-xs">{payment.tenantName}</TableCell>
                        <TableCell className="text-xs">Property #{payment.propertyId}</TableCell>
                        <TableCell className="text-xs">{payment.type}</TableCell>
                        <TableCell className="text-xs font-semibold">${payment.amount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={payment.status === 'Paid' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.status === 'Paid' && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Download className="w-3.5 h-3.5" />
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
                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Payment management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">View net payments, payment history, and generate receipts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
