import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Receipt, Download, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateMockTransactions } from "@/utils/mockData";

const Transactions = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const transactions = useMemo(() => {
    if (isDemoMode) {
      return generateMockTransactions(30);
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Transaction History">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="w-4 h-4" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Transaction ID</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Company</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium text-xs">{transaction.transactionId}</TableCell>
                        <TableCell className="text-xs">{transaction.type}</TableCell>
                        <TableCell className="text-xs">{transaction.companyName}</TableCell>
                        <TableCell className="text-xs font-semibold">${transaction.amount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.status === 'Completed' ? 'default' : transaction.status === 'Pending' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {transaction.status}
                          </Badge>
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
                <p className="text-sm">Transaction history functionality will be implemented here</p>
                <p className="text-xs mt-1.5">View subscription transactions, payment history, and financial records</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
