import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { commercialService } from '@/services/commercial';
import { messagingService } from '@/services/messaging';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import {
  Building,
  Calendar,
  FileText,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const CommercialDashboard = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showListingModal, setShowListingModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Forms
  const [listingForm, setListingForm] = useState({
    property: '',
    type: '',
    price: '',
    description: '',
    status: 'active',
  });
  const [visitForm, setVisitForm] = useState({
    property: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    scheduledDate: '',
    notes: '',
  });
  const [requestForm, setRequestForm] = useState({
    property: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
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
      const [overview, listingsData, visitsData, requestsData] = await Promise.all([
        commercialService.getOverview().catch(() => null),
        commercialService.listListings().catch(() => []),
        commercialService.listVisits().catch(() => []),
        commercialService.listRequests().catch(() => []),
      ]);

      setOverviewData(overview);
      setListings(Array.isArray(listingsData) ? listingsData : []);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
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
      const ads = await commercialService.getAdvertisements();
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await commercialService.createListing(listingForm);
      toast({
        title: 'Success',
        description: 'Listing created successfully',
      });
      setShowListingModal(false);
      setListingForm({
        property: '',
        type: '',
        price: '',
        description: '',
        status: 'active',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create listing',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await commercialService.scheduleVisit(visitForm);
      toast({
        title: 'Success',
        description: 'Visit scheduled successfully',
      });
      setShowVisitModal(false);
      setVisitForm({
        property: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        scheduledDate: '',
        notes: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule visit',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await commercialService.createVisitRequest(requestForm);
      toast({
        title: 'Success',
        description: 'Visit request created successfully',
      });
      setShowRequestModal(false);
      setRequestForm({
        property: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        message: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, status: string) => {
    try {
      await commercialService.updateVisitStatus(visitId, status);
      toast({
        title: 'Success',
        description: 'Visit status updated successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update visit status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    try {
      await commercialService.updateVisitRequest(requestId, status);
      toast({
        title: 'Success',
        description: 'Request status updated successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update request status',
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

  const stats = overviewData || {};

  return (
    <DashboardLayout title="Commercial Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="overview">
            <Building className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="listings">
            <FileText className="w-4 h-4 mr-2" />
            Listings
          </TabsTrigger>
          <TabsTrigger value="visits">
            <Calendar className="w-4 h-4 mr-2" />
            Visits
          </TabsTrigger>
          <TabsTrigger value="requests">
            <FileText className="w-4 h-4 mr-2" />
            Requests
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
                  title="Active Listings"
                  value={stats.activeListings || listings.length || 0}
                  subtitle="Properties listed"
                  variant="primary"
                />
                <StatCard
                  title="Scheduled Visits"
                  value={stats.scheduledVisits || visits.length || 0}
                  subtitle="Upcoming visits"
                />
                <StatCard
                  title="Interested Clients"
                  value={stats.interestedClients || requests.length || 0}
                  subtitle="Potential clients"
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>Manage commercial property listings</CardDescription>
                </div>
                <Button onClick={() => setShowListingModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {listings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No listings found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing, index) => (
                      <TableRow key={listing.id || listing.ID || `listing-${index}`}>
                        <TableCell>{listing.property || listing.Property || 'N/A'}</TableCell>
                        <TableCell>{listing.type || listing.Type || 'N/A'}</TableCell>
                        <TableCell>
                          {(listing.price || listing.Price || 0).toLocaleString()} XOF
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (listing.status || listing.Status || 'active').toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {listing.status || listing.Status || 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
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

        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scheduled Visits</CardTitle>
                  <CardDescription>Manage property visits</CardDescription>
                </div>
                <Button onClick={() => setShowVisitModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No visits scheduled</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.map((visit, index) => (
                      <TableRow key={visit.id || visit.ID || `visit-${index}`}>
                        <TableCell>{visit.property || visit.Property || 'N/A'}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{visit.clientName || visit.ClientName || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {visit.clientEmail || visit.ClientEmail || ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {visit.scheduledDate || visit.ScheduledDate
                            ? new Date(visit.scheduledDate || visit.ScheduledDate).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (visit.status || visit.Status || 'scheduled').toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : (visit.status || visit.Status || 'scheduled').toLowerCase() === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {visit.status || visit.Status || 'Scheduled'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateVisitStatus(visit.id || visit.ID, 'completed')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateVisitStatus(visit.id || visit.ID, 'cancelled')}
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
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Visit Requests</CardTitle>
                  <CardDescription>Manage client visit requests</CardDescription>
                </div>
                <Button onClick={() => setShowRequestModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No requests found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request, index) => (
                      <TableRow key={request.id || request.ID || `request-${index}`}>
                        <TableCell>{request.property || request.Property || 'N/A'}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.clientName || request.ClientName || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.clientEmail || request.ClientEmail || ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.message || request.Message || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (request.status || request.Status || 'pending').toLowerCase() === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : (request.status || request.Status || 'pending').toLowerCase() === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {request.status || request.Status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateRequestStatus(request.id || request.ID, 'approved')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateRequestStatus(request.id || request.ID, 'rejected')}
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

      {/* Create Listing Modal */}
      <Modal
        isOpen={showListingModal}
        onClose={() => setShowListingModal(false)}
        title="Create Listing"
        size="lg"
      >
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="listingProperty">Property *</Label>
            <Input
              id="listingProperty"
              value={listingForm.property}
              onChange={(e) => setListingForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listingType">Type *</Label>
              <select
                id="listingType"
                value={listingForm.type}
                onChange={(e) => setListingForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="listingPrice">Price (XOF) *</Label>
              <Input
                id="listingPrice"
                type="number"
                value={listingForm.price}
                onChange={(e) => setListingForm((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="listingDescription">Description</Label>
            <Textarea
              id="listingDescription"
              value={listingForm.description}
              onChange={(e) => setListingForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowListingModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        title="Schedule Visit"
        size="lg"
      >
        <form onSubmit={handleScheduleVisit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitProperty">Property *</Label>
            <Input
              id="visitProperty"
              value={visitForm.property}
              onChange={(e) => setVisitForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={visitForm.clientName}
                onChange={(e) => setVisitForm((prev) => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={visitForm.clientEmail}
                onChange={(e) => setVisitForm((prev) => ({ ...prev, clientEmail: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone *</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={visitForm.clientPhone}
                onChange={(e) => setVisitForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={visitForm.scheduledDate}
                onChange={(e) => setVisitForm((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitNotes">Notes</Label>
            <Textarea
              id="visitNotes"
              value={visitForm.notes}
              onChange={(e) => setVisitForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowVisitModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Visit'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Create Visit Request"
        size="lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestProperty">Property *</Label>
            <Input
              id="requestProperty"
              value={requestForm.property}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestClientName">Client Name *</Label>
              <Input
                id="requestClientName"
                value={requestForm.clientName}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestClientEmail">Client Email *</Label>
              <Input
                id="requestClientEmail"
                type="email"
                value={requestForm.clientEmail}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, clientEmail: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestClientPhone">Client Phone *</Label>
            <Input
              id="requestClientPhone"
              type="tel"
              value={requestForm.clientPhone}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestMessage">Message</Label>
            <Textarea
              id="requestMessage"
              value={requestForm.message}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default CommercialDashboard;
