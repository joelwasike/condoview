import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const adminService = {
  // Overview
  getOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.OVERVIEW);
    return await apiRequest(url);
  },

  // Inbox
  getInbox: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.INBOX);
    return await apiRequest(url);
  },

  forwardInbox: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.INBOX}/${id}/forward`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Documents
  getDocuments: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.DOCUMENTS);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tenant) queryParams.append('tenant', filters.tenant);
    if (filters.type) queryParams.append('type', filters.type);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  approveDocument: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DOCUMENTS}/${id}/approve`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  rejectDocument: async (id: number, reason: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DOCUMENTS}/${id}/reject`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  followUpDocument: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DOCUMENTS}/${id}/follow-up`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  sendToUtility: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DOCUMENTS}/${id}/utility`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Utilities
  getUtilities: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.UTILITIES);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.provider) queryParams.append('provider', filters.provider);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  transferUtility: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.UTILITIES}/${id}/transfer`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Debts
  getDebts: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.DEBTS);
    return await apiRequest(url);
  },

  remindDebt: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DEBTS}/${id}/remind`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  markDebtPaid: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DEBTS}/${id}/paid`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Payment Follow-ups
  getPendingPaymentFollowUps: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.PAYMENT_FOLLOW_UPS);
    return await apiRequest(url);
  },

  // Reminders
  getReminders: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.REMINDERS);
    return await apiRequest(url);
  },

  createReminder: async (reminderData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.REMINDERS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  deleteReminder: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.REMINDERS}/${id}`);
    return await apiRequest(url, {
      method: 'DELETE',
    });
  },

  // Leases
  getLeases: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.LEASES);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tenant) queryParams.append('tenant', filters.tenant);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  createLease: async (leaseData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.LEASES);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(leaseData),
    });
  },

  generateLeaseDocument: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ADMIN.LEASES}/${id}/generate`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Get advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN.ADVERTISEMENTS);
    return await apiRequest(url);
  },
};
