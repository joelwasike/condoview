import { buildApiUrl, apiRequest } from '../config/api';

export const landlordService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/overview'));
  },
  getProperties: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/properties'));
  },
  getTenants: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/tenants'));
  },
  getPayments: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/payments'));
  },
  getRents: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/rents'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/landlord/advertisements'));
  },
};

