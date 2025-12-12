import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { adminService } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('admin');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return adminService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: inboxData } = useQuery({
    queryKey: ['admin-inbox'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve({ items: Array.from({ length: 10 }, (_, i) => ({ id: i + 1 })) });
      }
      return adminService.getInbox();
    },
    retry: 1,
  });

  const { data: documentsData } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 15 }, (_, i) => ({ id: i + 1, status: 'Pending' })));
      }
      return adminService.getDocuments();
    },
    retry: 1,
  });

  const { data: debtsData } = useQuery({
    queryKey: ['admin-debts'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve({ items: Array.from({ length: 8 }, (_, i) => ({ id: i + 1 })) });
      }
      return adminService.getDebts();
    },
    retry: 1,
  });

  // Calculate stats from data
  const inboxCount = inboxData?.items?.length || inboxData?.length || 0;
  const documentsCount = Array.isArray(documentsData) ? documentsData.length : 0;
  const debtsCount = debtsData?.items?.length || debtsData?.length || 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    inboxCount,
    documentsCount,
    debtsCount,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Administrative Dashboard">
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
              title="Inbox Items"
              value={displayData.inboxCount?.toLocaleString() || inboxCount.toLocaleString()}
              subtitle="Pending items in inbox"
              variant="primary"
            />
            <StatCard
              title="Documents"
              value={displayData.documentsCount?.toLocaleString() || documentsCount.toLocaleString()}
              subtitle="Total documents"
            />
            <StatCard
              title="Debts"
              value={displayData.debtsCount?.toLocaleString() || debtsCount.toLocaleString()}
              subtitle="Outstanding debts"
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
