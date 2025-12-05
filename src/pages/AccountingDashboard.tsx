import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { accountingService } from '@/services/accounting';
import { messagingService } from '@/services/messaging';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import {
  DollarSign,
  TrendingUp,
  Building,
  CreditCard,
  Receipt,
  FileText,
  User,
  Wallet,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Check,
  X,
  Download,
  Send,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const AccountingDashboard = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [tenantPayments, setTenantPayments] = useState<any[]>([]);
  const [landlordPayments, setLandlordPayments] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [landlords, setLandlords] = useState<any[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<any>(null);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLandlordPaymentModal, setShowLandlordPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Forms
  const [paymentForm, setPaymentForm] = useState({
    tenant: '',
    property: '',
    amount: '',
    method: '',
    reference: '',
    chargeType: 'rent',
  });
  const [landlordPaymentForm, setLandlordPaymentForm] = useState({
    landlord: '',
    building: '',
    amount: '',
    method: '',
    reference: '',
  });
  const [expenseForm, setExpenseForm] = useState({
    building: '',
    category: '',
    amount: '',
    description: '',
    date: '',
  });

  // Filters
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [expenseBuildingFilter, setExpenseBuildingFilter] = useState('');
  const [depositFilter, setDepositFilter] = useState('all');

  // Reports
  const [reportStartDate, setReportStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });
  const [reportEndDate, setReportEndDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [reportData, setReportData] = useState<any>(null);

  // Messaging
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const isLoadingUsersRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        overview,
        tenantPaymentsData,
        landlordPaymentsData,
        collectionsData,
        expensesData,
        summary,
        landlordsData,
      ] = await Promise.all([
        accountingService.getOverview().catch(() => null),
        accountingService.getTenantPayments({ status: paymentStatusFilter || undefined }).catch(() => []),
        accountingService.getLandlordPayments().catch(() => []),
        accountingService.getCollections().catch(() => []),
        accountingService
          .getExpenses({
            building: expenseBuildingFilter || undefined,
          })
          .catch(() => []),
        accountingService.getMonthlySummary().catch(() => null),
        accountingService.getLandlords().catch(() => []),
      ]);

      setOverviewData(overview);
      setTenantPayments(Array.isArray(tenantPaymentsData) ? tenantPaymentsData : []);
      setLandlordPayments(Array.isArray(landlordPaymentsData) ? landlordPaymentsData : []);
      setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setMonthlySummary(summary);
      setLandlords(Array.isArray(landlordsData) ? landlordsData : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [paymentStatusFilter, expenseBuildingFilter, toast]);

  const loadTenants = useCallback(async () => {
    try {
      const data = await accountingService.getTenantsWithPaymentStatus();
      setTenants(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load tenants',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const loadDeposits = useCallback(async () => {
    try {
      const filters: any = {};
      if (depositFilter !== 'all') {
        filters.type = depositFilter;
      }
      const data = await accountingService.getSecurityDeposits(filters);
      setDeposits(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load deposits',
        variant: 'destructive',
      });
    }
  }, [depositFilter, toast]);

  const loadAdvertisements = useCallback(async () => {
    try {
      const ads = await accountingService.getAdvertisements();
      setAdvertisements(Array.isArray(ads) ? ads : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load advertisements',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const loadUsers = useCallback(async () => {
    if (isLoadingUsersRef.current) return;
    try {
      isLoadingUsersRef.current = true;
      const users = await messagingService.getUsers();
      let usersArray: any[] = [];
      if (Array.isArray(users)) {
        usersArray = users;
      } else if (users && Array.isArray((users as any).users)) {
        usersArray = (users as any).users;
      }

      const storedUser = localStorage.getItem('user');
      let currentUserId = null;
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          currentUserId = user.id || user.ID;
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      const chatUsersList = usersArray
        .filter((u) => {
          const userId = u.id || u.ID;
          return userId && String(userId) !== String(currentUserId);
        })
        .map((u) => ({
          userId: u.id || u.ID,
          name: u.name || u.Name || 'User',
          email: u.email || u.Email || '',
          role: u.role || u.Role || '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setChatUsers(chatUsersList);
      if (chatUsersList.length > 0 && !selectedUserId) {
        setSelectedUserId(chatUsersList[0].userId);
        loadChatForUser(chatUsersList[0].userId);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      isLoadingUsersRef.current = false;
    }
  }, [selectedUserId, toast]);

  const loadChatForUser = useCallback(
    async (userId: string) => {
      if (!userId) return;
      try {
        setSelectedUserId(userId);
        const messages = await messagingService.getConversation(userId);
        setChatMessages(Array.isArray(messages) ? messages : []);
        try {
          await messagingService.markMessagesAsRead(userId);
        } catch (e) {
          console.error('Error marking messages as read:', e);
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load conversation',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'tenants') {
      loadTenants();
    }
  }, [activeTab, loadTenants]);

  useEffect(() => {
    if (activeTab === 'deposits') {
      loadDeposits();
    }
  }, [activeTab, depositFilter, loadDeposits]);

  useEffect(() => {
    if (activeTab === 'advertisements' || activeTab === 'overview') {
      loadAdvertisements();
    }
  }, [activeTab, loadAdvertisements]);

  useEffect(() => {
    if (activeTab === 'chat') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  const handleApprovePayment = async (paymentId: string) => {
    try {
      await accountingService.approveTenantPayment(paymentId);
      toast({
        title: 'Success',
        description: 'Payment approved successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve payment',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateReceipt = async (paymentId: string) => {
    try {
      await accountingService.generateReceipt(paymentId);
      toast({
        title: 'Success',
        description: 'Receipt generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate receipt',
        variant: 'destructive',
      });
    }
  };

  const handleTransferToLandlord = async (paymentId: string) => {
    try {
      await accountingService.transferToLandlord(paymentId);
      toast({
        title: 'Success',
        description: 'Payment transferred to landlord successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to transfer payment',
        variant: 'destructive',
      });
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await accountingService.addExpense(expenseForm);
      toast({
        title: 'Success',
        description: 'Expense created successfully',
      });
      setShowExpenseModal(false);
      setExpenseForm({
        building: '',
        category: '',
        amount: '',
        description: '',
        date: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create expense',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      setLoading(true);
      let data;
      switch (reportType) {
        case 'payments-by-period':
          data = await accountingService.getPaymentsByPeriodReport(reportStartDate, reportEndDate);
          break;
        case 'commissions-by-period':
          data = await accountingService.getCommissionsByPeriodReport(reportStartDate, reportEndDate);
          break;
        case 'expenses-by-period':
          data = await accountingService.getExpensesByPeriodReport(reportStartDate, reportEndDate);
          break;
        case 'collections-by-period':
          data = await accountingService.getCollectionsByPeriodReport(reportStartDate, reportEndDate);
          break;
        default:
          data = await accountingService.getFinancialReport(reportStartDate, reportEndDate);
      }
      setReportData(data);
      toast({
        title: 'Success',
        description: 'Report generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedUserId) return;
    const content = chatInput.trim();
    setChatInput('');
    try {
      await messagingService.sendMessage({ toUserId: selectedUserId, content });
      await loadChatForUser(selectedUserId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
      setChatInput(content);
    }
  };

  const stats = overviewData || {};

  return (
    <DashboardLayout title="Accounting Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-12 mb-6">
          <TabsTrigger value="overview">
            <DollarSign className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="collections">
            <TrendingUp className="w-4 h-4 mr-2" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Building className="w-4 h-4 mr-2" />
            Landlord
          </TabsTrigger>
          <TabsTrigger value="tenant-payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Tenant
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Receipt className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <FileText className="w-4 h-4 mr-2" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="tenants">
            <User className="w-4 h-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="deposits">
            <CreditCard className="w-4 h-4 mr-2" />
            Deposits
          </TabsTrigger>
          <TabsTrigger value="cashier">
            <Wallet className="w-4 h-4 mr-2" />
            Cashier
          </TabsTrigger>
          <TabsTrigger value="advertisements">
            <Megaphone className="w-4 h-4 mr-2" />
            Ads
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={`${(stats.totalRevenue || 0).toLocaleString()} XOF`}
                  subtitle="All time revenue"
                  variant="primary"
                />
                <StatCard
                  title="Pending Payments"
                  value={stats.pendingPayments || 0}
                  subtitle="Awaiting approval"
                />
                <StatCard
                  title="Total Expenses"
                  value={`${(stats.totalExpenses || 0).toLocaleString()} XOF`}
                  subtitle="Current period"
                />
                <StatCard
                  title="Net Profit"
                  value={`${(stats.netProfit || 0).toLocaleString()} XOF`}
                  subtitle="Revenue - Expenses"
                />
              </div>
              {monthlySummary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                    <CardDescription>Current month financial overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Collections</div>
                        <div className="text-2xl font-bold">
                          {(monthlySummary.collections || 0).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expenses</div>
                        <div className="text-2xl font-bold">
                          {(monthlySummary.expenses || 0).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Landlord Payments</div>
                        <div className="text-2xl font-bold">
                          {(monthlySummary.landlordPayments || 0).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Net</div>
                        <div className="text-2xl font-bold">
                          {(monthlySummary.net || 0).toLocaleString()} XOF
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>Track all collected payments</CardDescription>
            </CardHeader>
            <CardContent>
              {collections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No collections found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Charge Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection, index) => (
                      <TableRow key={collection.id || `collection-${index}`}>
                        <TableCell>{collection.tenant || 'N/A'}</TableCell>
                        <TableCell>{collection.property || 'N/A'}</TableCell>
                        <TableCell>{(collection.amount || 0).toLocaleString()} XOF</TableCell>
                        <TableCell>{collection.chargeType || 'Rent'}</TableCell>
                        <TableCell>
                          {collection.date ? new Date(collection.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (collection.status || 'collected').toLowerCase() === 'collected'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {collection.status || 'Collected'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Landlord Payments</CardTitle>
                  <CardDescription>Manage payments to landlords</CardDescription>
                </div>
                <Button onClick={() => setShowLandlordPaymentModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {landlordPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No landlord payments found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {landlordPayments.map((payment, index) => (
                      <TableRow key={payment.id || `landlord-payment-${index}`}>
                        <TableCell>{payment.landlord || 'N/A'}</TableCell>
                        <TableCell>{payment.building || 'N/A'}</TableCell>
                        <TableCell>{(payment.amount || 0).toLocaleString()} XOF</TableCell>
                        <TableCell>
                          {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (payment.status || 'pending').toLowerCase() === 'transferred'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.status !== 'transferred' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTransferToLandlord(payment.id)}
                            >
                              Transfer
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant-payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tenant Payments</CardTitle>
                <div className="flex gap-2">
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button onClick={() => setShowPaymentModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tenantPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tenant payments found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenantPayments.map((payment, index) => (
                      <TableRow key={payment.id || payment.ID || `payment-${index}`}>
                        <TableCell>{payment.tenant || payment.Tenant || 'N/A'}</TableCell>
                        <TableCell>{payment.property || payment.Property || 'N/A'}</TableCell>
                        <TableCell>{(payment.amount || payment.Amount || 0).toLocaleString()} XOF</TableCell>
                        <TableCell>{payment.method || payment.Method || 'N/A'}</TableCell>
                        <TableCell>
                          {payment.date || payment.Date
                            ? new Date(payment.date || payment.Date).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (payment.status || payment.Status || 'pending').toLowerCase() === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : (payment.status || payment.Status || 'pending').toLowerCase() === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status || payment.Status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {(payment.status || payment.Status || 'pending').toLowerCase() === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePayment(payment.id || payment.ID)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateReceipt(payment.id || payment.ID)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportStartDate">Start Date</Label>
                    <Input
                      id="reportStartDate"
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportEndDate">End Date</Label>
                    <Input
                      id="reportEndDate"
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button onClick={() => handleGenerateReport('payments-by-period')} disabled={loading}>
                    Payments
                  </Button>
                  <Button onClick={() => handleGenerateReport('commissions-by-period')} disabled={loading}>
                    Commissions
                  </Button>
                  <Button onClick={() => handleGenerateReport('expenses-by-period')} disabled={loading}>
                    Expenses
                  </Button>
                  <Button onClick={() => handleGenerateReport('collections-by-period')} disabled={loading}>
                    Collections
                  </Button>
                </div>
                {reportData && (
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(reportData, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Expenses</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Filter by building..."
                    value={expenseBuildingFilter}
                    onChange={(e) => setExpenseBuildingFilter(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={() => setShowExpenseModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No expenses found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense, index) => (
                      <TableRow key={expense.id || `expense-${index}`}>
                        <TableCell>{expense.building || 'N/A'}</TableCell>
                        <TableCell>{expense.category || 'N/A'}</TableCell>
                        <TableCell>{(expense.amount || 0).toLocaleString()} XOF</TableCell>
                        <TableCell>{expense.description || 'N/A'}</TableCell>
                        <TableCell>
                          {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              accountingService
                                .deleteExpense(expense.id)
                                .then(() => {
                                  toast({
                                    title: 'Success',
                                    description: 'Expense deleted successfully',
                                  });
                                  loadData();
                                })
                                .catch((err) =>
                                  toast({
                                    title: 'Error',
                                    description: err.message || 'Failed to delete expense',
                                    variant: 'destructive',
                                  })
                                )
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenants Payment Status</CardTitle>
              <CardDescription>View payment status for all tenants</CardDescription>
            </CardHeader>
            <CardContent>
              {tenants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tenants found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant, index) => (
                      <TableRow key={tenant.id || `tenant-${index}`}>
                        <TableCell>{tenant.name || tenant.Name || 'N/A'}</TableCell>
                        <TableCell>{tenant.property || tenant.Property || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (tenant.status || tenant.Status || 'up-to-date').toLowerCase() === 'up-to-date'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tenant.status || tenant.Status || 'Up-to-date'}
                          </span>
                        </TableCell>
                        <TableCell>{(tenant.balance || 0).toLocaleString()} XOF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Security Deposits</CardTitle>
                <select
                  value={depositFilter}
                  onChange={(e) => setDepositFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="payment">Payments</option>
                  <option value="refund">Refunds</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {deposits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No deposits found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.map((deposit, index) => (
                      <TableRow key={deposit.id || `deposit-${index}`}>
                        <TableCell>{deposit.tenant || 'N/A'}</TableCell>
                        <TableCell>{deposit.property || 'N/A'}</TableCell>
                        <TableCell>{deposit.type || 'N/A'}</TableCell>
                        <TableCell>{(deposit.amount || 0).toLocaleString()} XOF</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (deposit.status || 'pending').toLowerCase() === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {deposit.status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {deposit.date ? new Date(deposit.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashier" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cashier Management</CardTitle>
              <CardDescription>Manage cashier accounts and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Cashier management features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advertisements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertisements</CardTitle>
              <CardDescription>View active advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              {advertisements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active advertisements available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advertisements.map((ad, index) => {
                    const imageUrl = ad.ImageURL || ad.imageUrl || ad.imageURL;
                    const fullImageUrl = imageUrl
                      ? imageUrl.startsWith('http')
                        ? imageUrl
                        : `${API_CONFIG.BASE_URL}${imageUrl}`
                      : null;
                    return (
                      <Card key={ad.ID || ad.id || index}>
                        <CardContent className="p-4">
                          {fullImageUrl && (
                            <img
                              src={fullImageUrl}
                              alt={ad.Title || ad.title || 'Advertisement'}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <h3 className="font-semibold text-lg mb-2">
                            {ad.Title || ad.title || 'Untitled Advertisement'}
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            {ad.Text || ad.text || ad.description || ad.Description || 'No description'}
                          </p>
                          {ad.CreatedAt && (
                            <p className="text-sm text-muted-foreground">
                              Posted: {new Date(ad.CreatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chatUsers.map((user) => (
                      <div
                        key={user.userId}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          user.userId === selectedUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                        onClick={() => loadChatForUser(user.userId)}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm opacity-80">{user.email}</div>
                      </div>
                    ))}
                    {chatUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">No users available</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-8">
              <Card className="flex flex-col h-[600px]">
                <CardHeader>
                  <CardTitle>
                    Messages
                    {selectedUserId && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        with {chatUsers.find((u) => u.userId === selectedUserId)?.name || 'User'}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((msg, index) => {
                      const messageContent = msg.content || msg.Content || '';
                      const messageCreatedAt = msg.createdAt || msg.CreatedAt || '';
                      const messageFromUserId = msg.fromUserId || msg.FromUserId;
                      const storedUser = localStorage.getItem('user');
                      let isOutgoing = false;
                      if (storedUser) {
                        try {
                          const user = JSON.parse(storedUser);
                          const currentUserId = user.id || user.ID;
                          isOutgoing = String(messageFromUserId) === String(currentUserId);
                        } catch (e) {
                          // Default to incoming
                        }
                      }
                      return (
                        <div
                          key={msg.id || msg.ID || index}
                          className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOutgoing ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                          >
                            <p>{messageContent}</p>
                            {messageCreatedAt && (
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(messageCreatedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        {selectedUserId
                          ? 'No messages yet. Start the conversation!'
                          : 'Select a conversation to start messaging.'}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={!selectedUserId}
                    />
                    <Button onClick={handleSendMessage} disabled={!selectedUserId || !chatInput.trim()}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Profile />
        </TabsContent>
      </Tabs>

      {/* Record Tenant Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Tenant Payment"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              await accountingService.recordTenantPayment(paymentForm);
              toast({
                title: 'Success',
                description: 'Payment recorded successfully',
              });
              setShowPaymentModal(false);
              setPaymentForm({
                tenant: '',
                property: '',
                amount: '',
                method: '',
                reference: '',
                chargeType: 'rent',
              });
              loadData();
            } catch (error: any) {
              toast({
                title: 'Error',
                description: error.message || 'Failed to record payment',
                variant: 'destructive',
              });
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant *</Label>
            <Input
              id="tenant"
              value={paymentForm.tenant}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, tenant: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property">Property *</Label>
            <Input
              id="property"
              value={paymentForm.property}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (XOF) *</Label>
              <Input
                id="amount"
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <select
                id="method"
                value={paymentForm.method}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, method: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select method</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, reference: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Landlord Payment Modal */}
      <Modal
        isOpen={showLandlordPaymentModal}
        onClose={() => setShowLandlordPaymentModal(false)}
        title="Record Landlord Payment"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              await accountingService.recordLandlordPayment(landlordPaymentForm);
              toast({
                title: 'Success',
                description: 'Landlord payment recorded successfully',
              });
              setShowLandlordPaymentModal(false);
              setLandlordPaymentForm({
                landlord: '',
                building: '',
                amount: '',
                method: '',
                reference: '',
              });
              loadData();
            } catch (error: any) {
              toast({
                title: 'Error',
                description: error.message || 'Failed to record payment',
                variant: 'destructive',
              });
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="landlord">Landlord *</Label>
            <select
              id="landlord"
              value={landlordPaymentForm.landlord}
              onChange={(e) =>
                setLandlordPaymentForm((prev) => ({ ...prev, landlord: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select landlord</option>
              {landlords.map((landlord) => (
                <option key={landlord.id || landlord.ID} value={landlord.name || landlord.Name}>
                  {landlord.name || landlord.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">Building *</Label>
            <Input
              id="building"
              value={landlordPaymentForm.building}
              onChange={(e) =>
                setLandlordPaymentForm((prev) => ({ ...prev, building: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordAmount">Amount (XOF) *</Label>
              <Input
                id="landlordAmount"
                type="number"
                value={landlordPaymentForm.amount}
                onChange={(e) =>
                  setLandlordPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlordMethod">Payment Method *</Label>
              <select
                id="landlordMethod"
                value={landlordPaymentForm.method}
                onChange={(e) =>
                  setLandlordPaymentForm((prev) => ({ ...prev, method: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="landlordReference">Reference</Label>
            <Input
              id="landlordReference"
              value={landlordPaymentForm.reference}
              onChange={(e) =>
                setLandlordPaymentForm((prev) => ({ ...prev, reference: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowLandlordPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
        size="lg"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expenseBuilding">Building *</Label>
            <Input
              id="expenseBuilding"
              value={expenseForm.building}
              onChange={(e) => setExpenseForm((prev) => ({ ...prev, building: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseCategory">Category *</Label>
            <Input
              id="expenseCategory"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm((prev) => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Amount (XOF) *</Label>
              <Input
                id="expenseAmount"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDate">Date *</Label>
              <Input
                id="expenseDate"
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseDescription">Description</Label>
            <textarea
              id="expenseDescription"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Expense'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AccountingDashboard;
