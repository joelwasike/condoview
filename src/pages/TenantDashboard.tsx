import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { tenantService } from '@/services/tenant';
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
  DollarSign,
  Wrench,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Download,
  X,
  CreditCard,
  FileX,
  UserPlus,
  Camera,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const TenantDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [leaseInfo, setLeaseInfo] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTerminateLeaseModal, setShowTerminateLeaseModal] = useState(false);
  const [showTransferPaymentModal, setShowTransferPaymentModal] = useState(false);
  const [showDepositPaymentModal, setShowDepositPaymentModal] = useState(false);

  // Forms
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    photos: [] as any[],
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    reference: '',
  });
  const [terminateLeaseForm, setTerminateLeaseForm] = useState({
    reason: '',
    terminationDate: '',
    comments: '',
    securityDepositRefundMethod: '',
    inventoryCheckDate: '',
  });
  const [transferPaymentForm, setTransferPaymentForm] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    relationship: '',
    recipientIdCard: '',
    entryDate: '',
    reason: '',
  });
  const [depositPaymentForm, setDepositPaymentForm] = useState({
    property: '',
    tenantType: 'individual',
    monthlyRent: '',
    paymentMethod: 'mobile_money',
    reference: '',
    notes: '',
  });

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
      const [overview, paymentsData, maintenanceData, lease] = await Promise.all([
        tenantService.getOverview().catch(() => null),
        tenantService.listPayments().catch(() => []),
        tenantService.listMaintenance().catch(() => []),
        tenantService.getLeaseInfo().catch(() => null),
      ]);

      setOverviewData(overview);
      setLeaseInfo(lease);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setMaintenanceRequests(Array.isArray(maintenanceData) ? maintenanceData : []);
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
      const ads = await tenantService.getAdvertisements();
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

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const maintenanceData = {
        property: leaseInfo?.property || 'Apartment 4B, 123 Main St',
        title: maintenanceForm.title,
        description: maintenanceForm.description,
        priority: maintenanceForm.priority,
        tenant: user?.name || 'Current Tenant',
      };
      await tenantService.createMaintenance(maintenanceData);
      toast({
        title: 'Success',
        description: 'Maintenance request submitted successfully!',
      });
      setMaintenanceForm({ title: '', description: '', priority: 'medium', photos: [] });
      setShowMaintenanceModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit maintenance request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const property = leaseInfo?.property || overviewData?.lease?.property || 'Apartment 4B, 123 Main St';
      const paymentData = {
        Tenant: user?.name || 'Current Tenant',
        Property: property,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.paymentMethod,
        chargeType: 'rent',
        reference: paymentForm.reference,
      };
      await tenantService.recordPayment(paymentData);
      toast({
        title: 'Success',
        description: 'Payment submitted successfully!',
      });
      setPaymentForm({ amount: '', paymentMethod: '', reference: '' });
      setShowPaymentModal(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit payment',
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

  const downloadReceipt = async (paymentId: string) => {
    try {
      await tenantService.generateReceipt(paymentId);
      toast({
        title: 'Success',
        description: 'Receipt downloaded successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download receipt',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout title="Tenant Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview">
            <Home className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="w-4 h-4 mr-2" />
            Maintenance
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Next Rent Due"
                  value={`${overviewData?.nextRentDue?.amount || 1500} XOF`}
                  subtitle={`Due: ${overviewData?.nextRentDue?.date || '2024-11-01'}`}
                  variant="primary"
                />
                <StatCard
                  title="Current Lease"
                  value={overviewData?.lease?.property ? 'Active' : 'N/A'}
                  subtitle={overviewData?.lease?.property || 'No active lease'}
                />
                <StatCard
                  title="Open Maintenance"
                  value={overviewData?.openMaintenanceTickets || maintenanceRequests.length}
                  subtitle="Active requests"
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {overviewData?.tenant || user?.name || 'Tenant'}!</CardTitle>
                  <CardDescription>Manage your lease, payments, and maintenance requests</CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Management</CardTitle>
                  <CardDescription>Make payments and view your payment history</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowPaymentModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                  <Button variant="destructive" onClick={() => setShowTerminateLeaseModal(true)}>
                    <FileX className="w-4 h-4 mr-2" />
                    Terminate Lease
                  </Button>
                  <Button variant="outline" onClick={() => setShowTransferPaymentModal(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Transfer Payment
                  </Button>
                  <Button variant="outline" onClick={() => setShowDepositPaymentModal(true)}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Deposit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payments found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => {
                      const paymentId = payment.ID || payment.id;
                      const paymentDate = payment.Date || payment.date || payment.createdAt;
                      const chargeType = payment.ChargeType || payment.chargeType || 'Rent';
                      const amount = payment.Amount || payment.amount || 0;
                      const method = payment.Method || payment.method || 'N/A';
                      const status = payment.Status || payment.status || 'Pending';
                      return (
                        <TableRow key={paymentId || `payment-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {paymentDate ? new Date(paymentDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{chargeType}</div>
                              {payment.reference && (
                                <div className="text-sm text-muted-foreground">Ref: {payment.reference}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {typeof amount === 'number' ? amount.toLocaleString() : amount} XOF
                          </TableCell>
                          <TableCell>{method}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                status.toLowerCase() === 'approved' || status.toLowerCase() === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : status.toLowerCase() === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadReceipt(paymentId)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
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

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Maintenance Requests</CardTitle>
                  <CardDescription>Submit new requests or check the status of existing ones</CardDescription>
                </div>
                <Button onClick={() => setShowMaintenanceModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading maintenance requests...</div>
              ) : maintenanceRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No maintenance requests found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRequests.map((request, index) => (
                      <TableRow key={request.ID || request.id || `request-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {request.Issue || request.Title || request.title || 'Maintenance Request'}
                            </div>
                            {request.Description && (
                              <div className="text-sm text-muted-foreground">{request.Description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (request.Priority || request.priority || 'medium').toLowerCase() === 'high' ||
                              (request.Priority || request.priority || 'medium').toLowerCase() === 'emergency'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {request.Priority || request.priority || 'Medium'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            request.Date || request.date || request.CreatedAt || request.createdAt
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (request.Status || request.status || 'pending').toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {request.Status || request.status || 'Pending'}
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

        <TabsContent value="advertisements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertisements</CardTitle>
              <CardDescription>View active advertisements posted by Super Admin</CardDescription>
            </CardHeader>
            <CardContent>
              {advertisements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active advertisements available at this time.
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
                            {ad.Text || ad.text || ad.description || ad.Description || 'No description available'}
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
                          user.userId === selectedUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'
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

      {/* Maintenance Modal */}
      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        title="Submit Maintenance Request"
        size="lg"
      >
        <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={maintenanceForm.title}
              onChange={(e) =>
                setMaintenanceForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Leaky faucet in kitchen"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <select
              id="priority"
              value={maintenanceForm.priority}
              onChange={(e) =>
                setMaintenanceForm((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="low">Low - Can wait</option>
              <option value="medium">Medium - Should be fixed soon</option>
              <option value="high">High - Urgent</option>
              <option value="emergency">Emergency - Immediate attention needed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={maintenanceForm.description}
              onChange={(e) =>
                setMaintenanceForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Please describe the issue in detail..."
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowMaintenanceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Make Payment"
        size="md"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <select
              id="paymentMethod"
              value={paymentForm.paymentMethod}
              onChange={(e) =>
                setPaymentForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select payment method</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              value={paymentForm.reference}
              onChange={(e) =>
                setPaymentForm((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder="Enter transaction reference"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Terminate Lease Modal */}
      <Modal
        isOpen={showTerminateLeaseModal}
        onClose={() => setShowTerminateLeaseModal(false)}
        title="Terminate My Lease"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              await tenantService.terminateLease(terminateLeaseForm);
              toast({
                title: 'Success',
                description: 'Lease termination request submitted successfully!',
              });
              setTerminateLeaseForm({
                reason: '',
                terminationDate: '',
                comments: '',
                securityDepositRefundMethod: '',
                inventoryCheckDate: '',
              });
              setShowTerminateLeaseModal(false);
            } catch (error: any) {
              toast({
                title: 'Error',
                description: error.message || 'Failed to submit lease termination request',
                variant: 'destructive',
              });
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Termination *</Label>
            <select
              id="reason"
              value={terminateLeaseForm.reason}
              onChange={(e) =>
                setTerminateLeaseForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a reason</option>
              <option value="moving_out">Moving Out</option>
              <option value="job_relocation">Job Relocation</option>
              <option value="financial_hardship">Financial Hardship</option>
              <option value="property_issues">Property Issues</option>
              <option value="lease_expiry">Lease Expiry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terminationDate">Desired Termination Date *</Label>
            <Input
              id="terminationDate"
              type="date"
              value={terminateLeaseForm.terminationDate}
              onChange={(e) =>
                setTerminateLeaseForm((prev) => ({ ...prev, terminationDate: e.target.value }))
              }
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <textarea
              id="comments"
              value={terminateLeaseForm.comments}
              onChange={(e) =>
                setTerminateLeaseForm((prev) => ({ ...prev, comments: e.target.value }))
              }
              placeholder="Provide any additional details..."
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="securityDepositRefundMethod">Security Deposit Refund Method *</Label>
            <select
              id="securityDepositRefundMethod"
              value={terminateLeaseForm.securityDepositRefundMethod}
              onChange={(e) =>
                setTerminateLeaseForm((prev) => ({ ...prev, securityDepositRefundMethod: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select payment method</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventoryCheckDate">Inventory Check Date *</Label>
            <Input
              id="inventoryCheckDate"
              type="date"
              value={terminateLeaseForm.inventoryCheckDate}
              onChange={(e) =>
                setTerminateLeaseForm((prev) => ({ ...prev, inventoryCheckDate: e.target.value }))
              }
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowTerminateLeaseModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Termination Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Transfer Payment Modal */}
      <Modal
        isOpen={showTransferPaymentModal}
        onClose={() => setShowTransferPaymentModal(false)}
        title="Transfer Payment Request"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              const property = leaseInfo?.property || leaseInfo?.address || '';
              await tenantService.transferPaymentRequest({
                ...transferPaymentForm,
                property: property,
              });
              toast({
                title: 'Success',
                description: 'Payment transfer request submitted successfully!',
              });
              setTransferPaymentForm({
                recipientName: '',
                recipientEmail: '',
                recipientPhone: '',
                relationship: '',
                recipientIdCard: '',
                entryDate: '',
                reason: '',
              });
              setShowTransferPaymentModal(false);
            } catch (error: any) {
              toast({
                title: 'Error',
                description: error.message || 'Failed to submit payment transfer request',
                variant: 'destructive',
              });
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name *</Label>
            <Input
              id="recipientName"
              value={transferPaymentForm.recipientName}
              onChange={(e) =>
                setTransferPaymentForm((prev) => ({ ...prev, recipientName: e.target.value }))
              }
              placeholder="Enter recipient's full name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={transferPaymentForm.recipientEmail}
                onChange={(e) =>
                  setTransferPaymentForm((prev) => ({ ...prev, recipientEmail: e.target.value }))
                }
                placeholder="recipient@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Recipient Phone *</Label>
              <Input
                id="recipientPhone"
                type="tel"
                value={transferPaymentForm.recipientPhone}
                onChange={(e) =>
                  setTransferPaymentForm((prev) => ({ ...prev, recipientPhone: e.target.value }))
                }
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <select
                id="relationship"
                value={transferPaymentForm.relationship}
                onChange={(e) =>
                  setTransferPaymentForm((prev) => ({ ...prev, relationship: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select relationship</option>
                <option value="family_member">Family Member</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="parent">Parent</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientIdCard">Recipient ID Card Number *</Label>
              <Input
                id="recipientIdCard"
                value={transferPaymentForm.recipientIdCard}
                onChange={(e) =>
                  setTransferPaymentForm((prev) => ({ ...prev, recipientIdCard: e.target.value }))
                }
                placeholder="Enter recipient's ID card number"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryDate">Date When Recipient Will Enter *</Label>
            <Input
              id="entryDate"
              type="date"
              value={transferPaymentForm.entryDate}
              onChange={(e) =>
                setTransferPaymentForm((prev) => ({ ...prev, entryDate: e.target.value }))
              }
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Transfer *</Label>
            <textarea
              id="reason"
              value={transferPaymentForm.reason}
              onChange={(e) =>
                setTransferPaymentForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Explain why you're transferring this payment request..."
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowTransferPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Transfer Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deposit Payment Modal */}
      <Modal
        isOpen={showDepositPaymentModal}
        onClose={() => setShowDepositPaymentModal(false)}
        title="Pay Security Deposit"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              const calculatedAmount =
                parseFloat(depositPaymentForm.monthlyRent) *
                (depositPaymentForm.tenantType === 'company'
                  ? 3
                  : depositPaymentForm.property.toLowerCase().includes('house') ||
                      depositPaymentForm.property.toLowerCase().includes('villa')
                    ? 5
                    : 2);
              await tenantService.paySecurityDeposit({
                ...depositPaymentForm,
                monthlyRent: parseFloat(depositPaymentForm.monthlyRent),
                leaseId: leaseInfo?.leaseId || leaseInfo?.id,
              });
              toast({
                title: 'Success',
                description: `Security deposit payment submitted: ${calculatedAmount.toFixed(2)} XOF. Awaiting approval.`,
              });
              setShowDepositPaymentModal(false);
              setDepositPaymentForm({
                property: '',
                tenantType: 'individual',
                monthlyRent: '',
                paymentMethod: 'mobile_money',
                reference: '',
                notes: '',
              });
            } catch (error: any) {
              toast({
                title: 'Error',
                description: error.message || 'Failed to submit deposit payment',
                variant: 'destructive',
              });
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="depositProperty">Property *</Label>
            <Input
              id="depositProperty"
              value={depositPaymentForm.property}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, property: e.target.value }))
              }
              required
              placeholder="e.g., Apartment 4B or House 123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositTenantType">Tenant Type *</Label>
            <select
              id="depositTenantType"
              value={depositPaymentForm.tenantType}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, tenantType: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositMonthlyRent">Monthly Rent (XOF) *</Label>
            <Input
              id="depositMonthlyRent"
              type="number"
              step="0.01"
              value={depositPaymentForm.monthlyRent}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, monthlyRent: e.target.value }))
              }
              required
              placeholder="0.00"
            />
            {depositPaymentForm.monthlyRent && (
              <p className="text-sm text-green-600 font-semibold">
                Deposit Amount:{' '}
                {(
                  parseFloat(depositPaymentForm.monthlyRent) *
                  (depositPaymentForm.tenantType === 'company'
                    ? 3
                    : depositPaymentForm.property.toLowerCase().includes('house') ||
                        depositPaymentForm.property.toLowerCase().includes('villa')
                      ? 5
                      : 2)
                ).toFixed(2)}{' '}
                XOF
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositPaymentMethod">Payment Method *</Label>
            <select
              id="depositPaymentMethod"
              value={depositPaymentForm.paymentMethod}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositReference">Reference</Label>
            <Input
              id="depositReference"
              value={depositPaymentForm.reference}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder="Payment reference number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositNotes">Notes</Label>
            <textarea
              id="depositNotes"
              value={depositPaymentForm.notes}
              onChange={(e) =>
                setDepositPaymentForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowDepositPaymentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default TenantDashboard;
