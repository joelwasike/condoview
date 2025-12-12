import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { commercialService } from "@/services/commercialService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('commercial');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['commercial-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return commercialService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: listingsData } = useQuery({
    queryKey: ['commercial-listings'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Listing ${i + 1}`,
          status: 'Active',
        })));
      }
      return commercialService.listListings();
    },
    retry: 1,
  });

  const { data: visitsData } = useQuery({
    queryKey: ['commercial-visits'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          property: `Property ${i + 1}`,
          date: new Date().toISOString(),
        })));
      }
      return commercialService.listVisits();
    },
    retry: 1,
  });

  const { data: requestsData } = useQuery({
    queryKey: ['commercial-requests'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          status: ['Pending', 'Approved'][Math.floor(Math.random() * 2)],
        })));
      }
      return commercialService.listRequests();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalListings = listingsData?.length || 0;
  const totalVisits = visitsData?.length || 0;
  const pendingRequests = requestsData?.filter((r: any) => r.status === 'Pending' || r.status === 'pending').length || 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalListings,
    totalVisits,
    pendingRequests,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Commercial Dashboard">
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
              title="Total Listings"
              value={displayData.totalListings?.toLocaleString() || totalListings.toLocaleString()}
              subtitle="Active property listings"
              variant="primary"
            />
            <StatCard
              title="Total Visits"
              value={displayData.totalVisits?.toLocaleString() || totalVisits.toLocaleString()}
              subtitle="Scheduled visits"
            />
            <StatCard
              title="Pending Requests"
              value={displayData.pendingRequests?.toLocaleString() || pendingRequests.toLocaleString()}
              subtitle="Visit requests"
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
