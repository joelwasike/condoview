import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { accountingService } from "@/services/accountingService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('accounting');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['accounting-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return accountingService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: monthlySummary } = useQuery({
    queryKey: ['accounting-monthly-summary'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve({ total: 125000, expenses: 45000, net: 80000 });
      }
      return accountingService.getMonthlySummary();
    },
    retry: 1,
  });

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Accounting Dashboard">
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
              title="Total Collections"
              value={overviewData?.totalCollections?.toLocaleString() || '0'}
              subtitle="This month"
              variant="primary"
            />
            <StatCard
              title="Total Expenses"
              value={overviewData?.totalExpenses?.toLocaleString() || '0'}
              subtitle="This month"
            />
            <StatCard
              title="Net Balance"
              value={overviewData?.netBalance?.toLocaleString() || '0'}
              subtitle="Current balance"
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
