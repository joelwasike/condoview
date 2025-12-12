import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building2, Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockListings } from "@/utils/mockData";
import { commercialService } from "@/services/commercialService";

const Listings = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiListings, isLoading } = useQuery({
    queryKey: ['commercial-listings'],
    queryFn: () => commercialService.listListings(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const listings = useMemo(() => {
    if (isDemoMode) {
      return generateMockListings(15);
    }
    return Array.isArray(apiListings) ? apiListings : [];
  }, [isDemoMode, apiListings]);

  return (
    <DashboardLayout title="Listings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
              />
            </div>
          </div>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Listing
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4" />
              Property Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : listings.length > 0 ? (
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
                      <TableHead className="text-xs">Area</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing: any) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium text-xs">{listing.title || listing.name || `Listing ${listing.id}`}</TableCell>
                        <TableCell className="text-xs">{listing.address || listing.propertyAddress || '-'}</TableCell>
                        <TableCell className="text-xs">{listing.type || listing.propertyType || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={listing.status === 'Available' || listing.status === 'available' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {listing.status || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {listing.price ? `$${listing.price}${listing.priceType === 'monthly' ? '/mo' : ''}` : '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {listing.bedrooms && listing.bathrooms ? `${listing.bedrooms}B/${listing.bathrooms}B` : '-'}
                        </TableCell>
                        <TableCell className="text-xs">{listing.area ? `${listing.area}m²` : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Trash2 className="w-3 h-3" />
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
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No listings found</p>
                <p className="text-xs mt-1.5">Create your first property listing to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Listings;
