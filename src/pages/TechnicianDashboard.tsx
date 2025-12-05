import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { technicianService } from '@/services/technician';
import { useToast } from '@/hooks/use-toast';

const TechnicianDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await technicianService.getOverview();
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
      <DashboardLayout title="Technician Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Technician Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Tasks"
            value={overview?.activeTasks || 0}
            subtitle="In progress"
            variant="primary"
          />
          <StatCard
            title="Pending Quotes"
            value={overview?.pendingQuotes || 0}
            subtitle="Awaiting submission"
          />
          <StatCard
            title="Maintenance Requests"
            value={overview?.maintenanceRequests || 0}
            subtitle="Open requests"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;

