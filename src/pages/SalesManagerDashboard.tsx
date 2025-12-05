import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { salesManagerService } from '@/services/salesManager';
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
  TrendingUp,
  Building,
  Users,
  AlertTriangle,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  FileSpreadsheet,
  Copy,
  Check,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const SalesManagerDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [waitingListClients, setWaitingListClients] = useState<any[]>([]);
  const [unpaidRents, setUnpaidRents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showTenantCreationModal, setShowTenantCreationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<any>(null);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [showCreatePropertyModal, setShowCreatePropertyModal] = useState(false);
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // Forms
  const [tenantForm, setTenantForm] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    amount: '',
    status: 'Active',
  });
  const [propertyForm, setPropertyForm] = useState({
    address: '',
    type: '',
    status: 'Vacant',
    rent: '',
    bedrooms: '',
    bathrooms: '',
    urgency: 'normal',
    tenant: '',
  });
  const [importMode, setImportMode] = useState<'manual' | 'excel'>('manual');
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // Filters
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [propertyUrgencyFilter, setPropertyUrgencyFilter] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('');
  const [alertTypeFilter, setAlertTypeFilter] = useState('');

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
      const [overview, propertiesData, clientsData, waitingListData, unpaidRentsData, alertsData] = await Promise.all([
        salesManagerService.getOverview().catch(() => null),
        salesManagerService.getProperties({
          status: propertyStatusFilter || undefined,
          type: propertyTypeFilter || undefined,
          urgency: propertyUrgencyFilter || undefined,
        }).catch(() => []),
        salesManagerService.getClients().catch(() => []),
        salesManagerService.getWaitingListClients().catch(() => []),
        salesManagerService.getUnpaidRents().catch(() => []),
        salesManagerService.getAlerts(alertTypeFilter || null).catch(() => []),
      ]);

      setOverviewData(overview);
      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setWaitingListClients(Array.isArray(waitingListData) ? waitingListData : []);
      setUnpaidRents(Array.isArray(unpaidRentsData) ? unpaidRentsData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [propertyStatusFilter, propertyTypeFilter, propertyUrgencyFilter, alertTypeFilter, toast]);

  const loadAdvertisements = useCallback(async () => {
    try {
      const ads = await salesManagerService.getAdvertisements();
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
    if (activeTab === 'advertisements' || activeTab === 'overview') {
      loadAdvertisements();
    }
  }, [activeTab, loadAdvertisements]);

  useEffect(() => {
    if (activeTab === 'chat') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const clientData = {
        name: tenantForm.name.trim(),
        email: tenantForm.email.trim(),
        phone: tenantForm.phone.trim(),
        property: tenantForm.property.trim(),
        amount: tenantForm.amount ? parseFloat(tenantForm.amount) : undefined,
        status: tenantForm.status,
      };
      const result = await salesManagerService.createClient(clientData);
      
      // Show password modal if credentials are returned
      if (result && (result.email || result.password)) {
        setPasswordData({
          type: 'single',
          user: {
            email: result.email || tenantForm.email,
            password: result.password || result.temporaryPassword,
          },
        });
        setShowPasswordModal(true);
      }
      
      toast({
        title: 'Success',
        description: 'Client created successfully!',
      });
      setTenantForm({
        name: '',
        email: '',
        phone: '',
        property: '',
        amount: '',
        status: 'Active',
      });
      setShowTenantCreationModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create client',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportClients = async () => {
    if (!excelFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to import',
        variant: 'destructive',
      });
      return;
    }
    try {
      setLoading(true);
      const result = await salesManagerService.importClientsFromExcel(excelFile);
      
      if (result && result.users && result.users.length > 0) {
        setPasswordData({
          type: 'bulk',
          users: result.users,
        });
        setShowPasswordModal(true);
      }
      
      toast({
        title: 'Success',
        description: `Successfully imported ${result.count || 0} clients!`,
      });
      setExcelFile(null);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to import clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyForm.address || !propertyForm.type || !propertyForm.status || !propertyForm.rent) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    try {
      setLoading(true);
      await salesManagerService.createProperty({
        address: propertyForm.address.trim(),
        type: propertyForm.type.trim(),
        status: propertyForm.status,
        rent: parseFloat(propertyForm.rent),
        bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : undefined,
        bathrooms: propertyForm.bathrooms ? parseFloat(propertyForm.bathrooms) : undefined,
        urgency: propertyForm.urgency,
        tenant: propertyForm.tenant.trim() || null,
      });
      toast({
        title: 'Success',
        description: 'Property created successfully!',
      });
      setPropertyForm({
        address: '',
        type: '',
        status: 'Vacant',
        rent: '',
        bedrooms: '',
        bathrooms: '',
        urgency: 'normal',
        tenant: '',
      });
      setShowCreatePropertyModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlert = async (alertId: string, status: string) => {
    try {
      await salesManagerService.updateAlert(alertId, status);
      toast({
        title: 'Success',
        description: 'Alert updated successfully!',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update alert',
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Success',
        description: 'Copied to clipboard!',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const occupancyRate = overviewData?.globalOccupancyRate || overviewData?.occupancyRate || 0;
  const activeTenants = overviewData?.totalActiveTenants || overviewData?.activeClients || 0;
  const unpaidCount = overviewData?.numberOfUnpaidAccounts || overviewData?.unpaidCount || 0;
  const unpaidAmount = overviewData?.totalUnpaidRentAmount || overviewData?.unpaidAmount || 0;

  return (
    <DashboardLayout title="Sales Manager Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="occupancy">
            <Building className="w-4 h-4 mr-2" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
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
                  title="Occupancy Rate"
                  value={`${occupancyRate.toFixed(0)}%`}
                  subtitle="Properties occupied"
                  variant="primary"
                />
                <StatCard
                  title="Active Tenants"
                  value={activeTenants}
                  subtitle="Current tenants"
                />
                <StatCard
                  title="Unpaid Accounts"
                  value={unpaidCount}
                  subtitle="Requires attention"
                />
                <StatCard
                  title="Total Unpaid"
                  value={`${unpaidAmount.toLocaleString()} XOF`}
                  subtitle="Outstanding balance"
                />
              </div>
              {alerts.filter((a) => (a.Urgency || a.urgency || '').toLowerCase() === 'urgent' || (a.Urgency || a.urgency || '').toLowerCase() === 'high').length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Alerts</CardTitle>
                    <CardDescription>Urgent alerts requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Alert</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Urgency</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alerts
                          .filter(
                            (a) =>
                              (a.Urgency || a.urgency || '').toLowerCase() === 'urgent' ||
                              (a.Urgency || a.urgency || '').toLowerCase() === 'high'
                          )
                          .map((alert) => (
                            <TableRow key={alert.ID || alert.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{alert.Title || alert.title || 'N/A'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {alert.Message || alert.message || 'N/A'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{alert.Property || alert.property || 'N/A'}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (alert.Urgency || alert.urgency || 'normal').toLowerCase() === 'urgent'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {alert.Urgency || alert.urgency || 'Normal'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (alert.Status || alert.status || 'open').toLowerCase() === 'resolved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {alert.Status || alert.status || 'Open'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {alert.Amount || alert.amount
                                  ? `${(alert.Amount || alert.amount).toLocaleString()} XOF`
                                  : '—'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateAlert(alert.ID || alert.id, 'resolved')
                                  }
                                >
                                  Resolve
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Property Occupancy</CardTitle>
                  <CardDescription>Monitor and manage property occupancy status</CardDescription>
                </div>
                <Button onClick={() => setShowCreatePropertyModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <select
                  value={propertyStatusFilter}
                  onChange={(e) => setPropertyStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                </select>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Studio">Studio</option>
                </select>
                <select
                  value={propertyUrgencyFilter}
                  onChange={(e) => setPropertyUrgencyFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Urgency</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
              {properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No properties found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property, index) => (
                      <TableRow key={property.ID || property.id || `property-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{property.Address || property.address || 'N/A'}</TableCell>
                        <TableCell>{property.Type || property.type || 'N/A'}</TableCell>
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
                        <TableCell>
                          {(property.Rent || property.rent || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (property.Urgency || property.urgency || 'normal').toLowerCase() === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : (property.Urgency || property.urgency || 'normal').toLowerCase() === 'high'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {property.Urgency || property.urgency || 'Normal'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProperty(property);
                              setShowEditPropertyModal(true);
                            }}
                          >
                            Edit
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

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tenant Management</CardTitle>
                  <CardDescription>{clients.length} clients found</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportMode('excel')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Import Excel
                  </Button>
                  <Button onClick={() => setShowTenantCreationModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search clients..."
                  className="max-w-xs"
                />
                <select
                  value={clientStatusFilter}
                  onChange={(e) => setClientStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No clients found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client, index) => (
                      <TableRow key={client.ID || client.id || `client-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{client.Name || client.name || 'N/A'}</TableCell>
                        <TableCell>{client.Email || client.email || 'N/A'}</TableCell>
                        <TableCell>{client.Phone || client.phone || 'N/A'}</TableCell>
                        <TableCell>{client.Property || client.property || 'N/A'}</TableCell>
                        <TableCell>
                          {(client.Amount || client.amount || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (client.Status || client.status || 'active').toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {client.Status || client.status || 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingClient(client);
                              setShowEditClientModal(true);
                            }}
                          >
                            Edit
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

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Alerts</CardTitle>
                <select
                  value={alertTypeFilter}
                  onChange={(e) => setAlertTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="unpaid_rent">Unpaid Rent</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No alerts found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.ID || alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{alert.Title || alert.title || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.Message || alert.message || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{alert.Property || alert.property || 'N/A'}</TableCell>
                        <TableCell>{alert.Type || alert.type || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (alert.Urgency || alert.urgency || 'normal').toLowerCase() === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : (alert.Urgency || alert.urgency || 'normal').toLowerCase() === 'high'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {alert.Urgency || alert.urgency || 'Normal'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (alert.Status || alert.status || 'open').toLowerCase() === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {alert.Status || alert.status || 'Open'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {alert.Amount || alert.amount
                            ? `${(alert.Amount || alert.amount).toLocaleString()} XOF`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateAlert(alert.ID || alert.id, 'resolved')}
                          >
                            Resolve
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

      {/* Tenant Creation Modal */}
      <Modal
        isOpen={showTenantCreationModal}
        onClose={() => setShowTenantCreationModal(false)}
        title="Create New Client/Tenant"
        size="lg"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenantName">Name *</Label>
            <Input
              id="tenantName"
              value={tenantForm.name}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantEmail">Email *</Label>
            <Input
              id="tenantEmail"
              type="email"
              value={tenantForm.email}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantPhone">Phone *</Label>
            <Input
              id="tenantPhone"
              value={tenantForm.phone}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantProperty">Property</Label>
            <Input
              id="tenantProperty"
              value={tenantForm.property}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, property: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantAmount">Rent Amount (XOF)</Label>
            <Input
              id="tenantAmount"
              type="number"
              value={tenantForm.amount}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantStatus">Status</Label>
            <select
              id="tenantStatus"
              value={tenantForm.status}
              onChange={(e) => setTenantForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowTenantCreationModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Display Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData(null);
        }}
        title={passwordData?.type === 'bulk' ? 'Bulk Import Credentials' : 'Client Credentials'}
        size="lg"
      >
        {passwordData?.type === 'single' && passwordData.user && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold mb-2">Please save these credentials:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <code className="flex-1 bg-white px-2 py-1 rounded">{passwordData.user.email}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(passwordData.user.email)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Password:</span>
                  <code className="flex-1 bg-white px-2 py-1 rounded font-mono">
                    {passwordData.user.password}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(passwordData.user.password)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData(null);
              }}
            >
              Close
            </Button>
          </div>
        )}
        {passwordData?.type === 'bulk' && passwordData.users && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold mb-4">
                Credentials for {passwordData.users.length} imported users:
              </p>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {passwordData.users.map((u: any, index: number) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Email:</span>
                      <code className="flex-1 bg-gray-50 px-2 py-1 rounded text-sm">
                        {u.email}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(u.email)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Password:</span>
                      <code className="flex-1 bg-gray-50 px-2 py-1 rounded font-mono text-sm">
                        {u.password || u.temporaryPassword}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(u.password || u.temporaryPassword)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData(null);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Excel Import Modal */}
      {importMode === 'excel' && (
        <Modal
          isOpen={importMode === 'excel'}
          onClose={() => {
            setImportMode('manual');
            setExcelFile(null);
          }}
          title="Import Clients from Excel/CSV"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm">
                Upload an Excel (.xlsx, .xls) or CSV file with client data. The file should contain
                columns: Name, Email, Phone, Property, Amount, Status.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excelFile">Select File</Label>
              <Input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setExcelFile(file);
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setImportMode('manual');
                  setExcelFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleImportClients} disabled={!excelFile || loading}>
                {loading ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Property Modal */}
      <Modal
        isOpen={showCreatePropertyModal}
        onClose={() => setShowCreatePropertyModal(false)}
        title="Create Property"
        size="lg"
      >
        <form onSubmit={handleCreateProperty} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propAddress">Address *</Label>
            <Input
              id="propAddress"
              value={propertyForm.address}
              onChange={(e) =>
                setPropertyForm((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propType">Type *</Label>
              <select
                id="propType"
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
              <Label htmlFor="propStatus">Status *</Label>
              <select
                id="propStatus"
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
          <div className="space-y-2">
            <Label htmlFor="propRent">Monthly Rent (XOF) *</Label>
            <Input
              id="propRent"
              type="number"
              value={propertyForm.rent}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, rent: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propBedrooms">Bedrooms</Label>
              <Input
                id="propBedrooms"
                type="number"
                value={propertyForm.bedrooms}
                onChange={(e) =>
                  setPropertyForm((prev) => ({ ...prev, bedrooms: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propBathrooms">Bathrooms</Label>
              <Input
                id="propBathrooms"
                type="number"
                step="0.5"
                value={propertyForm.bathrooms}
                onChange={(e) =>
                  setPropertyForm((prev) => ({ ...prev, bathrooms: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propUrgency">Urgency</Label>
            <select
              id="propUrgency"
              value={propertyForm.urgency}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, urgency: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="normal">Normal</option>
              <option value="low">Low</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propTenant">Tenant (if occupied)</Label>
            <Input
              id="propTenant"
              value={propertyForm.tenant}
              onChange={(e) => setPropertyForm((prev) => ({ ...prev, tenant: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCreatePropertyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default SalesManagerDashboard;
