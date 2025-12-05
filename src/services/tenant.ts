import { buildApiUrl, apiRequest } from '../config/api';

export const tenantService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/overview'));
  },
  listPayments: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/payments'));
  },
  recordPayment: async (paymentData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/payments'), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  approvePayment: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/tenant/payments/${paymentId}/approve`), {
      method: 'POST',
    });
  },
  rejectPayment: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/tenant/payments/${paymentId}/reject`), {
      method: 'POST',
    });
  },
  generateReceipt: async (paymentId: string) => {
    return await apiRequest(buildApiUrl(`/api/tenant/payments/${paymentId}/receipt`), {
      method: 'POST',
    });
  },
  listMaintenance: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/maintenance'));
  },
  createMaintenance: async (maintenanceData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/maintenance'), {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  },
  getLeaseInfo: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/lease'));
  },
  terminateLease: async (terminationData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/lease/terminate'), {
      method: 'POST',
      body: JSON.stringify({
        reason: terminationData.reason,
        terminationDate: terminationData.terminationDate,
        comments: terminationData.comments,
        securityDepositRefundMethod: terminationData.securityDepositRefundMethod,
        inventoryCheckDate: terminationData.inventoryCheckDate,
      }),
    });
  },
  transferPaymentRequest: async (transferData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/payments/transfer'), {
      method: 'POST',
      body: JSON.stringify({
        property: transferData.property || '',
        recipientIDCardNumber: transferData.recipientIdCard,
        recipientEntryDate: transferData.entryDate,
        recipientName: transferData.recipientName,
        recipientEmail: transferData.recipientEmail,
        recipientPhone: transferData.recipientPhone,
        relationship: transferData.relationship,
        reason: transferData.reason,
      }),
    });
  },
  paySecurityDeposit: async (depositData: any) => {
    return await apiRequest(buildApiUrl('/api/tenant/deposits/payment'), {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  },
  getSecurityDeposit: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/deposits'));
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/tenant/advertisements'));
  },
};

