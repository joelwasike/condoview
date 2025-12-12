import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const inventory = useMemo(() => {
    if (isDemoMode) {
      const items = ['Furniture', 'Appliances', 'Electronics', 'Tools', 'Cleaning Supplies'];
      return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `${items[Math.floor(Math.random() * items.length)]} ${i + 1}`,
        propertyId: Math.floor(Math.random() * 5) + 1,
        quantity: Math.floor(Math.random() * 10) + 1,
        condition: ['Good', 'Fair', 'Needs Repair'][Math.floor(Math.random() * 3)],
        location: `Room ${Math.floor(Math.random() * 5) + 1}`,
      }));
    }
    return [];
  }, [isDemoMode]);

  return (
    <DashboardLayout title="Inventory">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Inventory</h2>
          <Button className="gap-1.5 text-xs" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="w-4 h-4" />
              Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoMode && inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Item Name</TableHead>
                      <TableHead className="text-xs">Property</TableHead>
                      <TableHead className="text-xs">Location</TableHead>
                      <TableHead className="text-xs">Quantity</TableHead>
                      <TableHead className="text-xs">Condition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs">{item.name}</TableCell>
                        <TableCell className="text-xs">Property #{item.propertyId}</TableCell>
                        <TableCell className="text-xs">{item.location}</TableCell>
                        <TableCell className="text-xs">{item.quantity}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.condition === 'Good' ? 'default' : item.condition === 'Fair' ? 'secondary' : 'destructive'}
                            className="text-[10px]"
                          >
                            {item.condition}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Inventory management functionality will be implemented here</p>
                <p className="text-xs mt-1.5">Track and manage property inventory items</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
