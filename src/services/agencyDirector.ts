import { buildApiUrl, apiRequest } from '../config/api';

export const agencyDirectorService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/agency-director/overview'));
  },
  getUsers: async () => {
    return await apiRequest(buildApiUrl('/api/agency-director/users'));
  },
  getProperties: async () => {
    return await apiRequest(buildApiUrl('/api/agency-director/properties'));
  },
  getFinancialOverview: async () => {
    return await apiRequest(buildApiUrl('/api/agency-director/financial'));
  },
};

