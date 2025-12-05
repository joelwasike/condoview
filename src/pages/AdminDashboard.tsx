import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { adminService } from '@/services/admin';
import { messagingService } from '@/services/messaging';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import {
  FileText,
  Mail,
  Send,
  DollarSign,
  Bell,
  TrendingUp,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Check,
  X,
  Search,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [inboxDocs, setInboxDocs] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [utilities, setUtilities] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [leases, setLeases] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  // Filters
  const [documentStatusFilter, setDocumentStatusFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [documentTenantFilter, setDocumentTenantFilter] = useState('');
  const [utilityStatusFilter, setUtilityStatusFilter] = useState('');

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
        inboxData,
        documentsData,
        utilitiesData,
        debtsData,
        remindersData,
        leasesData,
        adsData,
      ] = await Promise.all([
        adminService.getOverview().catch(() => null),
        adminService.getInbox().catch(() => []),
        adminService
          .getDocuments({
            status: documentStatusFilter || undefined,
            tenant: documentTenantFilter || undefined,
            type: documentTypeFilter || undefined,
          })
          .catch(() => []),
        adminService
          .getUtilities({
            status: utilityStatusFilter || undefined,
          })
          .catch(() => []),
        adminService.getDebts().catch(() => []),
        adminService.getReminders().catch(() => []),
        adminService.getLeases().catch(() => []),
        adminService.getAdvertisements().catch(() => []),
      ]);

      setOverviewData(overview);
      setInboxDocs(Array.isArray(inboxData) ? inboxData : []);
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
      setUtilities(Array.isArray(utilitiesData) ? utilitiesData : []);
      setDebts(Array.isArray(debtsData) ? debtsData : []);
      setReminders(Array.isArray(remindersData) ? remindersData : []);
      setLeases(Array.isArray(leasesData) ? leasesData : []);
      setAdvertisements(Array.isArray(adsData) ? adsData : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [documentStatusFilter, documentTypeFilter, documentTenantFilter, utilityStatusFilter, toast]);

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
      adminService
        .getAdvertisements()
        .then((ads) => setAdvertisements(Array.isArray(ads) ? ads : []))
        .catch(() => {});
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'chat') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  const handleForwardInbox = async (id: string) => {
    try {
      await adminService.forwardInbox(id);
      toast({
        title: 'Success',
        description: 'Document forwarded successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to forward document',
        variant: 'destructive',
      });
    }
  };

  const handleApproveDocument = async (id: string) => {
    try {
      await adminService.approveDocument(id);
      toast({
        title: 'Success',
        description: 'Document approved successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve document',
        variant: 'destructive',
      });
    }
  };

  const handleRejectDocument = async () => {
    if (!rejectingDocId || !rejectionReason.trim()) {
      toast({
        title: 'Warning',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }
    try {
      await adminService.rejectDocument(rejectingDocId, rejectionReason);
      toast({
        title: 'Success',
        description: 'Document rejected successfully',
      });
      setShowRejectModal(false);
      setRejectingDocId(null);
      setRejectionReason('');
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject document',
        variant: 'destructive',
      });
    }
  };

  const handleFollowUpDocument = async (id: string) => {
    try {
      await adminService.followUpDocument(id);
      toast({
        title: 'Success',
        description: 'Follow-up initiated successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate follow-up',
        variant: 'destructive',
      });
    }
  };

  const handleSendToUtility = async (id: string) => {
    try {
      await adminService.sendToUtility(id);
      toast({
        title: 'Success',
        description: 'Document sent to utility successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send to utility',
        variant: 'destructive',
      });
    }
  };

  const handleTransferUtility = async (id: string) => {
    try {
      await adminService.transferUtility(id);
      toast({
        title: 'Success',
        description: 'Utility transfer completed successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to transfer utility',
        variant: 'destructive',
      });
    }
  };

  const handleRemindDebt = async (id: string) => {
    try {
      await adminService.remindDebt(id);
      toast({
        title: 'Success',
        description: 'Reminder sent successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reminder',
        variant: 'destructive',
      });
    }
  };

  const handleMarkDebtPaid = async (id: string) => {
    try {
      await adminService.markDebtPaid(id);
      toast({
        title: 'Success',
        description: 'Debt marked as paid successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark debt as paid',
        variant: 'destructive',
      });
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createReminder(reminderForm);
      toast({
        title: 'Success',
        description: 'Reminder created successfully',
      });
      setShowReminderModal(false);
      setReminderForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create reminder',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await adminService.deleteReminder(id);
        toast({
          title: 'Success',
          description: 'Reminder deleted successfully',
        });
        loadData();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete reminder',
          variant: 'destructive',
        });
      }
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
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = currentUser.name || currentUser.Name || 'Administrator';

  return (
    <DashboardLayout title="Administrative Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-11 mb-6">
          <TabsTrigger value="overview">
            <FileText className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="inbox">
            <Mail className="w-4 h-4 mr-2" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="utilities">
            <Send className="w-4 h-4 mr-2" />
            Utilities
          </TabsTrigger>
          <TabsTrigger value="debt">
            <DollarSign className="w-4 h-4 mr-2" />
            Debt
          </TabsTrigger>
          <TabsTrigger value="reminders">
            <Bell className="w-4 h-4 mr-2" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="leases">
            <FileText className="w-4 h-4 mr-2" />
            Leases
          </TabsTrigger>
          <TabsTrigger value="automation">
            <TrendingUp className="w-4 h-4 mr-2" />
            Automation
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
                  title="Files Received"
                  value={stats.totalFilesReceived || 0}
                  subtitle="Total documents"
                  variant="primary"
                />
                <StatCard
                  title="Files Approved"
                  value={stats.filesApproved || 0}
                  subtitle="Approved documents"
                />
                <StatCard
                  title="Pending Review"
                  value={stats.filesPending || 0}
                  subtitle="Awaiting review"
                />
                <StatCard
                  title="Files Rejected"
                  value={stats.filesRejected || 0}
                  subtitle="Rejected documents"
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your administrative operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:bg-muted" onClick={() => setActiveTab('inbox')}>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Average Approval Time</div>
                        <div className="text-2xl font-bold">
                          {stats.averageApprovalTimeHours ? `${stats.averageApprovalTimeHours.toFixed(1)}h` : '0h'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-muted" onClick={() => setActiveTab('reminders')}>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Pending Follow-ups</div>
                        <div className="text-2xl font-bold">{stats.pendingFollowUpCount || 0}</div>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-muted" onClick={() => setActiveTab('utilities')}>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Utility Documents</div>
                        <div className="text-2xl font-bold">{stats.utilityDocumentsSent || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="inbox" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Received Documents</CardTitle>
              <CardDescription>Incoming tenant documents (email/inbox)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading inbox documents...</div>
              ) : inboxDocs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No documents in inbox</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboxDocs.map((doc, index) => (
                      <TableRow key={doc.id || `doc-${index}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{doc.tenant || 'Unknown Tenant'}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.reference || doc.id || 'No reference'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{doc.type || 'Unknown Type'}</TableCell>
                        <TableCell>{doc.from || 'Unknown'}</TableCell>
                        <TableCell>{doc.date || 'Unknown Date'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (doc.status || 'new').toLowerCase() === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {doc.status || 'New'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleForwardInbox(doc.id)}
                              disabled={loading}
                            >
                              Forward
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

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>Review and approve tenant documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <select
                  value={documentStatusFilter}
                  onChange={(e) => setDocumentStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Documents</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select
                  value={documentTypeFilter}
                  onChange={(e) => setDocumentTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="ID">ID Documents</option>
                  <option value="Income">Income Proof</option>
                  <option value="Reference">References</option>
                </select>
                <Input
                  placeholder="Search by tenant name..."
                  value={documentTenantFilter}
                  onChange={(e) => setDocumentTenantFilter(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No documents pending review</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc, index) => (
                      <TableRow key={doc.id || `document-${index}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{doc.tenant || 'Unknown Tenant'}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.email || doc.reference || 'No reference'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{doc.documentType || doc.type || 'Document'}</div>
                            <div className="text-sm text-muted-foreground">{doc.category || 'General'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{doc.submittedAt || doc.date || 'Unknown'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (doc.status || 'pending').toLowerCase() === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : (doc.status || 'pending').toLowerCase() === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {doc.status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveDocument(doc.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setRejectingDocId(doc.id);
                                setShowRejectModal(true);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFollowUpDocument(doc.id)}
                            >
                              Follow-up
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendToUtility(doc.id)}
                            >
                              Utility
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

        <TabsContent value="utilities" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>CIE / SODECI Transfers</CardTitle>
                  <CardDescription>Send tenant and lease details to utility companies</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    toast({
                      title: 'Info',
                      description: 'Batch export started',
                    })
                  }
                  disabled={loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Batch
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <select
                  value={utilityStatusFilter}
                  onChange={(e) => setUtilityStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="Sent">Sent</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
              {utilities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No pending transfers</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Utility Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilities.map((item, index) => (
                      <TableRow key={item.id || `utility-${index}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.tenant || 'Unknown Tenant'}</div>
                            <div className="text-sm text-muted-foreground">{item.email || item.phone || '—'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.property || 'Unknown property'}</div>
                            <div className="text-sm text-muted-foreground">{item.city || item.reference || '—'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.utilityAccount || item.meter || '—'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (item.status || 'ready').toLowerCase() === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.status || 'Ready'}
                          </span>
                        </TableCell>
                        <TableCell>{item.scheduled || item.date || '—'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleTransferUtility(item.id)}>
                            Transfer
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

        <TabsContent value="debt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debt Collection</CardTitle>
              <CardDescription>Track overdue balances and manage collections</CardDescription>
            </CardHeader>
            <CardContent>
              {debts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No outstanding debts</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt, index) => (
                      <TableRow key={debt.id || `debt-${index}`}>
                        <TableCell>{debt.tenant || 'Unknown Tenant'}</TableCell>
                        <TableCell>{debt.property || 'Unknown Property'}</TableCell>
                        <TableCell>
                          {(debt.amount || 0).toLocaleString()} {debt.currency || 'XOF'}
                        </TableCell>
                        <TableCell>{debt.dueDate || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (debt.status || 'overdue').toLowerCase() === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {debt.status || 'Overdue'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleRemindDebt(debt.id)}>
                              Remind
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleMarkDebtPaid(debt.id)}>
                              Mark Paid
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

        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Reminders</CardTitle>
                <Button onClick={() => setShowReminderModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No reminders scheduled</div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder, index) => (
                    <Card key={reminder.id || `reminder-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg">{reminder.title || 'Untitled Reminder'}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {reminder.description || 'No description'}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                              Due: {reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leases</CardTitle>
              <CardDescription>Manage lease agreements and documents</CardDescription>
            </CardHeader>
            <CardContent>
              {leases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No leases found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leases.map((lease, index) => (
                      <TableRow key={lease.id || `lease-${index}`}>
                        <TableCell>{lease.tenant || 'Unknown Tenant'}</TableCell>
                        <TableCell>{lease.property || 'Unknown Property'}</TableCell>
                        <TableCell>
                          {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (lease.status || 'active').toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {lease.status || 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              adminService
                                .generateLeaseDocument(lease.id)
                                .then(() =>
                                  toast({
                                    title: 'Success',
                                    description: 'Lease document generated successfully',
                                  })
                                )
                                .catch((err) =>
                                  toast({
                                    title: 'Error',
                                    description: err.message || 'Failed to generate document',
                                    variant: 'destructive',
                                  })
                                )
                            }
                          >
                            Generate
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

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation & Reports</CardTitle>
              <CardDescription>Configure automated workflows and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Automation features coming soon
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

      {/* Reject Document Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectingDocId(null);
          setRejectionReason('');
        }}
        title="Reject Document"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRejectDocument();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Rejection Reason *</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              required
              placeholder="Please provide a reason for rejection..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectingDocId(null);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Reject Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Reminder Modal */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false);
          setReminderForm({
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
          });
        }}
        title="Create Reminder"
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderTitle">Title *</Label>
            <Input
              id="reminderTitle"
              value={reminderForm.title}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminderDescription">Description</Label>
            <Textarea
              id="reminderDescription"
              value={reminderForm.description}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminderDueDate">Due Date *</Label>
            <Input
              id="reminderDueDate"
              type="date"
              value={reminderForm.dueDate}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminderPriority">Priority</Label>
            <select
              id="reminderPriority"
              value={reminderForm.priority}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowReminderModal(false);
                setReminderForm({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'medium',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Reminder</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
