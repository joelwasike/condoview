import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Home, Plus, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockListings } from "@/utils/mockData";
import { landlordService } from "@/services/landlordService";

const Properties = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ['landlord-properties'],
    queryFn: () => landlordService.getProperties(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const properties = useMemo(() => {
    if (isDemoMode) {
      return generateMockListings(12);
    }
    return Array.isArray(apiProperties) ? apiProperties : [];
  }, [isDemoMode, apiProperties]);

  return (
    <DashboardLayout title="Property & Asset">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Properties & Assets</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Property
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Home className="w-4 h-4" />
              Property Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Address</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Price</TableHead>
                      <TableHead className="text-xs">Bed/Bath</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium text-xs">{property.title || property.name || `Property ${property.id}`}</TableCell>
                        <TableCell className="text-xs">{property.address || property.propertyAddress || '-'}</TableCell>
                        <TableCell className="text-xs">{property.type || property.propertyType || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={property.status === 'Available' || property.status === 'available' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {property.status || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {property.price ? `$${property.price}${property.priceType === 'monthly' ? '/mo' : ''}` : '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {property.bedrooms && property.bathrooms ? `${property.bedrooms}B/${property.bathrooms}B` : '-'}
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
                <Home className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No properties found</p>
                <p className="text-xs mt-1.5">Your properties will appear here once added</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Properties;
