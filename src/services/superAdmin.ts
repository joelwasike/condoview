import { buildApiUrl, apiRequest, API_CONFIG } from '../config/api';

const getAuthHeaders = (includeContentType = true): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    const tokenStr = String(token).trim();
    const sanitizedToken = tokenStr
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        return code >= 32 && code <= 126 ? char : '';
      })
      .join('');
    if (sanitizedToken && sanitizedToken.length > 0) {
      headers['Authorization'] = sanitizedToken;
    }
  }
  return headers;
};

export const superAdminService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/agency-stats'));
  },
  getCompanies: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/companies'));
  },
  addCompany: async (companyData: any) => {
    return await apiRequest(buildApiUrl('/api/superadmin/companies'), {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },
  updateCompany: async (id: string, companyData: any) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/companies/${id}`), {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },
  deleteCompany: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/companies/${id}`), {
      method: 'DELETE',
    });
  },
  deactivateCompany: async (id: string, reason: string) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/companies/${id}/deactivate`), {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  reactivateCompany: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/companies/${id}/reactivate`), {
      method: 'POST',
    });
  },
  getAgencyAdmins: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/agency-directors'));
  },
  addAgencyAdmin: async (adminData: any) => {
    return await apiRequest(buildApiUrl('/api/superadmin/agency-admins'), {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },
  updateAgencyAdmin: async (id: string, adminData: any) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/agency-admins/${id}`), {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  },
  deleteAgencyAdmin: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/agency-admins/${id}`), {
      method: 'DELETE',
    });
  },
  getUsers: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/users'));
  },
  addUser: async (userData: any) => {
    return await apiRequest(buildApiUrl('/api/superadmin/users'), {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  updateUser: async (id: string, userData: any) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/users/${id}`), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  deleteUser: async (id: string) => {
    return await apiRequest(buildApiUrl(`/api/superadmin/users/${id}`), {
      method: 'DELETE',
    });
  },
  getFinancialOverview: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/financial'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/advertisements'));
  },
  createAdvertisement: async (adData: { title: string; text: string; image: File }) => {
    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('text', adData.text);
    if (adData.image instanceof File) {
      formData.append('image', adData.image);
    } else {
      throw new Error('Image file is required');
    }
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      const tokenStr = String(token).trim();
      const sanitizedToken = tokenStr
        .split('')
        .map((char) => {
          const code = char.charCodeAt(0);
          return code >= 32 && code <= 126 ? char : '';
        })
        .join('');
      if (sanitizedToken && sanitizedToken.length > 0) {
        headers['Authorization'] = sanitizedToken;
      }
    }
    const response = await fetch(buildApiUrl('/api/superadmin/advertisements'), {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Failed to create advertisement: ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to create advertisement: ${response.status} ${response.statusText}. ${errorText}`);
      }
    }
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  },
  getSubscriptions: async () => {
    return await apiRequest(buildApiUrl('/api/superadmin/subscriptions')).catch(() => []);
  },
  getChatWithAdmin: async (adminId: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(`/api/superadmin/chat/${adminId}/messages`), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch chat messages: ${response.status}`);
    }
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  },
  sendChatMessage: async (messagePayload: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(buildApiUrl('/api/superadmin/chat/messages'), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(messagePayload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Failed to send chat message: ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to send chat message: ${response.status} ${response.statusText}. ${errorText}`);
      }
    }
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  },
};

