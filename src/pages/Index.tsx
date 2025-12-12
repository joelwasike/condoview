import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { agencyDirectorService } from "@/services/agencyDirectorService";
import { salesManagerService } from "@/services/salesManagerService";
import { commercialService } from "@/services/commercialService";
import { adminService } from "@/services/adminService";
import { accountingService } from "@/services/accountingService";
import { technicianService } from "@/services/technicianService";
import { landlordService } from "@/services/landlordService";
import { tenantService } from "@/services/tenantService";
import { superAdminService } from "@/services/superAdminService";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMockOverviewData } from "@/utils/mockData";
import SalesManagerOverview from "./sales-manager/Overview";
import CommercialOverview from "./commercial/Overview";
import AdministrativeOverview from "./administrative/Overview";
import AccountingOverview from "./accounting/Overview";
import TechnicianOverview from "./technician/Overview";
import LandlordOverview from "./landlord/Overview";
import TenantOverview from "./tenant/Overview";
import SuperAdminOverview from "./super-admin/Overview";

const Index = () => {
  // Get user role
  const userRole = useMemo(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.role : null;
    } catch {
      return null;
    }
  }, []);

  // Route to appropriate overview based on role
  if (userRole === 'salesmanager') {
    return <SalesManagerOverview />;
  }

  if (userRole === 'commercial') {
    return <CommercialOverview />;
  }

  if (userRole === 'admin') {
    return <AdministrativeOverview />;
  }

  if (userRole === 'accounting') {
    return <AccountingOverview />;
  }

  if (userRole === 'technician') {
    return <TechnicianOverview />;
  }

  if (userRole === 'landlord') {
    return <LandlordOverview />;
  }

  if (userRole === 'tenant') {
    return <TenantOverview />;
  }

  if (userRole === 'superadmin') {
    return <SuperAdminOverview />;
  }

  // Check if in demo mode
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  // Default to Agency Director Overview
  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['agency-director-overview'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(generateMockOverviewData('agency_director'));
      }
      return agencyDirectorService.getOverview();
    },
    retry: 1,
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['agency-director-properties'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Property ${i + 1}`,
          status: ['For Sale', 'For Rent', 'Available'][Math.floor(Math.random() * 3)],
        })));
      }
      return agencyDirectorService.getProperties();
    },
    retry: 1,
  });

  const { data: usersData } = useQuery({
    queryKey: ['agency-director-users'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve(Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: ['admin', 'accounting', 'technician'][Math.floor(Math.random() * 3)],
        })));
      }
      return agencyDirectorService.getUsers();
    },
    retry: 1,
  });

  // Calculate stats from data
  const totalProperties = propertiesData?.length || 0;
  const totalUsers = usersData?.length || 0;
  const propertiesForSale = propertiesData?.filter((p: any) => p.status === 'For Sale' || p.status === 'Available').length || 0;
  const propertiesForRent = propertiesData?.filter((p: any) => p.status === 'For Rent' || p.status === 'Rented').length || 0;

  // Use overview data if available, otherwise use calculated values
  const displayData = overviewData || {
    totalProperties,
    totalUsers,
    propertiesForSale,
    propertiesForRent,
    totalRevenue: overviewData?.totalRevenue || 0,
    totalExpenses: overviewData?.totalExpenses || 0,
  };

  if (error) {
    console.error('Error loading overview:', error);
  }

  return (
    <DashboardLayout title="Agency Director Dashboard">
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
              subtitle="All properties in system"
              variant="primary"
            />
            <StatCard
              title="System Users"
              value={displayData.totalUsers?.toLocaleString() || totalUsers.toLocaleString()}
              subtitle="Active users"
            />
            <StatCard
              title="Properties Available"
              value={propertiesForSale.toLocaleString()}
              subtitle={`${propertiesForRent} rented`}
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

export default Index;
