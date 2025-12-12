import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Plus, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockPayments } from "@/utils/mockData";

const Deposits = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const deposits = useMemo(() => {
    if (isDemoMode) {
      return generateMockPayments(15).filter(p => p.type === 'Deposit');
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Security Deposits">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Record Deposit
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" />
              Security Deposit Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && deposits.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Paid Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell className="font-medium text-xs">{deposit.tenantName}</TableCell>
                        <TableCell className="text-xs">Property #{deposit.propertyId}</TableCell>
                        <TableCell className="text-xs font-semibold">${deposit.amount}</TableCell>
                        <TableCell className="text-xs">
                          {deposit.paidDate ? new Date(deposit.paidDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={deposit.status === 'Paid' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {deposit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {deposit.status === 'Paid' && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ArrowLeftRight className="w-3.5 h-3.5" />
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
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Security deposit management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Record deposit payments, process refunds, and track deposit status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposits;
