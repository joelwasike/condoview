import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const accountingService = {
  // Overview APIs
  getOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.OVERVIEW);
    return await apiRequest(url);
  },

  // Tenant Payments APIs
  getTenantPayments: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS);
    const queryParams = new URLSearchParams();
    
    if (filters.property) queryParams.append('property', filters.property);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.chargeType) queryParams.append('chargeType', filters.chargeType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  recordTenantPayment: async (paymentData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  approveTenantPayment: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS}/${paymentId}/approve`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  generateReceipt: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS}/${paymentId}/receipt`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  sendReceipt: async (paymentId: number, email: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS}/${paymentId}/send-receipt`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Import payments from file
  importPayments: async (formData: FormData) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS}/import`);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to import payments');
    }

    return await response.json();
  },

  // Landlord Payments APIs
  getLandlordPayments: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.LANDLORD_PAYMENTS);
    const queryParams = new URLSearchParams();
    
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.landlord) queryParams.append('landlord', filters.landlord);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  recordLandlordPayment: async (paymentData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.LANDLORD_PAYMENTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  transferToLandlord: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.LANDLORD_PAYMENTS}/${paymentId}/transfer`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Get list of landlords
  getLandlords: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.LANDLORDS);
    return await apiRequest(url);
  },

  // Calculate available payment amount for a building
  calculateBuildingPaymentAmount: async (building: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.LANDLORD_PAYMENTS}/calculate-amount?building=${encodeURIComponent(building)}`);
    return await apiRequest(url);
  },

  // Collections APIs
  getCollections: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.COLLECTIONS);
    const queryParams = new URLSearchParams();
    
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.landlord) queryParams.append('landlord', filters.landlord);
    if (filters.chargeType) queryParams.append('chargeType', filters.chargeType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  getCollectionsPerBuilding: async () => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.COLLECTIONS}/per-building`);
    return await apiRequest(url);
  },

  recordCollection: async (collectionData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.COLLECTIONS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(collectionData),
    });
  },

  // Expenses APIs
  getExpenses: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.EXPENSES);
    const queryParams = new URLSearchParams();
    
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  addExpense: async (expenseData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.EXPENSES);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  updateExpense: async (expenseId: number, expenseData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.EXPENSES}/${expenseId}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  deleteExpense: async (expenseId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.EXPENSES}/${expenseId}`);
    return await apiRequest(url, {
      method: 'DELETE',
    });
  },

  // Reports APIs
  getMonthlySummary: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.MONTHLY_SUMMARY);
    return await apiRequest(url);
  },

  getFinancialReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/financial?start=${startDate}&end=${endDate}`);
    return await apiRequest(url);
  },

  getGlobalBalance: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.GLOBAL_BALANCE);
    return await apiRequest(url);
  },

  // Comprehensive Reports
  getPaymentsByPeriodReport: async (startDate: string, endDate: string, period: string = 'monthly') => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/payments-by-period?startDate=${startDate}&endDate=${endDate}&period=${period}`);
    return await apiRequest(url);
  },

  getCommissionsByPeriodReport: async (startDate: string, endDate: string, period: string = 'monthly') => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/commissions-by-period?startDate=${startDate}&endDate=${endDate}&period=${period}`);
    return await apiRequest(url);
  },

  getRefundsReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/refunds?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  getPaymentsByBuildingReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/payments-by-building?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  getPaymentsByTenantReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/payments-by-tenant?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  getExpensesByPeriodReport: async (startDate: string, endDate: string, category?: string) => {
    let url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/expenses-by-period?startDate=${startDate}&endDate=${endDate}`);
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return await apiRequest(url);
  },

  getCollectionsByPeriodReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/collections-by-period?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  getBuildingPerformanceReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/building-performance?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  getPaymentStatusReport: async (startDate: string, endDate: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.REPORTS}/payment-status?startDate=${startDate}&endDate=${endDate}`);
    return await apiRequest(url);
  },

  // Document Upload APIs
  uploadReceiptDocument: async (paymentId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.TENANT_PAYMENTS}/${paymentId}/upload-receipt`);
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
        throw new Error(errorText || 'Failed to upload receipt document');
      }
      return response.json();
    });
  },

  uploadExpenseDocument: async (expenseId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.EXPENSES}/${expenseId}/upload-document`);
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
        throw new Error(errorText || 'Failed to upload expense document');
      }
      return response.json();
    });
  },

  // Get advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.ADVERTISEMENTS);
    return await apiRequest(url);
  },

  // Get tenants with payment status
  getTenantsWithPaymentStatus: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.TENANTS);
    return await apiRequest(url);
  },

  // Security Deposits
  getSecurityDeposits: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.ACCOUNTING.DEPOSITS);
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  recordDepositPayment: async (paymentData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.DEPOSITS}/payment`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  processDepositRefund: async (refundData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.DEPOSITS}/refund`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  },

  getSecurityDeposit: async (depositId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ACCOUNTING.DEPOSITS}/${depositId}`);
    return await apiRequest(url);
  },
};
