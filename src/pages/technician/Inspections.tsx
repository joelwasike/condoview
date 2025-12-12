import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CheckCircle, Plus, Upload, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockInspections } from "@/utils/mockData";

const Inspections = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const inspections = useMemo(() => {
    if (isDemoMode) {
      return generateMockInspections(10);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Inspections">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Property Inspections</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Create Inspection
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="w-4 h-4" />
              Inspection Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && inspections.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Tenant</TableHead>
                      <TableHead className="text-xs">Scheduled Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Notes</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="text-xs">{inspection.type}</TableCell>
                        <TableCell className="text-xs">Property #{inspection.propertyId}</TableCell>
                        <TableCell className="text-xs">{inspection.tenantName}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(inspection.scheduledDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={inspection.status === 'Completed' ? 'default' : inspection.status === 'Scheduled' ? 'secondary' : 'outline'}
                            className="text-[10px]"
                          >
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{inspection.notes || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Camera className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Upload className="w-3.5 h-3.5" />
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
                <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Inspection management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Create move-in/move-out inspections, upload photos, and track inspection status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inspections;
