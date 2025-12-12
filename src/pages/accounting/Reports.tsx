import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Receipt, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Reports = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const reports = useMemo(() => {
    if (isDemoMode) {
      return [
        { id: 1, name: 'Monthly Payments Report', type: 'Payments by Period', period: 'January 2024', generated: new Date().toISOString() },
        { id: 2, name: 'Commissions Report', type: 'Commissions', period: 'Q1 2024', generated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 3, name: 'Expenses Summary', type: 'Expenses', period: 'January 2024', generated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 4, name: 'Collections Report', type: 'Collections', period: 'January 2024', generated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 5, name: 'Building Performance', type: 'Building Performance', period: '2024', generated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      ];
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="w-4 h-4" />
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && reports.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Report Name</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Period</TableHead>
                      <TableHead className="text-xs">Generated</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium text-xs">{report.name}</TableCell>
                        <TableCell className="text-xs">{report.type}</TableCell>
                        <TableCell className="text-xs">{report.period}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(report.generated).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Receipt className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Financial reporting functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Generate comprehensive reports: payments by period, commissions, expenses, collections, building performance, and more</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
