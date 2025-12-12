import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { landlordService } from "@/services/landlordService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('landlord');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['landlord-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return landlordService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['landlord-properties'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Property ${i + 1}` })));
      }
      return landlordService.getProperties();
    },
    retry: 1,
  });

  const { data: tenantsData } = useQuery({
    queryKey: ['landlord-tenants'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Tenant ${i + 1}` })));
      }
      return landlordService.getTenants();
    },
    retry: 1,
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['landlord-payments'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, amount: 1000 })));
      }
      return landlordService.getPayments();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalProperties = Array.isArray(propertiesData) ? propertiesData.length : 0;
  const totalTenants = Array.isArray(tenantsData) ? tenantsData.length : 0;
  const totalPayments = Array.isArray(paymentsData) ? paymentsData.length : 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalProperties,
    totalTenants,
    totalPayments,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Landlord Dashboard">
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
              subtitle="Properties managed"
              variant="primary"
            />
            <StatCard
              title="Total Tenants"
              value={displayData.totalTenants?.toLocaleString() || totalTenants.toLocaleString()}
              subtitle="Active tenants"
            />
            <StatCard
              title="Total Payments"
              value={displayData.totalPayments?.toLocaleString() || totalPayments.toLocaleString()}
              subtitle="Payment transactions"
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
