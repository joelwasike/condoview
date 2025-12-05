import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";

const Index = () => {
  return (
    <DashboardLayout title="Property Dashboard">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Stats and Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Properties"
              value="$4,562"
              subtitle="431 more to break last month record"
              variant="primary"
            />
            <StatCard
              title="Properties for Sale"
              value="$2,356"
              subtitle="Target 3k/month"
            />
            <StatCard
              title="Properties for Rent"
              value="$2,206"
              subtitle="Target 3k/month"
            />
          </div>

          {/* Overview Chart */}
          <OverviewChart />

          {/* Revenue Chart */}
          <RevenueChart />
        </div>

        {/* Right Column - Donut Chart and Property Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PropertyDonut />
          <PropertyCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
