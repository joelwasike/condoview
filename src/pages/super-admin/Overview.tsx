import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { superAdminService } from "@/services/superAdminService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('superadmin');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['super-admin-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return superAdminService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: companiesData } = useQuery({
    queryKey: ['super-admin-companies'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          name: `Company ${i + 1}`,
          status: 'Active',
        })));
      }
      return superAdminService.getCompanies();
    },
    retry: 1,
  });

  const { data: subscriptionsData } = useQuery({
    queryKey: ['super-admin-subscriptions'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          company: `Company ${i + 1}`,
          amount: Math.floor(Math.random() * 5000) + 1000,
          paymentStatus: ['paid', 'pending'][Math.floor(Math.random() * 2)],
          accountStatus: 'active',
        })));
      }
      return superAdminService.getSubscriptions();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalCompanies = Array.isArray(companiesData) ? companiesData.length : 0;
  const totalSubscriptions = Array.isArray(subscriptionsData) ? subscriptionsData.length : 0;
  const activeSubscriptions = Array.isArray(subscriptionsData) 
    ? subscriptionsData.filter((s: any) => s.accountStatus === 'active' || s.paymentStatus === 'paid').length 
    : 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalCompanies,
    totalSubscriptions,
    activeSubscriptions,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Super Admin Dashboard">
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
              title="Total Companies"
              value={displayData.totalCompanies?.toLocaleString() || totalCompanies.toLocaleString()}
              subtitle="Agencies registered"
              variant="primary"
            />
            <StatCard
              title="Total Subscriptions"
              value={displayData.totalSubscriptions?.toLocaleString() || totalSubscriptions.toLocaleString()}
              subtitle="Subscription transactions"
            />
            <StatCard
              title="Active Subscriptions"
              value={displayData.activeSubscriptions?.toLocaleString() || activeSubscriptions.toLocaleString()}
              subtitle="Active agency subscriptions"
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
