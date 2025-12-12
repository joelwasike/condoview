// API Configuration
// Use production API URL by default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://saafimmo-api.theliberec.com';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    SALES_MANAGER: {
      BASE: '/api/salesmanager',
      OVERVIEW: '/api/salesmanager/overview',
      PROPERTIES: '/api/salesmanager/properties',
      CLIENTS: '/api/salesmanager/clients',
      ALERTS: '/api/salesmanager/alerts',
      ADVERTISEMENTS: '/api/salesmanager/advertisements',
      UNPAID_RENTS: '/api/salesmanager/unpaid-rents',
      WAITING_LIST: '/api/salesmanager/clients/waiting-list',
      IMPORT_CLIENTS: '/api/salesmanager/clients/import-excel',
    },
    COMMERCIAL: {
      BASE: '/api/commercial',
      OVERVIEW: '/api/commercial/overview',
      LISTINGS: '/api/commercial/listings',
      VISITS: '/api/commercial/visits',
      REQUESTS: '/api/commercial/requests',
      ADVERTISEMENTS: '/api/commercial/advertisements',
      INTERESTED_CLIENTS: '/api/commercial/clients/history',
    },
    ADMIN: {
      BASE: '/api/admin',
      OVERVIEW: '/api/admin/overview',
      INBOX: '/api/admin/inbox',
      DOCUMENTS: '/api/admin/documents',
      UTILITIES: '/api/admin/utilities',
      DEBTS: '/api/admin/debts',
      REMINDERS: '/api/admin/reminders',
      LEASES: '/api/admin/leases',
      ADVERTISEMENTS: '/api/admin/advertisements',
      PAYMENT_FOLLOW_UPS: '/api/admin/payments/follow-ups',
    },
    ACCOUNTING: {
      BASE: '/api/accounting',
      OVERVIEW: '/api/accounting/overview',
      COLLECTIONS: '/api/accounting/collections',
      TENANT_PAYMENTS: '/api/accounting/tenant-payments',
      LANDLORD_PAYMENTS: '/api/accounting/landlord-payments',
      EXPENSES: '/api/accounting/expenses',
      REPORTS: '/api/accounting/reports',
      TENANTS: '/api/accounting/tenants',
      DEPOSITS: '/api/accounting/deposits',
      LANDLORDS: '/api/accounting/landlords',
      MONTHLY_SUMMARY: '/api/accounting/summary/monthly',
      GLOBAL_BALANCE: '/api/accounting/balance/global',
      ADVERTISEMENTS: '/api/accounting/advertisements',
    },
    TECHNICIAN: {
      BASE: '/api/technician',
      OVERVIEW: '/api/technician/overview',
      INSPECTIONS: '/api/technician/inspections',
      TASKS: '/api/technician/tasks',
      MAINTENANCE_REQUESTS: '/api/technician/maintenance-requests',
      QUOTES: '/api/technician/quotes',
      PROGRESS: '/api/technician/progress',
      INVENTORIES: '/api/technician/inventories',
      ADVERTISEMENTS: '/api/technician/advertisements',
    },
    LANDLORD: {
      BASE: '/api/landlord',
      OVERVIEW: '/api/landlord/overview',
      PROPERTIES: '/api/landlord/properties',
      TENANTS: '/api/landlord/tenants',
      PAYMENTS: '/api/landlord/payments',
      RENTS: '/api/landlord/rents',
      EXPENSES: '/api/landlord/expenses',
      WORKS: '/api/landlord/works',
      CLAIMS: '/api/landlord/claims',
      INVENTORY: '/api/landlord/inventory',
      TRACKING: '/api/landlord/tracking',
      ADVERTISEMENTS: '/api/landlord/advertisements',
    },
    TENANT: {
      BASE: '/api/tenant',
      OVERVIEW: '/api/tenant/overview',
      PAYMENTS: '/api/tenant/payments',
      MAINTENANCE: '/api/tenant/maintenance',
      LEASE: '/api/tenant/lease',
      DEPOSITS: '/api/tenant/deposits',
      ADVERTISEMENTS: '/api/tenant/advertisements',
    },
    SUPER_ADMIN: {
      BASE: '/api/superadmin',
      OVERVIEW: '/api/superadmin/agency-stats',
      COMPANIES: '/api/superadmin/companies',
      AGENCY_DIRECTORS: '/api/superadmin/agency-directors',
      AGENCY_ADMINS: '/api/superadmin/agency-admins',
      USERS: '/api/superadmin/users',
      PROPERTIES: '/api/superadmin/properties',
      FINANCIAL: '/api/superadmin/financial',
      SUBSCRIPTIONS: '/api/superadmin/subscriptions',
      ADVERTISEMENTS: '/api/superadmin/advertisements',
      CHAT: '/api/superadmin/chat',
    },
    AGENCY_DIRECTOR: {
      BASE: '/api/agency-director',
      OVERVIEW: '/api/agency-director/overview',
      USERS: '/api/agency-director/users',
      PROPERTIES: '/api/agency-director/properties',
      FINANCIAL: '/api/agency-director/financial',
      ACCOUNTING_OVERVIEW: '/api/agency-director/accounting/overview',
      TENANT_PAYMENTS: '/api/agency-director/accounting/tenant-payments',
      LANDLORD_PAYMENTS: '/api/agency-director/accounting/landlord-payments',
      COLLECTIONS: '/api/agency-director/accounting/collections',
      EXPENSES: '/api/agency-director/accounting/expenses',
      WORKS: '/api/agency-director/works',
      SYSTEM: '/api/agency-director/system',
      SUBSCRIPTION_STATUS: '/api/agency-director/subscription/status',
      SUBSCRIPTION_PAY: '/api/agency-director/subscription/pay',
      SUBSCRIPTION_PAY_ANNUAL: '/api/agency-director/subscription/pay-annual',
      CONVERSATIONS: '/api/agency-director/messages/conversations',
      MESSAGES: '/api/agency-director/messages',
      LEASES_AWAITING_SIGNATURE: '/api/agency-director/contracts/leases-awaiting-signature',
      OWNERS: '/api/agency-director/contracts/owners',
      TENANTS: '/api/agency-director/tenants',
      ADVERTISEMENTS: '/api/agency-director/advertisements',
      PENDING_PAYMENTS: '/api/agency-director/accounting/payments/pending-approval',
      PENDING_QUOTES: '/api/agency-director/contracts/quotes/pending-validation',
      TRANSFER_HISTORY: '/api/agency-director/reports/transfer-history',
      EXPENSES_PER_BUILDING: '/api/agency-director/reports/expenses-per-building',
      EXPENSES_PER_OWNER: '/api/agency-director/reports/expenses-per-owner',
      INTERNAL_EXPENSES: '/api/agency-director/reports/internal-expenses',
      COMMISSIONS_PER_MONTH: '/api/agency-director/reports/commissions-per-month-per-building',
      ALL_BUILDINGS: '/api/agency-director/reports/all-buildings',
      UNPAID_RENT: '/api/agency-director/reports/unpaid-rent',
    },
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Get authentication headers
export const getAuthHeaders = (includeContentType = true): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    const tokenStr = String(token).trim();
    // Sanitize token to ensure it only contains ISO-8859-1 compatible characters
    const sanitizedToken = tokenStr
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        return (code >= 32 && code <= 126) ? char : '';
      })
      .join('');
    
    if (sanitizedToken && sanitizedToken.length > 0) {
      headers['Authorization'] = sanitizedToken;
    }
  }
  
  return headers;
};

// Parse JSON response
export const parseJson = async (response: Response): Promise<any> => {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('Failed to parse JSON response:', error);
    return null;
  }
};

// API request helper
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const hasContentType = options.headers && 
    (options.headers as Record<string, string>)['Content-Type'];
  
  const authHeaders = getAuthHeaders(!hasContentType);
  
  const defaultOptions: RequestInit = {
    headers: {
      ...authHeaders,
    },
  };

  const config: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized: Token may be missing or invalid');
      }
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          try {
            const errorJson = JSON.parse(errorData);
            errorMessage = errorJson.error || errorJson.message || errorMessage;
          } catch {
            errorMessage = errorData || errorMessage;
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      return text;
    }
  } catch (error) {
    console.error('API request failed:', error);
    console.error('URL:', url);
    console.error('Config:', config);
    
    if (error instanceof TypeError || (error as Error).message === 'Failed to fetch') {
      const corsError = new Error(
        'CORS Error: The API server is not allowing requests from this origin. ' +
        'Please contact the backend administrator to configure CORS headers. ' +
        `Frontend origin: ${window.location.origin}, ` +
        `API URL: ${url}`
      );
      corsError.name = 'CORSError';
      throw corsError;
    }
    
    throw error;
  }
};
