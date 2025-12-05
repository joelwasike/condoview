import { buildApiUrl, apiRequest } from '../config/api';

export const tenantService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/overview'));
  },
  listPayments: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/payments'));
  },
  recordPayment: async (paymentData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/payments'), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  listMaintenance: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/maintenance'));
  },
  createMaintenance: async (maintenanceData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/maintenance'), {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  },
  getLeaseInfo: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/lease'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/advertisements'));
  },
};

