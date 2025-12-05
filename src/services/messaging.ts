import { buildApiUrl, apiRequest } from '../config/api';

export const messagingService = {
  sendMessage: async (messageData: { toUserId: string; content: string }) => {
    const url = buildApiUrl('/api/messaging/messages');
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getConversations: async () => {
    const url = buildApiUrl('/api/messaging/messages/conversations');
    return await apiRequest(url);
  },

  getConversation: async (userId: string) => {
    const url = buildApiUrl(`/api/messaging/messages/${userId}`);
    return await apiRequest(url);
  },

  markMessagesAsRead: async (userId: string) => {
    const url = buildApiUrl(`/api/messaging/messages/${userId}/read`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  getInbox: async () => {
    const url = buildApiUrl('/api/messaging/messages/inbox');
    return await apiRequest(url);
  },

  getUsers: async (filters: { role?: string; search?: string } = {}) => {
    let url = buildApiUrl('/api/messaging/users');
    const queryParams = new URLSearchParams();
    
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.search) queryParams.append('search', filters.search);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },
};

