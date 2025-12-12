import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const tenantService = {
  // Payment APIs
  recordPayment: async (paymentData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.PAYMENTS);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  listPayments: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.PAYMENTS);
    return await apiRequest(url);
  },

  approvePayment: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.PAYMENTS}/${paymentId}/approve`);
    return await apiRequest(url, {
      method: 'POST'
    });
  },

  rejectPayment: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.PAYMENTS}/${paymentId}/reject`);
    return await apiRequest(url, {
      method: 'POST'
    });
  },

  generateReceipt: async (paymentId: number) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.PAYMENTS}/${paymentId}/receipt`);
    return await apiRequest(url, {
      method: 'POST'
    });
  },

  // Maintenance APIs
  createMaintenance: async (maintenanceData: any) => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.MAINTENANCE);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(maintenanceData)
    });
  },

  listMaintenance: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.MAINTENANCE);
    return await apiRequest(url);
  },

  // Overview APIs
  getOverview: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.OVERVIEW);
    return await apiRequest(url);
  },

  getLeaseInfo: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.LEASE);
    return await apiRequest(url);
  },

  // Get advertisements
  getAdvertisements: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.ADVERTISEMENTS);
    return await apiRequest(url);
  },

  // Terminate lease
  terminateLease: async (terminationData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.LEASE}/terminate`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        reason: terminationData.reason,
        terminationDate: terminationData.terminationDate,
        comments: terminationData.comments,
        securityDepositRefundMethod: terminationData.securityDepositRefundMethod,
        inventoryCheckDate: terminationData.inventoryCheckDate
      })
    });
  },

  // Transfer payment request
  transferPaymentRequest: async (transferData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.PAYMENTS}/transfer`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        property: transferData.property || '',
        recipientIDCardNumber: transferData.recipientIdCard,
        recipientEntryDate: transferData.entryDate,
        recipientName: transferData.recipientName,
        recipientEmail: transferData.recipientEmail,
        recipientPhone: transferData.recipientPhone,
        relationship: transferData.relationship,
        reason: transferData.reason
      })
    });
  },

  // Upload profile picture
  uploadProfilePicture: async (profilePictureURL: string) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.BASE}/profile/picture`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        profilePictureURL: profilePictureURL
      })
    });
  },

  // Security Deposit Payment
  paySecurityDeposit: async (depositData: any) => {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.TENANT.DEPOSITS}/payment`);
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(depositData)
    });
  },

  // Get security deposit status
  getSecurityDeposit: async () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TENANT.DEPOSITS);
    return await apiRequest(url);
  }
};
