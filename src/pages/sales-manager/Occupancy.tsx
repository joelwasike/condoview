import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockListings } from "@/utils/mockData";

const Occupancy = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const properties = useMemo(() => {
    if (isDemoMode) {
      return generateMockListings(15).map((p) => ({
        ...p,
        occupancy: Math.floor(Math.random() * 100),
        tenantCount: Math.floor(Math.random() * 5),
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Occupancy">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
              />
            </div>
          </div>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Property
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4" />
              Property Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && properties.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Address</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Occupancy</TableHead>
                      <TableHead className="text-xs">Tenants</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium text-xs">{property.title}</TableCell>
                        <TableCell className="text-xs">{property.address}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={property.status === 'Available' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{property.occupancy}%</TableCell>
                        <TableCell className="text-xs">{property.tenantCount}</TableCell>
                        <TableCell className="text-xs">{property.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Property occupancy management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">View and manage property occupancy status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Occupancy;
