import { buildApiUrl, apiRequest } from '../config/api';

export const superAdminService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/agency-stats'));
  },
  getCompanies: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/companies'));
  },
  getUsers: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/users'));
  },
  getFinancial: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/financial'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/advertisements'));
  },
};

