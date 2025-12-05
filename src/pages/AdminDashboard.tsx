import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { adminService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await adminService.getOverview();
      setOverview(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Pending Documents"
            value={overview?.pendingDocuments || 0}
            subtitle="Awaiting review"
            variant="primary"
          />
          <StatCard
            title="Active Reminders"
            value={overview?.activeReminders || 0}
            subtitle="Scheduled reminders"
          />
          <StatCard
            title="Inbox Items"
            value={overview?.inboxItems || 0}
            subtitle="Unread messages"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

