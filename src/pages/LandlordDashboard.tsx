import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { landlordService } from '@/services/landlord';
import { useToast } from '@/hooks/use-toast';

const LandlordDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await landlordService.getOverview();
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
      <DashboardLayout title="Landlord Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Landlord Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Properties"
            value={overview?.totalProperties || 0}
            subtitle="Properties managed"
            variant="primary"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${overview?.monthlyRevenue || 0}`}
            subtitle="Current month"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${overview?.occupancyRate || 0}%`}
            subtitle="Properties occupied"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandlordDashboard;

