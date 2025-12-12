import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const commercialService = {
  // Overview
  getOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.OVERVIEW);
    return await apiRequest(url);
  },

  // Listings
  listListings: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.LISTINGS);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  createListing: async (listingData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.LISTINGS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  updateListing: async (id: number, listingData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMERCIAL.LISTINGS}/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  },

  // Visits
  listVisits: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.VISITS);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.property) queryParams.append('property', filters.property);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  scheduleVisit: async (visitData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.VISITS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },

  updateVisitStatus: async (id: number, status: string, notes?: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMERCIAL.VISITS}/${id}/status`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Interested Clients History
  getInterestedClientsHistory: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.INTERESTED_CLIENTS);
    return await apiRequest(url);
  },

  // Visit Requests
  listRequests: async (filters: any = {}) => {
    let url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.REQUESTS);
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return await apiRequest(url);
  },

  createVisitRequest: async (requestData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.REQUESTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  updateVisitRequest: async (id: number, status: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMERCIAL.REQUESTS}/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  followUpVisitRequest: async (id: number, message: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMERCIAL.REQUESTS}/${id}/follow-up`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Get advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL.ADVERTISEMENTS);
    return await apiRequest(url);
  },
};
