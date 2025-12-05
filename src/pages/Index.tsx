import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PropertyDonut from "@/components/dashboard/PropertyDonut";
import PropertyCard from "@/components/dashboard/PropertyCard";

const Index = () => {
  return (
    <DashboardLayout title="Property Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Properties"
            value="4,562"
            subtitle="431 more to break last month record"
            variant="primary"
            trend="+12.5%"
          />
          <StatCard
            title="Properties for Sale"
            value="2,356"
            subtitle="Target 3k/month"
            trend="+8.3%"
          />
          <StatCard
            title="Properties for Rent"
            value="2,206"
            subtitle="Target 3k/month"
            trend="+5.7%"
          />
        </div>

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
