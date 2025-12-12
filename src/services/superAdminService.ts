import { API_CONFIG, buildApiUrl, apiRequest, getAuthHeaders } from '@/config/api';

export const superAdminService = {
  // Overview / subscription stats (agency-level)
  getOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.OVERVIEW);
    return await apiRequest(url);
  },

  // Companies
  getCompanies: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES);
    return await apiRequest(url);
  },

  addCompany: async (companyData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  updateCompany: async (id: number, companyData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES}/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(companyData)
    });
  },

  deleteCompany: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES}/${id}`);
    return await apiRequest(url, {
      method: 'DELETE',
    });
  },

  deactivateCompany: async (id: number, reason: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES}/${id}/deactivate`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  reactivateCompany: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.COMPANIES}/${id}/reactivate`);
    return await apiRequest(url, {
      method: 'POST',
    });
  },

  // Agency Directors
  getAgencyAdmins: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.AGENCY_DIRECTORS);
    return await apiRequest(url);
  },

  addAgencyAdmin: async (adminData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.AGENCY_ADMINS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  updateAgencyAdmin: async (id: number, adminData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.AGENCY_ADMINS}/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  },

  deleteAgencyAdmin: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.AGENCY_ADMINS}/${id}`);
    return await apiRequest(url, {
      method: 'DELETE',
    });
  },

  // Users
  getUsers: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.USERS);
    return await apiRequest(url);
  },

  addUser: async (userData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.USERS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  updateUser: async (id: number, userData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.USERS}/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  deleteUser: async (id: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.USERS}/${id}`);
    return await apiRequest(url, {
      method: 'DELETE',
    });
  },

  // Financial
  getFinancialOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.FINANCIAL);
    return await apiRequest(url);
  },

  // Subscription/Transaction History
  getSubscriptions: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.SUBSCRIPTIONS);
    return await apiRequest(url);
  },

  // Advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADVERTISEMENTS);
    return await apiRequest(url);
  },

  createAdvertisement: async (adData: any) => {
    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('text', adData.text);
    
    if (adData.image instanceof File) {
      formData.append('image', adData.image);
    } else {
      throw new Error('Image file is required. Please upload an image file.');
    }
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = token;
    }
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADVERTISEMENTS);
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create advertisement: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  },

  // Chat between global super admin and agency admins
  getChatWithAdmin: async (adminId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.CHAT}/${adminId}/messages`);
    return await apiRequest(url);
  },

  sendChatMessage: async (messagePayload: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.CHAT}/messages`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(messagePayload),
    });
  },
};
