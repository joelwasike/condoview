import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const landlordService = {
  // Overview
  getOverview: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.OVERVIEW));
  },

  // Properties
  getProperties: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.PROPERTIES));
  },

  addProperty: async (propertyData: any) => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.PROPERTIES), {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Tenants
  getTenants: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.TENANTS));
  },

  // Rents
  getRents: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.RENTS));
  },

  // Payments
  getPayments: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.PAYMENTS));
  },

  getNetPayments: async (filters: any = {}) => {
    let url = buildApiUrl(`${API_CONFIG.ENDPOINTS.LANDLORD.PAYMENTS}/net`);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  getPaymentHistory: async (filters: any = {}) => {
    let url = buildApiUrl(`${API_CONFIG.ENDPOINTS.LANDLORD.PAYMENTS}/history`);
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  generateReceipt: async (receiptData: any) => {
    return await apiRequest(buildApiUrl(`${API_CONFIG.ENDPOINTS.LANDLORD.PAYMENTS}/receipt`), {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });
  },

  // Expenses
  getExpenses: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.EXPENSES);
    const queryParams = new URLSearchParams();
    
    if (filters.property) queryParams.append('property', filters.property);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  // Reports
  downloadReport: async (filters: any = {}) => {
    let url = buildApiUrl(`${API_CONFIG.ENDPOINTS.LANDLORD.BASE}/reports/download`);
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token') || '',
      },
    });
    
    if (!response.ok) throw new Error('Failed to download report');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `landlord-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    
    return { message: 'Report downloaded successfully' };
  },

  // Work Orders
  getWorkOrders: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.WORKS));
  },

  createWorkOrder: async (workOrderData: any) => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.WORKS), {
      method: 'POST',
      body: JSON.stringify(workOrderData),
    });
  },

  // Claims
  getClaims: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.CLAIMS));
  },

  createClaim: async (claimData: any) => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.CLAIMS), {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },

  // Inventory
  getInventory: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.INVENTORY));
  },

  addInventory: async (inventoryData: any) => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.INVENTORY), {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
  },

  // Business Tracking
  getBusinessTracking: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.TRACKING));
  },

  // Get advertisements
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LANDLORD.ADVERTISEMENTS));
  },
};
