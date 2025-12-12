import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockLeases } from "@/utils/mockData";

const Leases = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const leases = useMemo(() => {
    if (isDemoMode) {
      return generateMockLeases(12);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Leases">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lease Management</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Lease
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Leases
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && leases.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Start Date</TableHead>
                      <TableHead className="text-xs">End Date</TableHead>
                      <TableHead className="text-xs">Monthly Rent</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leases.map((lease) => (
                      <TableRow key={lease.id}>
                        <TableCell className="font-medium text-xs">{lease.tenantName}</TableCell>
                        <TableCell className="text-xs">Property #{lease.propertyId}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(lease.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(lease.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs font-semibold">${lease.monthlyRent}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={lease.status === 'Active' ? 'default' : lease.status === 'Pending' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {lease.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Lease management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Create leases, generate lease documents, and manage lease status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Leases;
