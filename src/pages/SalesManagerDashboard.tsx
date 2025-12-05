import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { salesManagerService } from '@/services/salesManager';
import { useToast } from '@/hooks/use-toast';

const SalesManagerDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await salesManagerService.getOverview();
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
      <DashboardLayout title="Sales Manager Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sales Manager Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Properties"
            value={overview?.totalProperties || 0}
            subtitle="Properties managed"
            variant="primary"
          />
          <StatCard
            title="Total Clients"
            value={overview?.totalClients || 0}
            subtitle="Active clients"
          />
          <StatCard
            title="Active Alerts"
            value={overview?.activeAlerts || 0}
            subtitle="Requires attention"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesManagerDashboard;

