import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { landlordService } from '@/services/landlord';
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
  Home,
  Users,
  DollarSign,
  FileText,
  Wrench,
  Package,
  BarChart3,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Upload,
  Receipt,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LandlordDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [rents, setRents] = useState<any>(null);
  const [netPayments, setNetPayments] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [businessTracking, setBusinessTracking] = useState<any>(null);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Forms
  const [propertyForm, setPropertyForm] = useState({
    address: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    rent: '',
  });
  const [workOrderForm, setWorkOrderForm] = useState({
    property: '',
    type: '',
    priority: 'medium',
    description: '',
    assignedTo: '',
    amount: '',
  });
  const [claimForm, setClaimForm] = useState({
    property: '',
    type: '',
    description: '',
    amount: '',
  });
  const [inventoryForm, setInventoryForm] = useState({
    property: '',
    type: '',
    inspector: '',
  });

  // Payment sub-tabs
  const [paymentSubTab, setPaymentSubTab] = useState('all');
  const [netPaymentStatusFilter, setNetPaymentStatusFilter] = useState('');
  const [netPaymentStartDate, setNetPaymentStartDate] = useState('');
  const [netPaymentEndDate, setNetPaymentEndDate] = useState('');

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
      const [overview, propertiesData, tenantsData, paymentsData, rentsData, workOrdersData, claimsData, inventoryData, trackingData, expensesData] = await Promise.all([
        landlordService.getOverview().catch(() => null),
        landlordService.getProperties().catch(() => []),
        landlordService.getTenants().catch(() => []),
        landlordService.getPayments().catch(() => []),
        landlordService.getRents().catch(() => null),
        landlordService.getWorkOrders().catch(() => []),
        landlordService.getClaims().catch(() => []),
        landlordService.getInventory().catch(() => []),
        landlordService.getBusinessTracking().catch(() => null),
        landlordService.getExpenses().catch(() => []),
      ]);

      setOverviewData(overview);
      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setRents(rentsData);
      setWorkOrders(Array.isArray(workOrdersData) ? workOrdersData : []);
      setClaims(Array.isArray(claimsData) ? claimsData : []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setBusinessTracking(trackingData);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
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

  const loadNetPayments = useCallback(async () => {
    try {
      const data = await landlordService.getNetPayments({
        status: netPaymentStatusFilter || undefined,
        startDate: netPaymentStartDate || undefined,
        endDate: netPaymentEndDate || undefined,
      });
      setNetPayments(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load net payments',
        variant: 'destructive',
      });
    }
  }, [netPaymentStatusFilter, netPaymentStartDate, netPaymentEndDate, toast]);

  const loadPaymentHistory = useCallback(async () => {
    try {
      const data = await landlordService.getPaymentHistory({
        startDate: netPaymentStartDate || undefined,
        endDate: netPaymentEndDate || undefined,
      });
      setPaymentHistory(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load payment history',
        variant: 'destructive',
      });
    }
  }, [netPaymentStartDate, netPaymentEndDate, toast]);

  const loadAdvertisements = useCallback(async () => {
    try {
      const ads = await landlordService.getAdvertisements();
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
    if (activeTab === 'advertisements') {
      loadAdvertisements();
    }
  }, [activeTab, loadAdvertisements]);

  useEffect(() => {
    if (activeTab === 'chat') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  useEffect(() => {
    if (paymentSubTab === 'net') {
      loadNetPayments();
    } else if (paymentSubTab === 'history') {
      loadPaymentHistory();
    }
  }, [paymentSubTab, loadNetPayments, loadPaymentHistory]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await landlordService.addProperty(propertyForm);
      toast({
        title: 'Success',
        description: 'Property added successfully!',
      });
      setPropertyForm({ address: '', type: '', bedrooms: '', bathrooms: '', rent: '' });
      setShowPropertyModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkOrder = async (workOrderData: any) => {
    try {
      setLoading(true);
      await landlordService.createWorkOrder(workOrderData);
      toast({
        title: 'Success',
        description: 'Work order created successfully!',
      });
      setWorkOrderForm({
        property: '',
        type: '',
        priority: 'medium',
        description: '',
        assignedTo: '',
        amount: '',
      });
      setShowWorkOrderModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create work order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClaim = async (claimData: any) => {
    try {
      setLoading(true);
      await landlordService.createClaim(claimData);
      toast({
        title: 'Success',
        description: 'Claim created successfully!',
      });
      setClaimForm({ property: '', type: '', description: '', amount: '' });
      setShowClaimModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create claim',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async (inventoryData: any) => {
    try {
      setLoading(true);
      await landlordService.addInventory(inventoryData);
      toast({
        title: 'Success',
        description: 'Inventory added successfully!',
      });
      setInventoryForm({ property: '', type: '', inspector: '' });
      setShowInventoryModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReceipt = async (receiptData: any) => {
    try {
      await landlordService.generateReceipt(receiptData);
      toast({
        title: 'Success',
        description: 'Receipt generated successfully!',
      });
      setShowReceiptModal(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate receipt',
        variant: 'destructive',
      });
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

  const activeTenantsCount = overviewData?.activeTenants || tenants.filter((t) => (t.status || t.Status || '').toLowerCase() === 'active').length;
  const totalProps = overviewData?.totalPropertiesUnderManagement || properties.length;
  const occupiedProps = overviewData?.occupiedProperties || properties.filter((p) => (p.Status || p.status || '').toLowerCase() === 'occupied').length;
  const occupancyRate = totalProps > 0 ? ((occupiedProps / totalProps) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout title="Landlord Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-13 mb-6 overflow-x-auto">
          <TabsTrigger value="overview">
            <Home className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Home className="w-4 h-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="tenants">
            <Users className="w-4 h-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="rents">
            <DollarSign className="w-4 h-4 mr-2" />
            Rents
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <FileText className="w-4 h-4 mr-2" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="works">
            <Wrench className="w-4 h-4 mr-2" />
            Works
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="w-4 h-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tracking
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
                  title="Total Properties"
                  value={totalProps}
                  subtitle="Properties managed"
                  variant="primary"
                />
                <StatCard
                  title="Active Tenants"
                  value={activeTenantsCount}
                  subtitle="Current tenants"
                />
                <StatCard
                  title="Occupancy Rate"
                  value={`${occupancyRate}%`}
                  subtitle="Properties occupied"
                />
                <StatCard
                  title="Total Revenue"
                  value={`${overviewData?.totalRentCollected?.toLocaleString() || 0} XOF`}
                  subtitle="Rent collected"
                />
              </div>
              {overviewData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Rent Collected vs Net Payout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={(() => {
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                          const currentRent = overviewData?.totalRentCollected || 0;
                          const currentPayout = overviewData?.totalNetPayoutReceived || 0;
                          return months.map((month, index) => ({
                            month,
                            rent: Math.round(currentRent * (0.7 + index * 0.05)),
                            payout: Math.round(currentPayout * (0.7 + index * 0.05)),
                          }));
                        })()}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rent" stroke="#3b82f6" name="Rent Collected" />
                        <Line type="monotone" dataKey="payout" stroke="#10b981" name="Net Payout" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>{properties.length} properties found</CardDescription>
                </div>
                <Button onClick={() => setShowPropertyModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No properties found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Bedrooms</TableHead>
                      <TableHead>Bathrooms</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property, index) => (
                      <TableRow key={property.ID || property.id || `property-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{property.Address || property.address || 'Unknown'}</TableCell>
                        <TableCell>{property.Type || property.type || 'N/A'}</TableCell>
                        <TableCell>{property.Bedrooms || property.bedrooms || 0}</TableCell>
                        <TableCell>{property.Bathrooms || property.bathrooms || 0}</TableCell>
                        <TableCell>
                          {(property.Rent || property.rent || 0).toLocaleString()} XOF/month
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (property.Status || property.status || 'vacant').toLowerCase() === 'occupied'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {property.Status || property.status || 'Vacant'}
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

        <TabsContent value="tenants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Management</CardTitle>
              <CardDescription>{tenants.length} tenants found</CardDescription>
            </CardHeader>
            <CardContent>
              {tenants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tenants found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant, index) => (
                      <TableRow key={tenant.id || tenant.ID || `tenant-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{tenant.name || tenant.Name || 'N/A'}</TableCell>
                        <TableCell>{tenant.property || tenant.Property || 'N/A'}</TableCell>
                        <TableCell>{tenant.email || tenant.Email || 'N/A'}</TableCell>
                        <TableCell>{tenant.phone || tenant.Phone || 'N/A'}</TableCell>
                        <TableCell>
                          {(tenant.amount || tenant.Amount || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (tenant.status || tenant.Status || 'active').toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tenant.status || tenant.Status || 'Active'}
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
                <CardTitle>Payments & Cash Flow</CardTitle>
                <Button onClick={() => setShowReceiptModal(true)}>
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Receipt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={paymentSubTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setPaymentSubTab('all')}
                >
                  All Payments
                </Button>
                <Button
                  variant={paymentSubTab === 'net' ? 'default' : 'outline'}
                  onClick={() => setPaymentSubTab('net')}
                >
                  Net Payments
                </Button>
                <Button
                  variant={paymentSubTab === 'history' ? 'default' : 'outline'}
                  onClick={() => setPaymentSubTab('history')}
                >
                  Payment History
                </Button>
              </div>

              {paymentSubTab === 'all' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={payment.ID || payment.id || `payment-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {new Date(
                            payment.Date || payment.date || payment.CreatedAt || payment.createdAt
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.Property || payment.property || 'Unknown'}</TableCell>
                        <TableCell>{payment.Tenant || payment.tenant || 'Unknown'}</TableCell>
                        <TableCell>
                          {(payment.Amount || payment.amount || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>{payment.Method || payment.method || 'Unknown'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (payment.Status || payment.status || 'pending').toLowerCase() === 'approved' ||
                              (payment.Status || payment.status || 'pending').toLowerCase() === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.Status || payment.status || 'Pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {paymentSubTab === 'net' && netPayments && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Net Amount</div>
                        <div className="text-2xl font-bold">
                          {(netPayments.totalNetAmount || 0).toLocaleString()} XOF
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Commission</div>
                        <div className="text-2xl font-bold">
                          {(netPayments.totalCommission || 0).toLocaleString()} XOF
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {netPayments.payments && netPayments.payments.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Landlord</TableHead>
                          <TableHead>Building</TableHead>
                          <TableHead>Net Amount</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {netPayments.payments.map((payment: any, index: number) => (
                          <TableRow key={payment.id || payment.ID || `net-payment-${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {new Date(payment.date || payment.Date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{payment.landlord || payment.Landlord || 'Unknown'}</TableCell>
                            <TableCell>{payment.building || payment.Building || 'Unknown'}</TableCell>
                            <TableCell>
                              {(payment.netAmount || payment.NetAmount || 0).toLocaleString()} XOF
                            </TableCell>
                            <TableCell>
                              {(payment.commission || payment.Commission || 0).toLocaleString()} XOF
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (payment.status || payment.Status || 'pending').toLowerCase() === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {payment.status || payment.Status || 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}

              {paymentSubTab === 'history' && paymentHistory && (
                <div className="text-center py-8 text-muted-foreground">
                  Payment history data will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rents Tracking</CardTitle>
              <CardDescription>Track rent payments and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              {rents ? (
                <div className="text-center py-8">Rent tracking data available</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No rent data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Track property expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No expenses found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense, index) => (
                      <TableRow key={expense.id || expense.ID || `expense-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {new Date(expense.date || expense.Date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.property || expense.Property || 'N/A'}</TableCell>
                        <TableCell>{expense.category || expense.Category || 'N/A'}</TableCell>
                        <TableCell>
                          {(expense.amount || expense.Amount || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>{expense.description || expense.Description || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="works" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Works & Claims</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={() => setShowWorkOrderModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Work Order
                  </Button>
                  <Button variant="outline" onClick={() => setShowClaimModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Claim
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Work Orders</h3>
                  {workOrders.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No work orders found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workOrders.map((work, index) => (
                          <TableRow key={work.id || work.ID || `work-${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{work.property || work.Property || 'N/A'}</TableCell>
                            <TableCell>{work.type || work.Type || 'N/A'}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (work.priority || work.Priority || 'medium').toLowerCase() === 'high' ||
                                  (work.priority || work.Priority || 'medium').toLowerCase() === 'urgent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {work.priority || work.Priority || 'Medium'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (work.status || work.Status || 'pending').toLowerCase() === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {work.status || work.Status || 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Claims</h3>
                  {claims.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No claims found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims.map((claim, index) => (
                          <TableRow key={claim.id || claim.ID || `claim-${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{claim.property || claim.Property || 'N/A'}</TableCell>
                            <TableCell>{claim.type || claim.Type || 'N/A'}</TableCell>
                            <TableCell>
                              {(claim.amount || claim.Amount || 0).toLocaleString()} XOF
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (claim.status || claim.Status || 'pending').toLowerCase() === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {claim.status || claim.Status || 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage property documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Document management interface will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventory</CardTitle>
                <Button onClick={() => setShowInventoryModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inventory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {inventory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No inventory found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item, index) => (
                      <TableRow key={item.id || item.ID || `inventory-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.property || item.Property || 'N/A'}</TableCell>
                        <TableCell>{item.type || item.Type || 'N/A'}</TableCell>
                        <TableCell>{item.inspector || item.Inspector || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(item.date || item.Date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (item.status || item.Status || 'pending').toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.status || item.Status || 'Pending'}
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

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Tracking</CardTitle>
              <CardDescription>Track business metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {businessTracking ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Revenue Trends"
                    value={businessTracking.revenueTrends || '+12%'}
                    subtitle="Growth rate"
                  />
                  <StatCard
                    title="Occupancy Rate"
                    value={`${businessTracking.occupancyRate || 80}%`}
                    subtitle="Properties occupied"
                  />
                  <StatCard
                    title="ROI"
                    value={`${businessTracking.roi || '8.5'}%`}
                    subtitle="Return on investment"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No tracking data available</div>
              )}
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

      {/* Property Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        title="Add Property"
        size="lg"
      >
        <form onSubmit={handleAddProperty} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={propertyForm.address}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              value={propertyForm.type}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={propertyForm.bedrooms}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, bedrooms: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={propertyForm.bathrooms}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, bathrooms: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (XOF) *</Label>
            <Input
              id="rent"
              type="number"
              value={propertyForm.rent}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, rent: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPropertyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Work Order Modal */}
      <Modal
        isOpen={showWorkOrderModal}
        onClose={() => setShowWorkOrderModal(false)}
        title="Create Work Order"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWorkOrder(workOrderForm);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="workProperty">Property *</Label>
            <Input
              id="workProperty"
              value={workOrderForm.property}
              onChange={(e) =>
                setWorkOrderForm((prev) => ({ ...prev, property: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workType">Work Type *</Label>
            <select
              id="workType"
              value={workOrderForm.type}
              onChange={(e) => setWorkOrderForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="renovation">Renovation</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workPriority">Priority *</Label>
            <select
              id="workPriority"
              value={workOrderForm.priority}
              onChange={(e) => setWorkOrderForm((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workDescription">Description *</Label>
            <textarea
              id="workDescription"
              value={workOrderForm.description}
              onChange={(e) =>
                setWorkOrderForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workAssignedTo">Assigned To</Label>
            <Input
              id="workAssignedTo"
              value={workOrderForm.assignedTo}
              onChange={(e) =>
                setWorkOrderForm((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workAmount">Estimated Cost (XOF)</Label>
            <Input
              id="workAmount"
              type="number"
              value={workOrderForm.amount}
              onChange={(e) =>
                setWorkOrderForm((prev) => ({ ...prev, amount: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowWorkOrderModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Work Order'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Claim Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Create Claim"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateClaim(claimForm);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="claimProperty">Property *</Label>
            <Input
              id="claimProperty"
              value={claimForm.property}
              onChange={(e) => setClaimForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="claimType">Claim Type *</Label>
            <select
              id="claimType"
              value={claimForm.type}
              onChange={(e) => setClaimForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="damage">Damage</option>
              <option value="insurance">Insurance</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="claimDescription">Description *</Label>
            <textarea
              id="claimDescription"
              value={claimForm.description}
              onChange={(e) => setClaimForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="claimAmount">Claim Amount (XOF)</Label>
            <Input
              id="claimAmount"
              type="number"
              value={claimForm.amount}
              onChange={(e) => setClaimForm((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowClaimModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Claim'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inventory Modal */}
      <Modal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        title="Add Inventory"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddInventory(inventoryForm);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="inventoryProperty">Property *</Label>
            <Input
              id="inventoryProperty"
              value={inventoryForm.property}
              onChange={(e) =>
                setInventoryForm((prev) => ({ ...prev, property: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventoryType">Inventory Type *</Label>
            <select
              id="inventoryType"
              value={inventoryForm.type}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="move-in">Move-in</option>
              <option value="move-out">Move-out</option>
              <option value="routine">Routine</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventoryInspector">Inspector *</Label>
            <Input
              id="inventoryInspector"
              value={inventoryForm.inspector}
              onChange={(e) =>
                setInventoryForm((prev) => ({ ...prev, inspector: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowInventoryModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Inventory'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Generate Receipt"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleGenerateReceipt({
              receiptNumber: formData.get('receiptNumber'),
              date: formData.get('date'),
              landlord: formData.get('landlord'),
              property: formData.get('property'),
              tenant: formData.get('tenant'),
              amount: parseFloat(formData.get('amount') as string),
              period: formData.get('period'),
              description: formData.get('description'),
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="receiptNumber">Receipt Number</Label>
            <Input id="receiptNumber" name="receiptNumber" placeholder="Auto-generated if empty" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptDate">Date *</Label>
            <Input id="receiptDate" name="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptLandlord">Landlord *</Label>
            <Input id="receiptLandlord" name="landlord" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptProperty">Property *</Label>
            <Input id="receiptProperty" name="property" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptTenant">Tenant *</Label>
            <Input id="receiptTenant" name="tenant" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptAmount">Amount (XOF) *</Label>
            <Input id="receiptAmount" name="amount" type="number" min="0" step="0.01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptPeriod">Period</Label>
            <Input id="receiptPeriod" name="period" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiptDescription">Description</Label>
            <textarea
              id="receiptDescription"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowReceiptModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Generate Receipt</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default LandlordDashboard;
