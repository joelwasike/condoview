import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { agencyDirectorService } from '@/services/agencyDirector';
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
  BarChart3,
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Megaphone,
  MessageCircle,
  CreditCard,
  Settings,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const AgencyDirectorDashboard = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const managementSubTab = searchParams.get('subtab') || 'users';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
  const [accountingData, setAccountingData] = useState<any>(null);
  const [landlordPayments, setLandlordPayments] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // Forms
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'salesmanager',
    password: '',
  });
  const [propertyForm, setPropertyForm] = useState({
    address: '',
    type: '',
    rent: '',
    tenant: '',
    status: 'Vacant',
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    paymentMethod: 'bank_transfer',
    reference: '',
    amount: '',
  });

  // Filters
  const [userSearchText, setUserSearchText] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('');

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

  const setManagementSubTab = (subtab: string) => {
    setSearchParams({ tab: 'management', subtab });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        overview,
        usersData,
        propertiesData,
        financial,
        accounting,
        landlordPaymentsData,
        pendingPaymentsData,
        subscription,
      ] = await Promise.all([
        agencyDirectorService.getOverview().catch(() => null),
        agencyDirectorService.getUsers().catch(() => []),
        agencyDirectorService.getProperties().catch(() => []),
        agencyDirectorService.getFinancialOverview().catch(() => null),
        agencyDirectorService.getAccountingOverview().catch(() => null),
        agencyDirectorService.getLandlordPayments().catch(() => []),
        agencyDirectorService.getPendingPayments().catch(() => []),
        agencyDirectorService.getSubscriptionStatus().catch(() => null),
      ]);

      setOverviewData(overview);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      setFinancialData(financial);
      setAccountingData(accounting);
      setLandlordPayments(Array.isArray(landlordPaymentsData) ? landlordPaymentsData : []);
      setPendingPayments(Array.isArray(pendingPaymentsData) ? pendingPaymentsData : []);
      setSubscriptionStatus(subscription);
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

  const loadAdvertisements = useCallback(async () => {
    try {
      const ads = await agencyDirectorService.getAdvertisements();
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
        const messages = await agencyDirectorService.getConversationWithUser(userId);
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
    if (activeTab === 'advertisements' || activeTab === 'overview') {
      loadAdvertisements();
    }
  }, [activeTab, loadAdvertisements]);

  useEffect(() => {
    if (activeTab === 'messages') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        password: userForm.password,
      };

      if (editingUser) {
        await agencyDirectorService.updateUser(editingUser.id || editingUser.ID, userData);
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await agencyDirectorService.addUser(userData);
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        role: 'salesmanager',
        password: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await agencyDirectorService.deleteUser(userId);
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        loadData();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const propertyData = {
        address: propertyForm.address,
        type: propertyForm.type,
        rent: propertyForm.rent ? parseFloat(propertyForm.rent) : undefined,
        tenant: propertyForm.tenant || null,
        status: propertyForm.status,
      };

      if (editingProperty) {
        await agencyDirectorService.updateProperty(editingProperty.id || editingProperty.ID, propertyData);
        toast({
          title: 'Success',
          description: 'Property updated successfully',
        });
      } else {
        await agencyDirectorService.addProperty(propertyData);
        toast({
          title: 'Success',
          description: 'Property created successfully',
        });
      }
      setShowPropertyModal(false);
      setEditingProperty(null);
      setPropertyForm({
        address: '',
        type: '',
        rent: '',
        tenant: '',
        status: 'Vacant',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await agencyDirectorService.deleteProperty(propertyId);
        toast({
          title: 'Success',
          description: 'Property deleted successfully',
        });
        loadData();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete property',
          variant: 'destructive',
        });
      }
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      await agencyDirectorService.approveTenantPayment(paymentId);
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

  const handleRejectPayment = async (paymentId: string) => {
    try {
      await agencyDirectorService.rejectTenantPayment(paymentId);
      toast({
        title: 'Success',
        description: 'Payment rejected successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject payment',
        variant: 'destructive',
      });
    }
  };

  const handleApproveLandlordPayment = async (paymentId: string) => {
    try {
      await agencyDirectorService.approveLandlordPayment(paymentId);
      toast({
        title: 'Success',
        description: 'Landlord payment approved successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve landlord payment',
        variant: 'destructive',
      });
    }
  };

  const handlePaySubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await agencyDirectorService.paySubscription(subscriptionForm);
      toast({
        title: 'Success',
        description: 'Subscription payment processed successfully',
      });
      setShowSubscriptionModal(false);
      setSubscriptionForm({
        paymentMethod: 'bank_transfer',
        reference: '',
        amount: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process subscription payment',
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
      await agencyDirectorService.sendMessage({
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

  const filteredUsers = users.filter((user) => {
    if (!userSearchText) return true;
    const search = userSearchText.toLowerCase();
    return (
      (user.name || user.Name || '').toLowerCase().includes(search) ||
      (user.email || user.Email || '').toLowerCase().includes(search) ||
      (user.role || user.Role || '').toLowerCase().includes(search)
    );
  });

  const filteredProperties = properties.filter((property) => {
    if (!propertyStatusFilter) return true;
    return (property.status || property.Status || '').toLowerCase() === propertyStatusFilter.toLowerCase();
  });

  const stats = overviewData || {};

  return (
    <DashboardLayout title="Agency Director Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management">
            <Users className="w-4 h-4 mr-2" />
            Management
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Home className="w-4 h-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="accounting">
            <DollarSign className="w-4 h-4 mr-2" />
            Accounting
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="advertisements">
            <Megaphone className="w-4 h-4 mr-2" />
            Ads
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription
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
                  title="Total Users"
                  value={stats.totalUsers || users.length || 0}
                  subtitle="System users"
                  variant="primary"
                />
                <StatCard
                  title="Total Properties"
                  value={stats.totalProperties || properties.length || 0}
                  subtitle="Properties managed"
                />
                <StatCard
                  title="Monthly Revenue"
                  value={`${(stats.monthlyRevenue || financialData?.revenue || 0).toLocaleString()} XOF`}
                  subtitle="Current month"
                />
                <StatCard
                  title="Pending Payments"
                  value={pendingPayments.length || 0}
                  subtitle="Awaiting approval"
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button
                  onClick={() => {
                    setEditingUser(null);
                    setUserForm({
                      name: '',
                      email: '',
                      role: 'salesmanager',
                      password: '',
                    });
                    setShowUserModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search users..."
                  value={userSearchText}
                  onChange={(e) => setUserSearchText(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={user.id || user.ID || `user-${index}`}>
                        <TableCell>{user.name || user.Name || 'N/A'}</TableCell>
                        <TableCell>{user.email || user.Email || 'N/A'}</TableCell>
                        <TableCell>{user.role || user.Role || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setUserForm({
                                  name: user.name || user.Name || '',
                                  email: user.email || user.Email || '',
                                  role: user.role || user.Role || 'salesmanager',
                                  password: '',
                                });
                                setShowUserModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id || user.ID)}
                            >
                              Delete
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

        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Properties</CardTitle>
                  <CardDescription>Manage agency properties</CardDescription>
                </div>
                <div className="flex gap-2">
                  <select
                    value={propertyStatusFilter}
                    onChange={(e) => setPropertyStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                  <Button
                    onClick={() => {
                      setEditingProperty(null);
                      setPropertyForm({
                        address: '',
                        type: '',
                        rent: '',
                        tenant: '',
                        status: 'Vacant',
                      });
                      setShowPropertyModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProperties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No properties found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property, index) => (
                      <TableRow key={property.id || property.ID || `property-${index}`}>
                        <TableCell>{property.address || property.Address || 'N/A'}</TableCell>
                        <TableCell>{property.type || property.Type || 'N/A'}</TableCell>
                        <TableCell>
                          {(property.rent || property.Rent || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>{property.tenant || property.Tenant || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (property.status || property.Status || 'vacant').toLowerCase() === 'occupied'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {property.status || property.Status || 'Vacant'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingProperty(property);
                                setPropertyForm({
                                  address: property.address || property.Address || '',
                                  type: property.type || property.Type || '',
                                  rent: property.rent || property.Rent || '',
                                  tenant: property.tenant || property.Tenant || '',
                                  status: property.status || property.Status || 'Vacant',
                                });
                                setShowPropertyModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProperty(property.id || property.ID)}
                            >
                              Delete
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

        <TabsContent value="accounting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Payments awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No pending payments</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPayments.map((payment, index) => (
                        <TableRow key={payment.id || payment.ID || `payment-${index}`}>
                          <TableCell>{payment.tenant || payment.Tenant || 'N/A'}</TableCell>
                          <TableCell>
                            {(payment.amount || payment.Amount || 0).toLocaleString()} XOF
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePayment(payment.id || payment.ID)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectPayment(payment.id || payment.ID)}
                              >
                                <X className="w-4 h-4" />
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
            <Card>
              <CardHeader>
                <CardTitle>Landlord Payments</CardTitle>
                <CardDescription>Manage landlord payments</CardDescription>
              </CardHeader>
              <CardContent>
                {landlordPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No landlord payments</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Landlord</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {landlordPayments.map((payment, index) => (
                        <TableRow key={payment.id || payment.ID || `landlord-payment-${index}`}>
                          <TableCell>{payment.landlord || payment.Landlord || 'N/A'}</TableCell>
                          <TableCell>
                            {(payment.amount || payment.Amount || 0).toLocaleString()} XOF
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                (payment.status || payment.Status || 'pending').toLowerCase() === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {payment.status || payment.Status || 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {(payment.status || payment.Status || 'pending').toLowerCase() !== 'approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveLandlordPayment(payment.id || payment.ID)}
                              >
                                Approve
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
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>View financial analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              {accountingData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">
                      {(accountingData.totalRevenue || 0).toLocaleString()} XOF
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                    <div className="text-2xl font-bold">
                      {(accountingData.totalExpenses || 0).toLocaleString()} XOF
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Profit</div>
                    <div className="text-2xl font-bold">
                      {(accountingData.netProfit || 0).toLocaleString()} XOF
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No analytics data available</div>
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

        <TabsContent value="messages" className="space-y-6">
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

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>Manage your agency subscription</CardDescription>
                </div>
                <Button onClick={() => setShowSubscriptionModal(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Subscription
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subscriptionStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-lg font-semibold">
                        {subscriptionStatus.status || subscriptionStatus.Status || 'Active'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Next Payment Due</div>
                      <div className="text-lg font-semibold">
                        {subscriptionStatus.nextPaymentDate || subscriptionStatus.NextPaymentDate
                          ? new Date(
                              subscriptionStatus.nextPaymentDate || subscriptionStatus.NextPaymentDate
                            ).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="text-2xl font-bold">
                      {(subscriptionStatus.amount || subscriptionStatus.Amount || 0).toLocaleString()} XOF
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No subscription information available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Profile />
        </TabsContent>
      </Tabs>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
          setUserForm({
            name: '',
            email: '',
            role: 'salesmanager',
            password: '',
          });
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
        size="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Name *</Label>
            <Input
              id="userName"
              value={userForm.name}
              onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email *</Label>
            <Input
              id="userEmail"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Role *</Label>
            <select
              id="userRole"
              value={userForm.role}
              onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="salesmanager">Sales Manager</option>
              <option value="admin">Admin</option>
              <option value="accounting">Accounting</option>
              <option value="technician">Technician</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPassword">
              Password {editingUser ? '(leave blank to keep current)' : '*'}
            </Label>
            <Input
              id="userPassword"
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
              required={!editingUser}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUserModal(false);
                setEditingUser(null);
                setUserForm({
                  name: '',
                  email: '',
                  role: 'salesmanager',
                  password: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Property Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setEditingProperty(null);
          setPropertyForm({
            address: '',
            type: '',
            rent: '',
            tenant: '',
            status: 'Vacant',
          });
        }}
        title={editingProperty ? 'Edit Property' : 'Add Property'}
        size="lg"
      >
        <form onSubmit={handleCreateProperty} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Address *</Label>
            <Input
              id="propertyAddress"
              value={propertyForm.address}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Type *</Label>
              <select
                id="propertyType"
                value={propertyForm.type}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyStatus">Status *</Label>
              <select
                id="propertyStatus"
                value={propertyForm.status}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyRent">Monthly Rent (XOF)</Label>
              <Input
                id="propertyRent"
                type="number"
                value={propertyForm.rent}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, rent: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyTenant">Tenant (if occupied)</Label>
              <Input
                id="propertyTenant"
                value={propertyForm.tenant}
                onChange={(e) => setPropertyForm((prev) => ({ ...prev, tenant: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPropertyModal(false);
                setEditingProperty(null);
                setPropertyForm({
                  address: '',
                  type: '',
                  rent: '',
                  tenant: '',
                  status: 'Vacant',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingProperty ? 'Update' : 'Create'} Property
            </Button>
          </div>
        </form>
      </Modal>

      {/* Subscription Payment Modal */}
      <Modal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setSubscriptionForm({
            paymentMethod: 'bank_transfer',
            reference: '',
            amount: '',
          });
        }}
        title="Pay Subscription"
        size="lg"
      >
        <form onSubmit={handlePaySubscription} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscriptionAmount">Amount (XOF) *</Label>
            <Input
              id="subscriptionAmount"
              type="number"
              value={subscriptionForm.amount}
              onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionMethod">Payment Method *</Label>
            <select
              id="subscriptionMethod"
              value={subscriptionForm.paymentMethod}
              onChange={(e) =>
                setSubscriptionForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionReference">Reference</Label>
            <Input
              id="subscriptionReference"
              value={subscriptionForm.reference}
              onChange={(e) => setSubscriptionForm((prev) => ({ ...prev, reference: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSubscriptionModal(false);
                setSubscriptionForm({
                  paymentMethod: 'bank_transfer',
                  reference: '',
                  amount: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Subscription'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AgencyDirectorDashboard;
