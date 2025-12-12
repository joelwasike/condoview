import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Mail, Forward } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockInbox } from "@/utils/mockData";
import { adminService } from "@/services/adminService";

const Inbox = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  const { data: apiInbox, isLoading } = useQuery({
    queryKey: ['admin-inbox'],
    queryFn: () => adminService.getInbox(),
    enabled: !isDemoMode,
    retry: 1,
  });

  const inboxItems = useMemo(() => {
    if (isDemoMode) {
      return generateMockInbox(15);
    }
    return Array.isArray(apiInbox) ? apiInbox : [];
  }, [isDemoMode, apiInbox]);

  return (
    <DashboardLayout title="Inbox">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="w-4 h-4" />
              Inbox Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !isDemoMode ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : inboxItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">From</TableHead>
                      <TableHead className="text-xs">Subject</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboxItems.map((item: any) => (
                      <TableRow key={item.id} className={item.status === 'Unread' || item.read === false ? 'bg-muted/30' : ''}>
                        <TableCell className="text-xs">{item.type || item.documentType || 'Document'}</TableCell>
                        <TableCell className="text-xs">{item.from || item.sender || '-'}</TableCell>
                        <TableCell className="font-medium text-xs">{item.subject || item.title || '-'}</TableCell>
                        <TableCell className="text-xs">
                          {item.date || item.createdAt ? new Date(item.date || item.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {item.priority === 'High' || item.priority === 'high' && (
                            <Badge variant="destructive" className="text-[10px]">High</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.status === 'Unread' || item.read === false ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {item.status || (item.read === false ? 'Unread' : 'Read')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Forward className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Mail className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No inbox items found</p>
                <p className="text-xs mt-1.5">Incoming documents and requests will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
