import { buildApiUrl, apiRequest } from '../config/api';

export const landlordService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/overview'));
  },
  getProperties: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/properties'));
  },
  addProperty: async (propertyData: any) => {
    return await apiRequest(buildApiUrl('/api/landlord/properties'), {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },
  getTenants: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/tenants'));
  },
  getRents: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/rents'));
  },
  getPayments: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/payments'));
  },
  getNetPayments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/landlord/payments/net');
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
    let url = buildApiUrl('/api/landlord/payments/history');
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return await apiRequest(url);
  },
  generateReceipt: async (receiptData: any) => {
    return await apiRequest(buildApiUrl('/api/landlord/payments/receipt'), {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });
  },
  getExpenses: async (filters: any = {}) => {
    let url = buildApiUrl('/api/landlord/expenses');
    const queryParams = new URLSearchParams();
    if (filters.property) queryParams.append('property', filters.property);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return await apiRequest(url);
  },
  downloadReport: async (filters: any = {}) => {
    let url = buildApiUrl('/api/landlord/reports/download');
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
        Authorization: localStorage.getItem('token') || '',
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
  getWorkOrders: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/works'));
  },
  createWorkOrder: async (workOrderData: any) => {
    return await apiRequest(buildApiUrl('/api/landlord/works'), {
      method: 'POST',
      body: JSON.stringify(workOrderData),
    });
  },
  getClaims: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/claims'));
  },
  createClaim: async (claimData: any) => {
    return await apiRequest(buildApiUrl('/api/landlord/claims'), {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },
  getInventory: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/inventory'));
  },
  addInventory: async (inventoryData: any) => {
    return await apiRequest(buildApiUrl('/api/landlord/inventory'), {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
  },
  getBusinessTracking: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/tracking'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/advertisements'));
  },
};

