import { buildApiUrl, apiRequest } from '../config/api';

export const commercialService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/overview'));
  },
  listListings: async (filters: any = {}) => {
    let url = buildApiUrl('/api/commercial/listings');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  createListing: async (listingData: any) => {
    return await apiRequest(buildApiUrl('/api/commercial/listings'), {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },
  updateListing: async (id: string, listingData: any) => {
    return await apiRequest(buildApiUrl(`/api/commercial/listings/${id}`), {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  },
  listVisits: async (filters: any = {}) => {
    let url = buildApiUrl('/api/commercial/visits');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.property) queryParams.append('property', filters.property);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  scheduleVisit: async (visitData: any) => {
    return await apiRequest(buildApiUrl('/api/commercial/visits'), {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },
  updateVisitStatus: async (id: string, status: string, notes?: string) => {
    return await apiRequest(buildApiUrl(`/api/commercial/visits/${id}/status`), {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },
  getInterestedClientsHistory: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/clients/history'));
  },
  listRequests: async (filters: any = {}) => {
    let url = buildApiUrl('/api/commercial/requests');
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  createVisitRequest: async (requestData: any) => {
    return await apiRequest(buildApiUrl('/api/commercial/requests'), {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  updateVisitRequest: async (id: string, status: string) => {
    return await apiRequest(buildApiUrl(`/api/commercial/requests/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  followUpVisitRequest: async (id: string, message: string) => {
    return await apiRequest(buildApiUrl(`/api/commercial/requests/${id}/follow-up`), {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/commercial/advertisements'));
  },
};

