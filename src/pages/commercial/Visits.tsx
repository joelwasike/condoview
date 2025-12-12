import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockVisits } from "@/utils/mockData";
import { commercialService } from "@/services/commercialService";

const Visits = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiVisits, isLoading } = useQuery({
    queryKey: ['commercial-visits'],
    queryFn: () => commercialService.listVisits(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const visits = useMemo(() => {
    if (isDemoMode) {
      return generateMockVisits(12);
    }
    // Handle both array and object responses
    if (Array.isArray(apiVisits)) {
      return apiVisits;
    }
    if (apiVisits && typeof apiVisits === 'object') {
      return apiVisits.all || apiVisits.upcoming || [];
    }
    return [];
  }, [isDemoMode, apiVisits]);

  return (
    <DashboardLayout title="Visits">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scheduled Visits</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Schedule Visit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Visit Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : visits.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Client</TableHead>
                      <TableHead className="text-xs">Scheduled Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.map((visit: any) => (
                      <TableRow key={visit.id}>
                        <TableCell className="font-medium text-xs">
                          {visit.propertyAddress || visit.property?.address || `Property #${visit.propertyId || visit.id}`}
                        </TableCell>
                        <TableCell className="text-xs">
                          {visit.clientName || visit.client?.name || visit.clientName || '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {visit.scheduledDate || visit.date ? new Date(visit.scheduledDate || visit.date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={visit.status === 'Completed' || visit.status === 'completed' ? 'default' : visit.status === 'Scheduled' || visit.status === 'scheduled' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {visit.status || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{visit.notes || visit.note || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No visits scheduled</p>
                <p className="text-xs mt-1.5">Schedule your first property visit to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Visits;
