import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockRequests } from "@/utils/mockData";
import { commercialService } from "@/services/commercialService";

const Requests = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiRequests, isLoading } = useQuery({
    queryKey: ['commercial-requests'],
    queryFn: () => commercialService.listRequests(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const requests = useMemo(() => {
    if (isDemoMode) {
      return generateMockRequests(10);
    }
    return Array.isArray(apiRequests) ? apiRequests : [];
  }, [isDemoMode, apiRequests]);

  return (
    <DashboardLayout title="Visit Requests">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="w-4 h-4" />
              Visit Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Client</TableHead>
                      <TableHead className="text-xs">Property ID</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Requested Date</TableHead>
                      <TableHead className="text-xs">Message</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-xs">{request.type || 'Visit Request'}</TableCell>
                        <TableCell className="font-medium text-xs">
                          {request.clientName || request.client?.name || `Client ${request.id}`}
                        </TableCell>
                        <TableCell className="text-xs">#{request.propertyId || request.property?.id || request.id}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={request.status === 'Approved' || request.status === 'approved' ? 'default' : request.status === 'Pending' || request.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {request.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {request.requestedDate || request.createdAt ? new Date(request.requestedDate || request.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-xs">{request.message || request.note || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {(request.status === 'Pending' || request.status === 'pending' || !request.status) && (
                              <>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600">
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No visit requests found</p>
                <p className="text-xs mt-1.5">Visit requests from clients will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Requests;
