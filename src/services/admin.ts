import { buildApiUrl, apiRequest } from '../config/api';

export const adminService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/admin/overview'));
  },
  getInbox: async () => {
    return await apiRequest(buildApiUrl('/api/admin/inbox'));
  },
  forwardInbox: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/inbox/${id}/forward`), {
      method: 'POST',
    });
  },
  getDocuments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/admin/documents');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tenant) queryParams.append('tenant', filters.tenant);
    if (filters.type) queryParams.append('type', filters.type);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  approveDocument: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/documents/${id}/approve`), {
      method: 'POST',
    });
  },
  rejectDocument: async (id: string, reason: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/documents/${id}/reject`), {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  followUpDocument: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/documents/${id}/follow-up`), {
      method: 'POST',
    });
  },
  sendToUtility: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/documents/${id}/utility`), {
      method: 'POST',
    });
  },
  getUtilities: async (filters: any = {}) => {
    let url = buildApiUrl('/api/admin/utilities');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.provider) queryParams.append('provider', filters.provider);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  transferUtility: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/utilities/${id}/transfer`), {
      method: 'POST',
    });
  },
  getDebts: async () => {
    return await apiRequest(buildApiUrl('/api/admin/debts'));
  },
  remindDebt: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/debts/${id}/remind`), {
      method: 'POST',
    });
  },
  markDebtPaid: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/debts/${id}/paid`), {
      method: 'POST',
    });
  },
  getPendingPaymentFollowUps: async () => {
    return await apiRequest(buildApiUrl('/api/admin/payments/follow-ups'));
  },
  getReminders: async () => {
    return await apiRequest(buildApiUrl('/api/admin/reminders'));
  },
  createReminder: async (reminderData: any) => {
    return await apiRequest(buildApiUrl('/api/admin/reminders'), {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },
  deleteReminder: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/reminders/${id}`), {
      method: 'DELETE',
    });
  },
  getLeases: async (filters: any = {}) => {
    let url = buildApiUrl('/api/admin/leases');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tenant) queryParams.append('tenant', filters.tenant);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  createLease: async (leaseData: any) => {
    return await apiRequest(buildApiUrl('/api/admin/leases'), {
      method: 'POST',
      body: JSON.stringify(leaseData),
    });
  },
  generateLeaseDocument: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/admin/leases/${id}/generate`), {
      method: 'POST',
    });
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/admin/advertisements'));
  },
};

