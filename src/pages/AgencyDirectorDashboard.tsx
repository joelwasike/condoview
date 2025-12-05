import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { agencyDirectorService } from '@/services/agencyDirector';
import { useToast } from '@/hooks/use-toast';

const AgencyDirectorDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await agencyDirectorService.getOverview();
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
      <DashboardLayout title="Agency Director Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Agency Director Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            subtitle="System users"
            variant="primary"
          />
          <StatCard
            title="Total Properties"
            value={overview?.totalProperties || 0}
            subtitle="Properties managed"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${overview?.monthlyRevenue || 0}`}
            subtitle="Current month"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgencyDirectorDashboard;

