import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { tenantService } from '@/services/tenant';
import { useToast } from '@/hooks/use-toast';

const TenantDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await tenantService.getOverview();
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
      <DashboardLayout title="Tenant Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tenant Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Outstanding Balance"
            value={`$${overview?.outstandingBalance || 0}`}
            subtitle="Total amount due"
            variant="primary"
          />
          <StatCard
            title="Next Payment"
            value={`$${overview?.nextPayment?.amount || 0}`}
            subtitle={overview?.nextPayment?.dueDate || 'No upcoming payments'}
          />
          <StatCard
            title="Maintenance Requests"
            value={overview?.maintenanceRequests || 0}
            subtitle="Active requests"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;

