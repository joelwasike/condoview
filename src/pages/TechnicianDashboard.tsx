import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { technicianService } from '@/services/technician';
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
  CheckCircle,
  Calendar,
  Megaphone,
  MessageCircle,
  Settings,
  Plus,
  Upload,
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import Profile from './Profile';

const TechnicianDashboard = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  // Modals
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  // Forms
  const [inspectionForm, setInspectionForm] = useState({
    property: '',
    type: 'routine',
    inspector: '',
    notes: '',
  });
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({
    status: '',
    estimatedHours: '',
    estimatedCost: '',
  });
  const [selectedInspectionForPhoto, setSelectedInspectionForPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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
      const [overview, inspectionData, taskData, requestsData] = await Promise.all([
        technicianService.getOverview().catch(() => null),
        technicianService.listInspections().catch(() => []),
        technicianService.listTasks().catch(() => []),
        technicianService.listMaintenanceRequests().catch(() => []),
      ]);

      setOverviewData(overview);
      setInspections(Array.isArray(inspectionData) ? inspectionData : []);
      setTasks(Array.isArray(taskData) ? taskData : []);
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
      const ads = await technicianService.getAdvertisements();
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

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await technicianService.createInspection(inspectionForm);
      toast({
        title: 'Success',
        description: 'Inspection created successfully',
      });
      setShowInspectionModal(false);
      setInspectionForm({
        property: '',
        type: 'routine',
        inspector: '',
        notes: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create inspection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      setLoading(true);
      await technicianService.updateTask(selectedTask.id || selectedTask.ID, {
        status: taskForm.status,
        estimatedHours: taskForm.estimatedHours ? parseFloat(taskForm.estimatedHours) : undefined,
        estimatedCost: taskForm.estimatedCost ? parseFloat(taskForm.estimatedCost) : undefined,
      });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
      setShowTaskModal(false);
      setSelectedTask(null);
      setTaskForm({
        status: '',
        estimatedHours: '',
        estimatedCost: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedInspectionForPhoto || !photoFile) {
      toast({
        title: 'Warning',
        description: 'Please select an inspection and photo file',
        variant: 'destructive',
      });
      return;
    }
    try {
      setLoading(true);
      await technicianService.uploadInspectionPhoto(selectedInspectionForPhoto, photoFile);
      toast({
        title: 'Success',
        description: 'Photo uploaded successfully',
      });
      setShowPhotoUploadModal(false);
      setSelectedInspectionForPhoto(null);
      setPhotoFile(null);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload photo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMaintenanceRequest = async (requestId: string, status: string) => {
    try {
      await technicianService.updateMaintenanceRequest(requestId, { status });
      toast({
        title: 'Success',
        description: 'Maintenance request updated successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update request',
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
    <DashboardLayout title="Technician Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview">
            <Building className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="inspections">
            <CheckCircle className="w-4 h-4 mr-2" />
            Inspections
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Calendar className="w-4 h-4 mr-2" />
            Tasks
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
                  title="Active Tasks"
                  value={stats.activeTasks || 0}
                  subtitle="In progress"
                  variant="primary"
                />
                <StatCard
                  title="Pending Quotes"
                  value={stats.pendingQuotes || 0}
                  subtitle="Awaiting submission"
                />
                <StatCard
                  title="Maintenance Requests"
                  value={stats.maintenanceRequests || requests.length || 0}
                  subtitle="Open requests"
                />
              </div>
              {requests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Maintenance Requests</CardTitle>
                    <CardDescription>Latest maintenance requests requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.slice(0, 5).map((request, index) => (
                          <TableRow key={request.id || request.ID || `request-${index}`}>
                            <TableCell>{request.property || request.Property || 'N/A'}</TableCell>
                            <TableCell>{request.title || request.Title || request.issue || 'N/A'}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (request.priority || request.Priority || 'medium').toLowerCase() === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : (request.priority || request.Priority || 'medium').toLowerCase() ===
                                      'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {request.priority || request.Priority || 'Medium'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  (request.status || request.Status || 'pending').toLowerCase() === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {request.status || request.Status || 'Pending'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateMaintenanceRequest(request.id || request.ID, 'in_progress')}
                              >
                                Start
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

        <TabsContent value="inspections" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inspections</CardTitle>
                  <CardDescription>Manage property inspections</CardDescription>
                </div>
                <Button onClick={() => setShowInspectionModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Inspection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No inspections found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((inspection, index) => (
                      <TableRow key={inspection.id || inspection.ID || `inspection-${index}`}>
                        <TableCell>{inspection.property || inspection.Property || 'N/A'}</TableCell>
                        <TableCell>{inspection.type || inspection.Type || 'N/A'}</TableCell>
                        <TableCell>{inspection.inspector || inspection.Inspector || 'N/A'}</TableCell>
                        <TableCell>
                          {inspection.date || inspection.Date
                            ? new Date(inspection.date || inspection.Date).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (inspection.status || inspection.Status || 'pending').toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {inspection.status || inspection.Status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInspectionForPhoto(inspection.id || inspection.ID);
                              setShowPhotoUploadModal(true);
                            }}
                          >
                            <Upload className="w-4 h-4" />
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

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tasks found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Estimated Hours</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task, index) => (
                      <TableRow key={task.id || task.ID || `task-${index}`}>
                        <TableCell>{task.title || task.Title || task.description || 'N/A'}</TableCell>
                        <TableCell>{task.property || task.Property || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              (task.status || task.Status || 'pending').toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : (task.status || task.Status || 'pending').toLowerCase() === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {task.status || task.Status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>{task.estimatedHours || task.EstimatedHours || 'N/A'}</TableCell>
                        <TableCell>
                          {task.estimatedCost || task.EstimatedCost
                            ? `${(task.estimatedCost || task.EstimatedCost).toLocaleString()} XOF`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setTaskForm({
                                status: task.status || task.Status || '',
                                estimatedHours: task.estimatedHours || task.EstimatedHours || '',
                                estimatedCost: task.estimatedCost || task.EstimatedCost || '',
                              });
                              setShowTaskModal(true);
                            }}
                          >
                            Update
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

      {/* Create Inspection Modal */}
      <Modal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
        title="Create Inspection"
        size="lg"
      >
        <form onSubmit={handleCreateInspection} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inspectionProperty">Property *</Label>
            <Input
              id="inspectionProperty"
              value={inspectionForm.property}
              onChange={(e) => setInspectionForm((prev) => ({ ...prev, property: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspectionType">Type *</Label>
            <select
              id="inspectionType"
              value={inspectionForm.type}
              onChange={(e) => setInspectionForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="routine">Routine</option>
              <option value="pre_lease">Pre-Lease</option>
              <option value="post_lease">Post-Lease</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspector">Inspector *</Label>
            <Input
              id="inspector"
              value={inspectionForm.inspector}
              onChange={(e) => setInspectionForm((prev) => ({ ...prev, inspector: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspectionNotes">Notes</Label>
            <Textarea
              id="inspectionNotes"
              value={inspectionForm.notes}
              onChange={(e) => setInspectionForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowInspectionModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Inspection'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
          setTaskForm({
            status: '',
            estimatedHours: '',
            estimatedCost: '',
          });
        }}
        title="Update Task"
        size="lg"
      >
        <form onSubmit={handleUpdateTask} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskStatus">Status *</Label>
            <select
              id="taskStatus"
              value={taskForm.status}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={taskForm.estimatedHours}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, estimatedHours: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost (XOF)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={taskForm.estimatedCost}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, estimatedCost: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowTaskModal(false);
                setSelectedTask(null);
                setTaskForm({
                  status: '',
                  estimatedHours: '',
                  estimatedCost: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={showPhotoUploadModal}
        onClose={() => {
          setShowPhotoUploadModal(false);
          setSelectedInspectionForPhoto(null);
          setPhotoFile(null);
        }}
        title="Upload Inspection Photo"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photoFile">Select Photo *</Label>
            <Input
              id="photoFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhotoFile(file);
              }}
              required
            />
          </div>
          {photoFile && (
            <div>
              <img
                src={URL.createObjectURL(photoFile)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPhotoUploadModal(false);
                setSelectedInspectionForPhoto(null);
                setPhotoFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadPhoto} disabled={loading || !photoFile}>
              {loading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
