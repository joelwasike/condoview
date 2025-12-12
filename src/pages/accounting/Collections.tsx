import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockCollections } from "@/utils/mockData";
import { accountingService } from "@/services/accountingService";

const Collections = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiCollections, isLoading } = useQuery({
    queryKey: ['accounting-collections'],
    queryFn: () => accountingService.getCollections(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const collections = useMemo(() => {
    if (isDemoMode) {
      return generateMockCollections(20);
    }
    return Array.isArray(apiCollections) ? apiCollections : [];
  }, [isDemoMode, apiCollections]);

  return (
    <DashboardLayout title="Collections">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Collections</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Record Collection
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Collection Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : collections.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Building</TableHead>
                      <TableHead className="text-xs">Landlord</TableHead>
                      <TableHead className="text-xs">Charge Type</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Collected Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection: any) => (
                      <TableRow key={collection.id}>
                        <TableCell className="font-medium text-xs">
                          {collection.tenantName || collection.tenant?.name || `Tenant ${collection.id}`}
                        </TableCell>
                        <TableCell className="text-xs">
                          Building #{collection.buildingId || collection.building?.id || collection.id}
                        </TableCell>
                        <TableCell className="text-xs">
                          Landlord #{collection.landlordId || collection.landlord?.id || '-'}
                        </TableCell>
                        <TableCell className="text-xs">{collection.chargeType || collection.type || '-'}</TableCell>
                        <TableCell className="text-xs font-semibold">${collection.amount || 0}</TableCell>
                        <TableCell className="text-xs">
                          {collection.collectedDate || collection.date ? new Date(collection.collectedDate || collection.date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={collection.status === 'Collected' || collection.status === 'collected' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {collection.status || 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No collections found</p>
                <p className="text-xs mt-1.5">Collection records will appear here once payments are recorded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Collections;
