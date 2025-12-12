import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockPayments } from "@/utils/mockData";

const Rents = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const rents = useMemo(() => {
    if (isDemoMode) {
      return generateMockPayments(15).filter(p => p.type === 'Rent');
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Rents Tracking">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" />
              Rent Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && rents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Paid Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rents.map((rent) => (
                      <TableRow key={rent.id}>
                        <TableCell className="font-medium text-xs">{rent.tenantName}</TableCell>
                        <TableCell className="text-xs">Property #{rent.propertyId}</TableCell>
                        <TableCell className="text-xs font-semibold">${rent.amount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(rent.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {rent.paidDate ? new Date(rent.paidDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={rent.status === 'Paid' ? 'default' : rent.status === 'Pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {rent.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Rent tracking functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Track rent payments and rental income</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rents;
