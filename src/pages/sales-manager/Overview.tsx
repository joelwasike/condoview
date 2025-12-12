import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { salesManagerService } from "@/services/salesManagerService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('salesmanager');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['sales-manager-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return salesManagerService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['sales-manager-properties'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          name: `Property ${i + 1}`,
          status: 'Occupied',
        })));
      }
      return salesManagerService.getProperties();
    },
    retry: 1,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['sales-manager-clients'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Client ${i + 1}`,
          email: `client${i + 1}@example.com`,
        })));
      }
      return salesManagerService.getClients();
    },
    retry: 1,
  });

  const { data: alertsData } = useQuery({
    queryKey: ['sales-manager-alerts'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          message: `Alert ${i + 1}`,
          status: ['Active', 'Pending'][Math.floor(Math.random() * 2)],
        })));
      }
      return salesManagerService.getAlerts();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalProperties = propertiesData?.length || 0;
  const totalClients = clientsData?.length || 0;
  const activeAlerts = alertsData?.filter((a: any) => a.status === 'Active' || a.status === 'Pending').length || 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalProperties,
    totalClients,
    activeAlerts,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Sales Manager Dashboard">
      <div className="space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Properties"
              value={displayData.totalProperties?.toLocaleString() || totalProperties.toLocaleString()}
              subtitle="All properties"
              variant="primary"
            />
            <StatCard
              title="Total Clients"
              value={displayData.totalClients?.toLocaleString() || totalClients.toLocaleString()}
              subtitle="Active clients"
            />
            <StatCard
              title="Active Alerts"
              value={displayData.activeAlerts?.toLocaleString() || activeAlerts.toLocaleString()}
              subtitle="Requires attention"
            />
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <OverviewChart />
            <RevenueChart />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <PropertyDonut />
            <PropertyCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
