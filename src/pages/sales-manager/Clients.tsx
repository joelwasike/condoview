import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Plus, Search, Upload, Eye, Edit, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockClients } from "@/utils/mockData";
import { salesManagerService } from "@/services/salesManagerService";

const Clients = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiClients, isLoading } = useQuery({
    queryKey: ['sales-manager-clients'],
    queryFn: () => salesManagerService.getClients(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const clients = useMemo(() => {
    if (isDemoMode) {
      return generateMockClients(20);
    }
    return Array.isArray(apiClients) ? apiClients : [];
  }, [isDemoMode, apiClients]);

  return (
    <DashboardLayout title="Tenant Management">
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
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1.5 text-xs" size="sm">
              <Upload className="w-3.5 h-3.5" />
              Import Excel
            </Button>
            <Button className="gap-1.5 text-xs" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Add Client
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Clients & Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : clients.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Phone</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Properties</TableHead>
                      <TableHead className="text-xs">Joined</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client: any) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium text-xs">{client.name || client.fullName || `Client ${client.id}`}</TableCell>
                        <TableCell className="text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {client.email || '-'}
                        </TableCell>
                        <TableCell className="text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {client.phone || client.phoneNumber || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={client.status === 'Active' || client.status === 'active' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {client.status || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{client.propertyCount || client.propertiesCount || 0}</TableCell>
                        <TableCell className="text-xs">
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Edit className="w-3 h-3" />
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
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No clients found</p>
                <p className="text-xs mt-1.5">Create your first client profile to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
