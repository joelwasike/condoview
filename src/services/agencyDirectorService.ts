import { API_CONFIG, buildApiUrl, getAuthHeaders, parseJson } from '@/config/api';

const AGENCY_DIRECTOR_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.BASE);

export const agencyDirectorService = {
  // Overview
  getOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.OVERVIEW), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch overview');
    return parseJson(response);
  },

  // Users
  getUsers: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.USERS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await parseJson(response);
    return data?.users || data || [];
  },

  addUser: async (userData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.USERS), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to add user');
    return parseJson(response);
  },

  updateUser: async (id: number, userData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.USERS)}/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to update user');
    return parseJson(response);
  },

  deleteUser: async (id: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.USERS)}/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return parseJson(response);
  },

  // Properties
  getProperties: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PROPERTIES), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch properties');
    const data = await parseJson(response);
    return data?.properties || data || [];
  },

  addProperty: async (propertyData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PROPERTIES), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(propertyData)
    });
    if (!response.ok) throw new Error('Failed to add property');
    return parseJson(response);
  },

  updateProperty: async (id: number, propertyData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PROPERTIES)}/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(propertyData)
    });
    if (!response.ok) throw new Error('Failed to update property');
    return parseJson(response);
  },

  deleteProperty: async (id: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PROPERTIES)}/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to delete property');
    return parseJson(response);
  },

  // Financial
  getFinancialOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.FINANCIAL), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch financial overview');
    return parseJson(response);
  },

  // Works
  getWorks: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.WORKS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch works');
    const data = await parseJson(response);
    return data?.works || data || [];
  },

  // System
  getSystemSettings: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.SYSTEM), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch system settings');
    return parseJson(response);
  },

  // Accounting
  getAccountingOverview: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.ACCOUNTING_OVERVIEW), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch accounting overview');
    return parseJson(response);
  },

  getTenantPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.TENANT_PAYMENTS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch tenant payments');
    return parseJson(response);
  },

  getLandlordPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.LANDLORD_PAYMENTS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch landlord payments');
    return parseJson(response);
  },

  getCollections: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.COLLECTIONS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch collections');
    return parseJson(response);
  },

  getExpenses: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.EXPENSES), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return parseJson(response);
  },

  // Landlord Payment Management
  approveLandlordPayment: async (paymentId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.LANDLORD_PAYMENTS)}/${paymentId}/approve`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to approve landlord payment');
    }
    return parseJson(response);
  },

  revokeLandlordPayment: async (paymentId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.LANDLORD_PAYMENTS)}/${paymentId}/revoke`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to revoke landlord payment');
    }
    return parseJson(response);
  },

  // Subscription Payment
  paySubscription: async (paymentData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.SUBSCRIPTION_PAY), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to process subscription payment');
    }
    return parseJson(response);
  },

  payAnnualSubscription: async (paymentData: any) => {
    const headers = getAuthHeaders(true);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.SUBSCRIPTION_PAY_ANNUAL), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to process annual subscription payment');
    }
    return parseJson(response);
  },

  // Get current subscription status
  getSubscriptionStatus: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.SUBSCRIPTION_STATUS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch subscription status');
    return parseJson(response);
  },

  // Messaging
  getConversations: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.CONVERSATIONS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return parseJson(response);
  },

  getConversationWithUser: async (userId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.MESSAGES)}/${userId}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return parseJson(response);
  },

  sendMessage: async (messagePayload: any) => {
    const headers = getAuthHeaders(true);
    const body = JSON.stringify(messagePayload);
    
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.MESSAGES), {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Message send failed:', response.status, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Failed to send message: ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}. ${errorText}`);
      }
    }
    
    return parseJson(response);
  },

  getInbox: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${AGENCY_DIRECTOR_BASE_URL}/messages/inbox`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch inbox');
    return parseJson(response);
  },

  // Contracts
  getLeasesAwaitingSignature: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.LEASES_AWAITING_SIGNATURE), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch leases awaiting signature');
    return parseJson(response);
  },

  getOwners: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.OWNERS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch owners');
    return parseJson(response);
  },

  // Expense and Quote Approval
  approveExpense: async (expenseId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.EXPENSES)}/${expenseId}/approve`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to approve expense');
    return parseJson(response);
  },

  rejectExpense: async (expenseId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.EXPENSES)}/${expenseId}/reject`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to reject expense');
    return parseJson(response);
  },

  approveQuote: async (quoteId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${AGENCY_DIRECTOR_BASE_URL}/contracts/quotes/${quoteId}/approve`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to approve quote');
    return parseJson(response);
  },

  rejectQuote: async (quoteId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${AGENCY_DIRECTOR_BASE_URL}/contracts/quotes/${quoteId}/reject`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to reject quote');
    return parseJson(response);
  },

  // Get pending payments for approval
  getPendingPayments: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PENDING_PAYMENTS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch pending payments');
    return parseJson(response);
  },

  // Approve/reject tenant payment
  approveTenantPayment: async (paymentId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${AGENCY_DIRECTOR_BASE_URL}/accounting/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to approve payment');
    }
    return parseJson(response);
  },

  rejectTenantPayment: async (paymentId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${AGENCY_DIRECTOR_BASE_URL}/accounting/payments/${paymentId}/reject`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to reject payment');
    }
    return parseJson(response);
  },

  // Get pending quotes for validation
  getPendingQuotes: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.PENDING_QUOTES), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch pending quotes');
    return parseJson(response);
  },

  // Reports
  getTransferHistory: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.ownerId) params.append('ownerId', filters.ownerId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.TRANSFER_HISTORY)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch transfer history');
    return parseJson(response);
  },

  getExpensesPerBuilding: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.building) params.append('building', filters.building);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.EXPENSES_PER_BUILDING)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch expenses per building');
    return parseJson(response);
  },

  getExpensesPerOwner: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.ownerId) params.append('ownerId', filters.ownerId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.EXPENSES_PER_OWNER)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch expenses per owner');
    return parseJson(response);
  },

  getInternalExpenses: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.INTERNAL_EXPENSES)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch internal expenses');
    return parseJson(response);
  },

  getCommissionsPerMonthPerBuilding: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.building) params.append('building', filters.building);
    if (filters.month) params.append('month', filters.month);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.COMMISSIONS_PER_MONTH)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch commissions per month per building');
    return parseJson(response);
  },

  getAllBuildingsReport: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.ALL_BUILDINGS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch all buildings report');
    return parseJson(response);
  },

  getUnpaidRentReport: async (filters: any = {}) => {
    const headers = getAuthHeaders(false);
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.UNPAID_RENT)}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch unpaid rent report');
    return parseJson(response);
  },

  // Tenants
  getTenants: async (status: string | null = null) => {
    const headers = getAuthHeaders(false);
    const url = status 
      ? `${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.TENANTS)}?status=${status}`
      : buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.TENANTS);
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch tenants');
    return parseJson(response);
  },

  getTenantProfile: async (tenantId: number) => {
    const headers = getAuthHeaders(false);
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.TENANTS)}/${tenantId}/profile`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch tenant profile');
    return parseJson(response);
  },

  // Advertisements
  getAdvertisements: async () => {
    const headers = getAuthHeaders(false);
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AGENCY_DIRECTOR.ADVERTISEMENTS), {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to fetch advertisements');
    return parseJson(response);
  },
};
