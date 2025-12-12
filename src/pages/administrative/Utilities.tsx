import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Send, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockUtilities } from "@/utils/mockData";

const Utilities = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const utilities = useMemo(() => {
    if (isDemoMode) {
      return generateMockUtilities(8);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="CIE/SODECI Transfers">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="w-4 h-4" />
              Utility Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && utilities.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Requested Date</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilities.map((utility) => (
                      <TableRow key={utility.id}>
                        <TableCell className="text-xs">{utility.type}</TableCell>
                        <TableCell className="text-xs">Property #{utility.propertyId}</TableCell>
                        <TableCell className="text-xs">{utility.tenantName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={utility.status === 'Completed' ? 'default' : utility.status === 'Pending' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {utility.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(utility.requestedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Send className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Utility transfer management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Manage CIE/SODECI transfers and utility document processing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Utilities;
