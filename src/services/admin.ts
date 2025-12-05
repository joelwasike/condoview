import { buildApiUrl, apiRequest } from '../config/api';

export const adminService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/admin/overview'));
  },
  getDocuments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/admin/documents');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
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
};

