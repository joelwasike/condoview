import { buildApiUrl, apiRequest } from '../config/api';

export const salesManagerService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/overview'));
  },
  getProperties: async (filters: any = {}) => {
    let url = buildApiUrl('/api/salesmanager/properties');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.urgency) queryParams.append('urgency', filters.urgency);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  getPropertiesByOccupancy: async (status: string) => {
    return await apiRequest(buildApiUrl(`/api/salesmanager/properties/occupancy/${status}`));
  },
  getClients: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/clients'));
  },
  getWaitingListClients: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/clients/waiting-list'));
  },
  createClient: async (clientData: any) => {
    return await apiRequest(buildApiUrl('/api/salesmanager/clients'), {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },
  updateClient: async (clientId: string, clientData: any) => {
    return await apiRequest(buildApiUrl(`/api/salesmanager/clients/${clientId}`), {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },
  getUnpaidRents: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/unpaid-rents'));
  },
  updateUnpaidRent: async (unpaidRentId: string, updateData: any) => {
    return await apiRequest(buildApiUrl(`/api/salesmanager/unpaid-rents/${unpaidRentId}`), {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  getAlerts: async (type: string | null = null) => {
    let url = buildApiUrl('/api/salesmanager/alerts');
    if (type) {
      url += `?type=${encodeURIComponent(type)}`;
    }
    return await apiRequest(url);
  },
  getUnpaidRentAlerts: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/alerts/unpaid-rents'));
  },
  createAlert: async (alertData: any) => {
    return await apiRequest(buildApiUrl('/api/salesmanager/alerts'), {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },
  updateAlert: async (alertId: string, status: string) => {
    return await apiRequest(buildApiUrl(`/api/salesmanager/alerts/${alertId}`), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  createProperty: async (propertyData: any) => {
    return await apiRequest(buildApiUrl('/api/salesmanager/properties'), {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },
  updateProperty: async (propertyId: string, propertyData: any) => {
    return await apiRequest(buildApiUrl(`/api/salesmanager/properties/${propertyId}`), {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/salesmanager/advertisements'));
  },
  importClientsFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = buildApiUrl('/api/salesmanager/clients/import-excel');
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token || '',
      },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Failed to import file: ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to import file: ${response.status} ${response.statusText}. ${errorText}`);
      }
    }
    return response.json();
  },
};

