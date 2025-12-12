import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockClients } from "@/utils/mockData";

const Tenants = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const tenants = useMemo(() => {
    if (isDemoMode) {
      return generateMockClients(20).map((t, i) => ({
        ...t,
        paymentStatus: i % 3 === 0 ? 'Outstanding' : 'Up-to-date',
        outstandingAmount: i % 3 === 0 ? Math.floor(Math.random() * 2000) + 200 : 0,
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Tenants">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Tenant Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && tenants.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Phone</TableHead>
                      <TableHead className="text-xs">Payment Status</TableHead>
                      <TableHead className="text-xs">Outstanding</TableHead>
                      <TableHead className="text-xs">Properties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant: any) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium text-xs">{tenant.name}</TableCell>
                        <TableCell className="text-xs">{tenant.email}</TableCell>
                        <TableCell className="text-xs">{tenant.phone}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={tenant.paymentStatus === 'Up-to-date' ? 'default' : 'destructive'}
                            className="text-[10px]"
                          >
                            {tenant.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold">
                          {tenant.outstandingAmount > 0 ? `$${tenant.outstandingAmount}` : '-'}
                        </TableCell>
                        <TableCell className="text-xs">{tenant.propertyCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Tenant management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">View tenants with payment status (up-to-date or outstanding)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tenants;
