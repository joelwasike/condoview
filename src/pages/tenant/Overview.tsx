import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { tenantService } from "@/services/tenantService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('tenant');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['tenant-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return tenantService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          amount: Math.floor(Math.random() * 1000) + 500,
          status: 'Paid',
        })));
      }
      return tenantService.listPayments();
    },
    retry: 1,
  });

  const { data: maintenanceData } = useQuery({
    queryKey: ['tenant-maintenance'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          title: `Maintenance Request ${i + 1}`,
          status: ['Pending', 'In Progress'][Math.floor(Math.random() * 2)],
        })));
      }
      return tenantService.listMaintenance();
    },
    retry: 1,
  });

  const { data: leaseData } = useQuery({
    queryKey: ['tenant-lease'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve({
          id: 1,
          property: 'Demo Property',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      return tenantService.getLeaseInfo();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalPayments = Array.isArray(paymentsData) ? paymentsData.length : 0;
  const pendingMaintenance = Array.isArray(maintenanceData) 
    ? maintenanceData.filter((m: any) => m.status === 'Pending' || m.status === 'pending').length 
    : 0;
  const hasActiveLease = leaseData ? true : false;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalPayments,
    pendingMaintenance,
    hasActiveLease,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Tenant Dashboard">
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
              title="Total Payments"
              value={displayData.totalPayments?.toLocaleString() || totalPayments.toLocaleString()}
              subtitle="Payment transactions"
              variant="primary"
            />
            <StatCard
              title="Pending Maintenance"
              value={displayData.pendingMaintenance?.toLocaleString() || pendingMaintenance.toLocaleString()}
              subtitle="Maintenance requests"
            />
            <StatCard
              title="Lease Status"
              value={hasActiveLease ? "Active" : "None"}
              subtitle="Current lease status"
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
