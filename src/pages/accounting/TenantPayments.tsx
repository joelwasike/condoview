import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Plus, CheckCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockPayments } from "@/utils/mockData";
import { accountingService } from "@/services/accountingService";

const TenantPayments = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiPayments, isLoading } = useQuery({
    queryKey: ['accounting-tenant-payments'],
    queryFn: () => accountingService.getTenantPayments(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const payments = useMemo(() => {
    if (isDemoMode) {
      return generateMockPayments(25);
    }
    return Array.isArray(apiPayments) ? apiPayments : [];
  }, [isDemoMode, apiPayments]);

  return (
    <DashboardLayout title="Tenant Payments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tenant Payments</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1.5 text-xs" size="sm">
              <Download className="w-3.5 h-3.5" />
              Import
            </Button>
            <Button className="gap-1.5 text-xs" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Record Payment
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" />
              Tenant Payment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payments.length > 0 ? (
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
                    {payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium text-xs">
                          {payment.tenantName || payment.tenant?.name || `Tenant ${payment.id}`}
                        </TableCell>
                        <TableCell className="text-xs">
                          Property #{payment.propertyId || payment.property?.id || payment.id}
                        </TableCell>
                        <TableCell className="text-xs">{payment.type || payment.paymentType || '-'}</TableCell>
                        <TableCell className="text-xs font-semibold">${payment.amount || 0}</TableCell>
                        <TableCell className="text-xs">
                          {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {payment.paidDate || payment.paymentDate ? new Date(payment.paidDate || payment.paymentDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={payment.status === 'Paid' || payment.status === 'paid' ? 'default' : payment.status === 'Pending' || payment.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {payment.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {(payment.status === 'Pending' || payment.status === 'pending' || !payment.status) && (
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tenant payments found</p>
                <p className="text-xs mt-1.5">Record payments to see them listed here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantPayments;
