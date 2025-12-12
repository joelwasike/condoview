import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { technicianService } from "@/services/technicianService";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode, useMockData } from "@/hooks/useDemoData";

const Overview = () => {
  const isDemoMode = useDemoMode();
  const mockData = useMockData('technician');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['technician-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(mockData);
      }
      return technicianService.getOverview();
    },
    retry: 1,
    enabled: !isDemoMode || !!mockData,
  });

  const { data: inspectionsData } = useQuery({
    queryKey: ['technician-inspections'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, type: 'Move-in' })));
      }
      return technicianService.listInspections();
    },
    retry: 1,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['technician-tasks'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, status: 'In Progress' })));
      }
      return technicianService.listTasks();
    },
    retry: 1,
  });

  const { data: maintenanceRequestsData } = useQuery({
    queryKey: ['technician-maintenance-requests'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 5 }, (_, i) => ({ id: i + 1, status: 'Pending' })));
      }
      return technicianService.listMaintenanceRequests();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalInspections = Array.isArray(inspectionsData) ? inspectionsData.length : 0;
  const totalTasks = Array.isArray(tasksData) ? tasksData.length : 0;
  const pendingRequests = Array.isArray(maintenanceRequestsData) 
    ? maintenanceRequestsData.filter((r: any) => r.status === 'Pending' || r.status === 'pending').length 
    : 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalInspections,
    totalTasks,
    pendingRequests,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Technician Dashboard">
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
              title="Total Inspections"
              value={displayData.totalInspections?.toLocaleString() || totalInspections.toLocaleString()}
              subtitle="Property inspections completed"
              variant="primary"
            />
            <StatCard
              title="Active Tasks"
              value={displayData.totalTasks?.toLocaleString() || totalTasks.toLocaleString()}
              subtitle="Maintenance tasks assigned"
            />
            <StatCard
              title="Pending Requests"
              value={displayData.pendingRequests?.toLocaleString() || pendingRequests.toLocaleString()}
              subtitle="Maintenance requests awaiting action"
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
