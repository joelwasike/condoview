import { buildApiUrl, apiRequest } from '../config/api';

export const commercialService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/overview'));
  },
  listListings: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/listings'));
  },
  listVisits: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/visits'));
  },
  scheduleVisit: async (visitData: any) => {
    return await apiRequest(buildApiUrl('/api/commercial/visits'), {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },
};

