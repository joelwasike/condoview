import { buildApiUrl, apiRequest } from '../config/api';

export const accountingService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/overview'));
  },
  getTenantPayments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/tenant-payments');
    const queryParams = new URLSearchParams();
    if (filters.property) queryParams.append('property', filters.property);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.chargeType) queryParams.append('chargeType', filters.chargeType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  recordTenantPayment: async (paymentData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/tenant-payments'), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  approveTenantPayment: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/tenant-payments/${paymentId}/approve`), {
      method: 'POST',
    });
  },
  generateReceipt: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/tenant-payments/${paymentId}/receipt`), {
      method: 'POST',
    });
  },
  sendReceipt: async (paymentId: string, email: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/tenant-payments/${paymentId}/send-receipt`), {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  importPayments: async (formData: FormData) => {
    const url = buildApiUrl('/api/accounting/tenant-payments/import');
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: token || '' },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to import payments');
    }
    return response.json();
  },
  getLandlordPayments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/landlord-payments');
    const queryParams = new URLSearchParams();
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.landlord) queryParams.append('landlord', filters.landlord);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  recordLandlordPayment: async (paymentData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/landlord-payments'), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  transferToLandlord: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/landlord-payments/${paymentId}/transfer`), {
      method: 'POST',
    });
  },
  getLandlords: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/landlords'));
  },
  calculateBuildingPaymentAmount: async (building: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/landlord-payments/calculate-amount?building=${encodeURIComponent(building)}`)
    );
  },
  getCollections: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/collections');
    const queryParams = new URLSearchParams();
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.landlord) queryParams.append('landlord', filters.landlord);
    if (filters.chargeType) queryParams.append('chargeType', filters.chargeType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  getCollectionsPerBuilding: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/collections/per-building'));
  },
  recordCollection: async (collectionData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/collections'), {
      method: 'POST',
      body: JSON.stringify(collectionData),
    });
  },
  getExpenses: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/expenses');
    const queryParams = new URLSearchParams();
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.scope) queryParams.append('scope', filters.scope);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  addExpense: async (expenseData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/expenses'), {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },
  updateExpense: async (expenseId: string, expenseData: any) => {
    return await apiRequest(buildApiUrl(`/api/accounting/expenses/${expenseId}`), {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },
  deleteExpense: async (expenseId: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/expenses/${expenseId}`), {
      method: 'DELETE',
    });
  },
  getMonthlySummary: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/summary/monthly'));
  },
  getFinancialReport: async (startDate: string, endDate: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/reports/financial?start=${startDate}&end=${endDate}`));
  },
  getGlobalBalance: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/balance/global'));
  },
  getPaymentsByPeriodReport: async (startDate: string, endDate: string, period = 'monthly') => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/payments-by-period?startDate=${startDate}&endDate=${endDate}&period=${period}`)
    );
  },
  getCommissionsByPeriodReport: async (startDate: string, endDate: string, period = 'monthly') => {
    return await apiRequest(
      buildApiUrl(
        `/api/accounting/reports/commissions-by-period?startDate=${startDate}&endDate=${endDate}&period=${period}`
      )
    );
  },
  getRefundsReport: async (startDate: string, endDate: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/reports/refunds?startDate=${startDate}&endDate=${endDate}`));
  },
  getPaymentsByBuildingReport: async (startDate: string, endDate: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/payments-by-building?startDate=${startDate}&endDate=${endDate}`)
    );
  },
  getPaymentsByTenantReport: async (startDate: string, endDate: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/payments-by-tenant?startDate=${startDate}&endDate=${endDate}`)
    );
  },
  getExpensesByPeriodReport: async (startDate: string, endDate: string, category?: string) => {
    let url = buildApiUrl(`/api/accounting/reports/expenses-by-period?startDate=${startDate}&endDate=${endDate}`);
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return await apiRequest(url);
  },
  getCollectionsByPeriodReport: async (startDate: string, endDate: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/collections-by-period?startDate=${startDate}&endDate=${endDate}`)
    );
  },
  getBuildingPerformanceReport: async (startDate: string, endDate: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/building-performance?startDate=${startDate}&endDate=${endDate}`)
    );
  },
  getPaymentStatusReport: async (startDate: string, endDate: string) => {
    return await apiRequest(
      buildApiUrl(`/api/accounting/reports/payment-status?startDate=${startDate}&endDate=${endDate}`)
    );
  },
  uploadReceiptDocument: async (paymentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = buildApiUrl(`/api/accounting/tenant-payments/${paymentId}/upload-receipt`);
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: token || '' },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload receipt document');
    }
    return response.json();
  },
  uploadExpenseDocument: async (expenseId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = buildApiUrl(`/api/accounting/expenses/${expenseId}/upload-document`);
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: token || '' },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload expense document');
    }
    return response.json();
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/advertisements'));
  },
  getTenantsWithPaymentStatus: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/tenants'));
  },
  getSecurityDeposits: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/deposits');
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  recordDepositPayment: async (paymentData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/deposits/payment'), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  processDepositRefund: async (refundData: any) => {
    return await apiRequest(buildApiUrl('/api/accounting/deposits/refund'), {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  },
  getSecurityDeposit: async (depositId: string) => {
    return await apiRequest(buildApiUrl(`/api/accounting/deposits/${depositId}`));
  },
};

