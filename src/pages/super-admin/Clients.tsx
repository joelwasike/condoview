import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockClients } from "@/utils/mockData";

const Clients = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const clients = useMemo(() => {
    if (isDemoMode) {
      return generateMockClients(25).map((c, i) => ({
        ...c,
        name: i < 10 ? `Company ${i + 1}` : i < 20 ? `Agency Director ${i - 9}` : `User ${i - 19}`,
        type: i < 10 ? 'Company' : i < 20 ? 'Agency Director' : 'User',
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Client List">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
              />
            </div>
          </div>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Client Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && clients.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Phone</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Properties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client: any) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium text-xs">{client.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {client.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{client.email}</TableCell>
                        <TableCell className="text-xs">{client.phone}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={client.status === 'Active' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{client.propertyCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Client management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">View and manage companies, agency directors, and users across the platform</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
