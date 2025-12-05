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

const parseJson = async (response: Response): Promise<any> => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const agencyDirectorService = {
  getOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/overview`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch overview');
    return parseJson(response);
  },
  getUsers: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/users`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await parseJson(response);
    return data?.users || data || [];
  },
  addUser: async (userData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/users`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to add user');
    return parseJson(response);
  },
  updateUser: async (id: string, userData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/users/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return parseJson(response);
  },
  deleteUser: async (id: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/users/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return parseJson(response);
  },
  getProperties: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/properties`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch properties');
    const data = await parseJson(response);
    return data?.properties || data || [];
  },
  addProperty: async (propertyData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/properties`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) throw new Error('Failed to add property');
    return parseJson(response);
  },
  updateProperty: async (id: string, propertyData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/properties/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) throw new Error('Failed to update property');
    return parseJson(response);
  },
  deleteProperty: async (id: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/properties/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to delete property');
    return parseJson(response);
  },
  getFinancialOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/financial`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch financial overview');
    return parseJson(response);
  },
  getAccountingOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/accounting/overview`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch accounting overview');
    return parseJson(response);
  },
  getTenantPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/accounting/tenant-payments`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch tenant payments');
    return parseJson(response);
  },
  getLandlordPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/accounting/landlord-payments`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch landlord payments');
    return parseJson(response);
  },
  approveLandlordPayment: async (paymentId: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/agency-director/accounting/landlord-payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: headers,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to approve landlord payment');
    }
    return parseJson(response);
  },
  getPendingPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/accounting/payments/pending-approval`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch pending payments');
    return parseJson(response);
  },
  approveTenantPayment: async (paymentId: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/agency-director/accounting/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: headers,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to approve payment');
    }
    return parseJson(response);
  },
  rejectTenantPayment: async (paymentId: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/agency-director/accounting/payments/${paymentId}/reject`,
      {
        method: 'POST',
        headers: headers,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to reject payment');
    }
    return parseJson(response);
  },
  getSubscriptionStatus: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/subscription/status`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch subscription status');
    return parseJson(response);
  },
  paySubscription: async (paymentData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/subscription/pay`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to process subscription payment');
    }
    return parseJson(response);
  },
  payAnnualSubscription: async (paymentData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/subscription/pay-annual`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to process annual subscription payment');
    }
    return parseJson(response);
  },
  getConversationWithUser: async (userId: string) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/messages/${userId}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return parseJson(response);
  },
  sendMessage: async (messagePayload: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/messages`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(messagePayload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to send message');
    }
    return parseJson(response);
  },
  getAdvertisements: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/agency-director/advertisements`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch advertisements');
    return parseJson(response);
  },
};
