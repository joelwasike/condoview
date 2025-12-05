import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { commercialService } from '@/services/commercial';
import { useToast } from '@/hooks/use-toast';

const CommercialDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await commercialService.getOverview();
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
      <DashboardLayout title="Commercial Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Commercial Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Listings"
            value={overview?.activeListings || 0}
            subtitle="Properties listed"
            variant="primary"
          />
          <StatCard
            title="Scheduled Visits"
            value={overview?.scheduledVisits || 0}
            subtitle="Upcoming visits"
          />
          <StatCard
            title="Interested Clients"
            value={overview?.interestedClients || 0}
            subtitle="Potential clients"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommercialDashboard;

