import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockDocuments } from "@/utils/mockData";

const Documents = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const documents = useMemo(() => {
    if (isDemoMode) {
      return generateMockDocuments(12);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="gap-1.5 text-xs" size="sm">
            <Upload className="w-3.5 h-3.5" />
            Upload Document
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Document Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && documents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Size</TableHead>
                      <TableHead className="text-xs">Uploaded</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium text-xs">{doc.name}</TableCell>
                        <TableCell className="text-xs">{doc.type}</TableCell>
                        <TableCell className="text-xs">{doc.size}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={doc.status === 'Approved' ? 'default' : doc.status === 'Pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Document management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Upload KYC documents, contracts, and manage property documents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
