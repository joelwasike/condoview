import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Wallet, Plus, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Cashier = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const accounts = useMemo(() => {
    if (isDemoMode) {
      return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Cashier Account ${i + 1}`,
        accountNumber: `ACC-${String(i + 1).padStart(4, '0')}`,
        balance: Math.floor(Math.random() * 50000) + 10000,
        transactionCount: Math.floor(Math.random() * 50) + 10,
        lastTransaction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Cashier">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cashier Management</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Account
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="w-4 h-4" />
              Cashier Accounts & Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && accounts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Account Name</TableHead>
                      <TableHead className="text-xs">Account Number</TableHead>
                      <TableHead className="text-xs">Balance</TableHead>
                      <TableHead className="text-xs">Transactions</TableHead>
                      <TableHead className="text-xs">Last Transaction</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account: any) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium text-xs">{account.name}</TableCell>
                        <TableCell className="text-xs">{account.accountNumber}</TableCell>
                        <TableCell className="text-xs font-semibold">${account.balance.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{account.transactionCount}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(account.lastTransaction).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Wallet className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Cashier management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Manage cashier accounts, record transactions, and track balances</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Cashier;
