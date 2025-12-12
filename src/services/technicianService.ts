import { API_CONFIG, buildApiUrl, apiRequest } from '@/config/api';

export const technicianService = {
  // Overview APIs
  getOverview: async () => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.OVERVIEW), {
      method: 'GET',
    });
  },

  // Inspection APIs
  listInspections: async () => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.INSPECTIONS), {
      method: 'GET',
    });
  },

  createInspection: async (inspectionData: any) => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.INSPECTIONS), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData),
    });
  },

  uploadInspectionPhoto: async (inspectionId: number, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    return apiRequest(buildApiUrl(`${API_CONFIG.ENDPOINTS.TECHNICIAN.INSPECTIONS}/${inspectionId}/photo`), {
      method: 'POST',
      body: formData,
    });
  },

  // Inventory APIs
  listInventories: async () => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.INVENTORIES), {
      method: 'GET',
    });
  },

  createInventory: async (inventoryData: any) => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.INVENTORIES), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventoryData),
    });
  },

  // Maintenance APIs (from tenant requests)
  listMaintenanceRequests: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.MAINTENANCE_REQUESTS);
    const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    
    return apiRequest(fullUrl, {
      method: 'GET',
    });
  },

  updateMaintenanceRequest: async (id: number, updateData: any) => {
    return apiRequest(buildApiUrl(`${API_CONFIG.ENDPOINTS.TECHNICIAN.MAINTENANCE_REQUESTS}/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
  },

  // Quote APIs
  listQuotes: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.QUOTES);
    const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    
    return apiRequest(fullUrl, {
      method: 'GET',
    });
  },

  submitQuote: async (quoteData: any) => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.QUOTES), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData),
    });
  },

  // Progress APIs
  getWorkProgress: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.PROGRESS);
    const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    
    return apiRequest(fullUrl, {
      method: 'GET',
    });
  },

  getRepairProgressReport: async () => {
    return apiRequest(buildApiUrl(`${API_CONFIG.ENDPOINTS.TECHNICIAN.PROGRESS}/report`), {
      method: 'GET',
    });
  },

  // Task APIs
  listTasks: async () => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.TASKS), {
      method: 'GET',
    });
  },

  createTask: async (taskData: any) => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.TASKS), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (id: number, updateData: any) => {
    return apiRequest(buildApiUrl(`${API_CONFIG.ENDPOINTS.TECHNICIAN.TASKS}/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
  },

  // Get advertisements
  getAdvertisements: async () => {
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TECHNICIAN.ADVERTISEMENTS));
  },
};
