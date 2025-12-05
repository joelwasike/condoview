import { buildApiUrl, apiRequest } from '../config/api';

export const technicianService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/technician/overview'));
  },
  listInventories: async () => {
    return await apiRequest(buildApiUrl('/api/technician/inventories'));
  },
  listQuotes: async () => {
    return await apiRequest(buildApiUrl('/api/technician/quotes'));
  },
  listMaintenanceRequests: async () => {
    return await apiRequest(buildApiUrl('/api/technician/maintenance-requests'));
  },
};

