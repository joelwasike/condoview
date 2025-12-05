import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { accountingService } from '@/services/accounting';
import { useToast } from '@/hooks/use-toast';

const AccountingDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await accountingService.getOverview();
      setOverview(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Accounting Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Accounting Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${overview?.totalRevenue || 0}`}
            subtitle="All time revenue"
            variant="primary"
          />
          <StatCard
            title="Pending Payments"
            value={overview?.pendingPayments || 0}
            subtitle="Awaiting approval"
          />
          <StatCard
            title="Total Expenses"
            value={`$${overview?.totalExpenses || 0}`}
            subtitle="Current period"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountingDashboard;

