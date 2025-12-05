import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { superAdminService } from '@/services/superAdmin';
import { useToast } from '@/hooks/use-toast';

const SuperAdminDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await superAdminService.getOverview();
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
      <DashboardLayout title="Super Admin Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Super Admin Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Companies"
            value={overview?.totalCompanies || 0}
            subtitle="Registered agencies"
            variant="primary"
          />
          <StatCard
            title="Active Subscriptions"
            value={overview?.activeSubscriptions || 0}
            subtitle="Current subscriptions"
          />
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            subtitle="System users"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;

