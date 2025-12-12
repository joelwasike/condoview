import { API_CONFIG, buildApiUrl, getAuthHeaders, parseJson, apiRequest } from '@/config/api';

const SALES_MANAGER_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.BASE);

export const salesManagerService = {
  // Get overview statistics
  getOverview: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.OVERVIEW));
  },

  // Get all properties (with optional query filters)
  getProperties: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.PROPERTIES);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.urgency) queryParams.append('urgency', filters.urgency);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  // Get properties by occupancy status
  getPropertiesByOccupancy: async (status: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.PROPERTIES}/occupancy/${status}`);
    return await apiRequest(url);
  },

  // Get all clients
  getClients: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.CLIENTS);
    return await apiRequest(url);
  },

  // Get waiting list clients
  getWaitingListClients: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.WAITING_LIST);
    return await apiRequest(url);
  },

  // Create new client/tenant
  createClient: async (clientData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.CLIENTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  // Update client/tenant profile
  updateClient: async (clientId: number, clientData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.CLIENTS}/${clientId}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },

  // Get unpaid rents
  getUnpaidRents: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.UNPAID_RENTS);
    return await apiRequest(url);
  },

  // Update unpaid rent
  updateUnpaidRent: async (unpaidRentId: number, updateData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.UNPAID_RENTS}/${unpaidRentId}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Get all alerts (with optional type filter)
  getAlerts: async (type: string | null = null) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.ALERTS);
    if (type) {
      url += `?type=${encodeURIComponent(type)}`;
    }
    return await apiRequest(url);
  },

  // Get unpaid rent alerts
  getUnpaidRentAlerts: async () => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.ALERTS}/unpaid-rents`);
    return await apiRequest(url);
  },

  // Create new alert
  createAlert: async (alertData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.ALERTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Update alert status
  updateAlert: async (alertId: number, status: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.ALERTS}/${alertId}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Create new property
  createProperty: async (propertyData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.PROPERTIES);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Update property
  updateProperty: async (propertyId: number, propertyData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SALES_MANAGER.PROPERTIES}/${propertyId}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  // Get advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.ADVERTISEMENTS);
    return await apiRequest(url);
  },

  // Import clients/tenants from Excel or CSV
  importClientsFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const fileName = file.name || '';
    const isCSV = fileName.toLowerCase().endsWith('.csv');
    const fileType = isCSV ? 'CSV' : 'Excel';
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SALES_MANAGER.IMPORT_CLIENTS);
    const token = localStorage.getItem('token');
    
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
      },
      body: formData
    }).then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          let errorMessage = errorJson.error || errorJson.message || `Failed to import ${fileType} file: ${response.status}`;
          
          if (isCSV && errorMessage.includes('Invalid file type') && errorMessage.includes('.xlsx and .xls')) {
            errorMessage = 'CSV file support needs to be enabled on the backend. Please contact the administrator or use .xlsx/.xls format.';
          }
          
          throw new Error(errorMessage);
        } catch (e) {
          if (e instanceof Error && e.message) {
            throw e;
          }
          throw new Error(`Failed to import ${fileType} file: ${response.status} ${response.statusText}. ${errorText}`);
        }
      }
      return response.json();
    });
  },
};
