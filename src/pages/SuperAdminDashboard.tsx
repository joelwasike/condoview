import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { superAdminService } from '@/services/superAdmin';
import { messagingService } from '@/services/messaging';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import {
  BarChart3,
  DollarSign,
  Users,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Search,
  Filter,
  Upload,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const SuperAdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [agencyAdmins, setAgencyAdmins] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Modals
  const [showAgencyAdminModal, setShowAgencyAdminModal] = useState(false);
  const [editingAgencyAdmin, setEditingAgencyAdmin] = useState<any>(null);
  const [showAdModal, setShowAdModal] = useState(false);

  // Forms
  const [agencyAdminForm, setAgencyAdminForm] = useState({
    name: '',
    email: '',
    company: '',
    role: 'agency_director',
    password: '',
  });
  const [newAd, setNewAd] = useState({ title: '', text: '', image: null as File | null });

  // Filters
  const [transactionsTab, setTransactionsTab] = useState('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionStartDate, setTransactionStartDate] = useState('');
  const [transactionEndDate, setTransactionEndDate] = useState('');
  const [clientsSearch, setClientsSearch] = useState('');
  const [adFilter, setAdFilter] = useState('all');

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
      const [overview, companiesData, adminsData, financial, adsData, subscriptionsData] = await Promise.all([
        superAdminService.getOverview().catch(() => null),
        superAdminService.getCompanies().catch(() => []),
        superAdminService.getAgencyAdmins().catch(() => []),
        superAdminService.getFinancialOverview().catch(() => null),
        superAdminService.getAdvertisements().catch(() => []),
        superAdminService.getSubscriptions().catch(() => []),
      ]);

      setOverviewStats(overview);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setAgencyAdmins(Array.isArray(adminsData) ? adminsData : []);
      setFinancialData(financial);
      setAds(Array.isArray(adsData) ? adsData : []);
      setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadUsers = useCallback(async () => {
    if (isLoadingUsersRef.current) return;
    try {
      isLoadingUsersRef.current = true;
      const users = await superAdminService.getAgencyAdmins();
      const usersArray = Array.isArray(users) ? users : [];

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
          name: u.Name || u.name || 'User',
          email: u.Email || u.email || '',
          role: u.Role || u.role || '',
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
        const messages = await superAdminService.getChatWithAdmin(userId);
        setChatMessages(Array.isArray(messages) ? messages : []);
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
    if (activeTab === 'chat') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  const handleCreateAgencyAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        name: agencyAdminForm.name,
        email: agencyAdminForm.email,
        company: agencyAdminForm.company,
        role: agencyAdminForm.role,
        password: agencyAdminForm.password,
      };

      if (editingAgencyAdmin) {
        if (agencyAdminForm.password) {
          userData.password = agencyAdminForm.password;
        }
        await superAdminService.updateUser(editingAgencyAdmin.ID || editingAgencyAdmin.id, userData);
        toast({
          title: 'Success',
          description: 'Agency admin updated successfully!',
        });
      } else {
        if (!agencyAdminForm.password) {
          toast({
            title: 'Warning',
            description: 'Password is required for new admin',
            variant: 'destructive',
          });
          return;
        }
        await superAdminService.addUser(userData);
        toast({
          title: 'Success',
          description: 'Agency admin created successfully!',
        });
      }
      setShowAgencyAdminModal(false);
      setAgencyAdminForm({
        name: '',
        email: '',
        company: '',
        role: 'agency_director',
        password: '',
      });
      setEditingAgencyAdmin(null);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save agency admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgencyAdmin = async (admin: any) => {
    if (window.confirm(`Are you sure you want to delete ${admin.Name || admin.name}?`)) {
      try {
        await superAdminService.deleteUser(admin.ID || admin.id);
        toast({
          title: 'Success',
          description: 'Agency admin deleted successfully!',
        });
        loadData();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete agency admin',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title || !newAd.text) {
      toast({
        title: 'Warning',
        description: 'Please provide a title and description',
        variant: 'destructive',
      });
      return;
    }
    if (!newAd.image) {
      toast({
        title: 'Warning',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }
    try {
      setLoading(true);
      await superAdminService.createAdvertisement(newAd);
      toast({
        title: 'Success',
        description: 'Advertisement created successfully!',
      });
      setNewAd({ title: '', text: '', image: null });
      setShowAdModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create advertisement',
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
      await superAdminService.sendChatMessage({
        toUserId: selectedUserId,
        content: content,
      });
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

  const filteredTransactions = useMemo(() => {
    const base = subscriptions.length > 0 ? subscriptions : companies || [];
    return base.filter((item) => {
      if (transactionSearch) {
        const q = transactionSearch.toLowerCase();
        const agency = item.agencyId
          ? companies.find((c) => (c.ID || c.id) === item.agencyId)
          : item;
        const name = (
          agency?.Name ||
          agency?.name ||
          item.agencyName ||
          item.Name ||
          item.name ||
          ''
        ).toLowerCase();
        const email = (agency?.Email || agency?.email || item.email || item.Email || '').toLowerCase();
        const date = item.paymentDate || item.dueDate || item.createdAt || '';
        if (!name.includes(q) && !email.includes(q) && !date.includes(q)) return false;
      }

      if (transactionStartDate || transactionEndDate) {
        const transactionDate =
          item.paymentDate ||
          item.dueDate ||
          item.createdAt ||
          item.CreatedAt ||
          item.PaymentDate ||
          item.DueDate;
        if (transactionDate) {
          const itemDate = new Date(transactionDate);
          if (transactionStartDate) {
            const startDate = new Date(transactionStartDate);
            startDate.setHours(0, 0, 0, 0);
            if (itemDate < startDate) return false;
          }
          if (transactionEndDate) {
            const endDate = new Date(transactionEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (itemDate > endDate) return false;
          }
        } else {
          if (transactionStartDate || transactionEndDate) return false;
        }
      }

      if (transactionsTab === 'all') return true;
      const status = (item.paymentStatus || item.status || item.accountStatus || 'paid').toLowerCase();
      if (transactionsTab === 'paid') return status === 'paid' || status === 'approved';
      if (transactionsTab === 'pending') return status === 'pending' || status === 'en attente';
      if (transactionsTab === 'deactivated')
        return status === 'deactivated' || status === 'désactiver' || status === 'inactive';
      return true;
    });
  }, [subscriptions, companies, transactionSearch, transactionStartDate, transactionEndDate, transactionsTab]);

  const filteredClients = useMemo(() => {
    const base = agencyAdmins || [];
    if (!clientsSearch) return base;
    const q = clientsSearch.toLowerCase();
    return base.filter((admin) => {
      const name = (admin.Name || admin.name || '').toLowerCase();
      const email = (admin.Email || admin.email || '').toLowerCase();
      const role = (admin.Role || admin.role || '').toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [agencyAdmins, clientsSearch]);

  const filteredAds = useMemo(() => {
    if (adFilter === 'all') return ads || [];
    return (ads || []).filter((ad) => (ad.Status || ad.status || 'active').toLowerCase() === adFilter);
  }, [ads, adFilter]);

  return (
    <DashboardLayout title="Super Admin Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <DollarSign className="w-4 h-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="ads">
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
                  title="Total Received"
                  value={`${(overviewStats?.totalReceived || overviewStats?.totalRevenue || 0).toLocaleString()} CFA`}
                  subtitle="This week"
                  variant="primary"
                />
                <StatCard
                  title="Total Clients"
                  value={overviewStats?.totalClients || overviewStats?.totalAgencies || companies.length || 0}
                  subtitle="Registered agencies"
                />
                <StatCard
                  title="Total Cash"
                  value={`${(overviewStats?.cashInHand || financialData?.netProfit || 0).toLocaleString()} FCFA`}
                  subtitle="Cash in hand"
                />
                <StatCard
                  title="Total Ads"
                  value={ads.length || overviewStats?.totalAds || 0}
                  subtitle="Active advertisements"
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Agency Subscriptions</CardTitle>
                  <CardDescription>Track license payments from your client agencies</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptions.length === 0 && companies.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No subscription data available
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Account Status</TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(subscriptions.length > 0 ? subscriptions : companies || []).map((item, index) => {
                          const agency = item.agencyId
                            ? companies.find((c) => (c.ID || c.id) === item.agencyId)
                            : item;
                          return (
                            <TableRow key={`overview-agency-${agency?.ID || agency?.id || item.id || index}`}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {agency?.Name || agency?.name || item.agencyName || 'N/A'}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {agency?.Email || agency?.email || item.email || 'example@email.com'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (item.accountStatus || agency?.Status || agency?.status || 'active').toLowerCase() ===
                                    'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {item.accountStatus || agency?.Status || agency?.status || 'Active'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (item.paymentStatus || item.status || 'paid').toLowerCase() === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {item.paymentStatus || item.status || 'Paid'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {(item.amount ||
                                  item.subscriptionAmount ||
                                  agency?.SubscriptionAmount ||
                                  0).toLocaleString()}{' '}
                                CFA
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Track subscription payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {['all', 'paid', 'pending', 'deactivated'].map((id) => (
                  <Button
                    key={id}
                    variant={transactionsTab === id ? 'default' : 'outline'}
                    onClick={() => setTransactionsTab(id)}
                  >
                    {id === 'all' && 'All'}
                    {id === 'paid' && 'Paid'}
                    {id === 'pending' && 'Pending'}
                    {id === 'deactivated' && 'Deactivated'}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Name, Email or Date"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="date"
                  value={transactionStartDate}
                  onChange={(e) => setTransactionStartDate(e.target.value)}
                  className="w-48"
                />
                <Input
                  type="date"
                  value={transactionEndDate}
                  onChange={(e) => setTransactionEndDate(e.target.value)}
                  className="w-48"
                />
                {(transactionStartDate || transactionEndDate) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTransactionStartDate('');
                      setTransactionEndDate('');
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions match your filters
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Subscription Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((item, index) => {
                      const agency = item.agencyId
                        ? companies.find((c) => (c.ID || c.id) === item.agencyId)
                        : item;
                      const transactionDate =
                        item.paymentDate ||
                        item.dueDate ||
                        item.createdAt ||
                        item.CreatedAt ||
                        item.PaymentDate ||
                        item.DueDate ||
                        agency?.CreatedAt ||
                        agency?.createdAt;
                      return (
                        <TableRow key={`transaction-${item.id || agency?.ID || agency?.id || index}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {agency?.Name || agency?.name || item.agencyName || 'N/A'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {agency?.Email || agency?.email || item.email || 'example@email.com'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {transactionDate
                              ? new Date(transactionDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                (item.accountStatus || agency?.Status || agency?.status || 'active').toLowerCase() ===
                                'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.accountStatus || agency?.Status || agency?.status || 'Active'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (item.paymentStatus || item.status || 'paid').toLowerCase() === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {item.paymentStatus || item.status || 'Paid'}
                              </span>
                              {item.dueDate && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Due on {new Date(item.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(item.amount || item.subscriptionAmount || agency?.SubscriptionAmount || 0).toLocaleString()}{' '}
                            CFA
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Client List</CardTitle>
                  <CardDescription>{filteredClients.length} results found</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingAgencyAdmin(null);
                    setAgencyAdminForm({
                      name: '',
                      email: '',
                      company: '',
                      role: 'agency_director',
                      password: '',
                    });
                    setShowAgencyAdminModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agency Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search clients..."
                  value={clientsSearch}
                  onChange={(e) => setClientsSearch(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No clients match your search</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((admin, index) => {
                      const companyName =
                        admin.companyDetails?.name ||
                        admin.CompanyDetails?.name ||
                        admin.Company ||
                        admin.company ||
                        'N/A';
                      return (
                        <TableRow key={`client-${admin.ID || admin.id || index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{admin.Name || admin.name}</TableCell>
                          <TableCell>{admin.Email || admin.email}</TableCell>
                          <TableCell>{companyName}</TableCell>
                          <TableCell>
                            {admin.CreatedAt ? new Date(admin.CreatedAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>{admin.Role || admin.role || 'Director'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingAgencyAdmin(admin);
                                  const role = admin.Role || admin.role || 'agency_director';
                                  const normalizedRole = role.replace('-', '_');
                                  setAgencyAdminForm({
                                    name: admin.Name || admin.name || '',
                                    email: admin.Email || admin.email || '',
                                    company: admin.Company || admin.company || '',
                                    role: normalizedRole,
                                    password: '',
                                  });
                                  setShowAgencyAdminModal(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteAgencyAdmin(admin)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Advertisements Overview</CardTitle>
                <div className="flex gap-2">
                  <select
                    value={adFilter}
                    onChange={(e) => setAdFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="pause">Paused</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="finished">Finished</option>
                  </select>
                  <Button onClick={() => setShowAdModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No advertisements yet. Use the form to create your first campaign.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAds.map((ad, index) => {
                    const status = (ad.Status || ad.status || 'published').toLowerCase();
                    const statusLabels: Record<string, string> = {
                      published: 'Published',
                      pause: 'Paused',
                      scheduled: 'Scheduled',
                      finished: 'Finished',
                    };
                    const imageUrl = ad.ImageURL || ad.imageUrl || ad.imageURL;
                    const fullImageUrl = imageUrl
                      ? imageUrl.startsWith('http')
                        ? imageUrl
                        : `${API_CONFIG.BASE_URL}${imageUrl}`
                      : null;
                    return (
                      <Card key={`ad-${ad.id || ad.ID || index}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : status === 'pause'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {statusLabels[status] || 'Published'}
                            </span>
                          </div>
                          {fullImageUrl && (
                            <img
                              src={fullImageUrl}
                              alt={ad.title || ad.Title || 'Advertisement'}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <h3 className="font-semibold text-lg mb-2">
                            {ad.title || ad.Title || 'Untitled Advertisement'}
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            {ad.Text || ad.text || ad.description || ad.Description || 'No description available'}
                          </p>
                          {ad.commissionLabel || ad.commission ? (
                            <span className="text-sm font-medium text-blue-600">
                              {ad.commissionLabel || ad.commission || '50% COMMISSION'}
                            </span>
                          ) : null}
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
                  <CardTitle>Agency Admins</CardTitle>
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
                      <div className="text-center py-8 text-muted-foreground">No agency admins available</div>
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

      {/* Agency Admin Modal */}
      <Modal
        isOpen={showAgencyAdminModal}
        onClose={() => {
          setShowAgencyAdminModal(false);
          setEditingAgencyAdmin(null);
          setAgencyAdminForm({
            name: '',
            email: '',
            company: '',
            role: 'agency_director',
            password: '',
          });
        }}
        title={editingAgencyAdmin ? 'Edit Agency Admin' : 'Add Agency Admin'}
        size="lg"
      >
        <form onSubmit={handleCreateAgencyAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Name *</Label>
            <Input
              id="adminName"
              value={agencyAdminForm.name}
              onChange={(e) =>
                setAgencyAdminForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              placeholder="Enter admin name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              value={agencyAdminForm.email}
              onChange={(e) =>
                setAgencyAdminForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminCompany">Company *</Label>
            <Input
              id="adminCompany"
              value={agencyAdminForm.company}
              onChange={(e) =>
                setAgencyAdminForm((prev) => ({ ...prev, company: e.target.value }))
              }
              required
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminRole">Role *</Label>
            <select
              id="adminRole"
              value={agencyAdminForm.role}
              onChange={(e) =>
                setAgencyAdminForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="agency_director">Agency Director</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">
              Password {editingAgencyAdmin ? '(leave blank to keep current)' : '*'}
            </Label>
            <Input
              id="adminPassword"
              type="password"
              value={agencyAdminForm.password}
              onChange={(e) =>
                setAgencyAdminForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required={!editingAgencyAdmin}
              placeholder={editingAgencyAdmin ? 'Enter new password (optional)' : 'Enter password'}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAgencyAdminModal(false);
                setEditingAgencyAdmin(null);
                setAgencyAdminForm({
                  name: '',
                  email: '',
                  company: '',
                  role: 'agency_director',
                  password: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingAgencyAdmin ? 'Update' : 'Create'} Agency Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Advertisement Modal */}
      <Modal
        isOpen={showAdModal}
        onClose={() => {
          setShowAdModal(false);
          setNewAd({ title: '', text: '', image: null });
        }}
        title="Create Advertisement"
        size="lg"
      >
        <form onSubmit={handleCreateAd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adTitle">Title *</Label>
            <Input
              id="adTitle"
              value={newAd.title}
              onChange={(e) => setNewAd((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Enter advertisement title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adText">Description *</Label>
            <textarea
              id="adText"
              value={newAd.text}
              onChange={(e) => setNewAd((prev) => ({ ...prev, text: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              required
              placeholder="Enter advertisement description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adImage">Image *</Label>
            <Input
              id="adImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewAd((prev) => ({ ...prev, image: file }));
                }
              }}
              required
            />
            {newAd.image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(newAd.image)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAdModal(false);
                setNewAd({ title: '', text: '', image: null });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Advertisement'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
