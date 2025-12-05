import { buildApiUrl, apiRequest } from '../config/api';

export const salesManagerService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/overview'));
  },
  getProperties: async (filters: any = {}) => {
    let url = buildApiUrl('/api/salesmanager/properties');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  getClients: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/clients'));
  },
  createClient: async (clientData: any) => {
    return await apiRequest(buildApiUrl('/api/salesmanager/clients'), {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },
  getAlerts: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/alerts'));
  },
  createAlert: async (alertData: any) => {
    return await apiRequest(buildApiUrl('/api/salesmanager/alerts'), {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },
};

