import { buildApiUrl, apiRequest } from '../config/api';

export const accountingService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/accounting/overview'));
  },
  getTenantPayments: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/tenant-payments');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  getExpenses: async (filters: any = {}) => {
    let url = buildApiUrl('/api/accounting/expenses');
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
};

