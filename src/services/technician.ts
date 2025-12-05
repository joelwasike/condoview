import { buildApiUrl, apiRequest } from '../config/api';

export const technicianService = {
  getOverview: async () => {
    return await apiRequest(buildApiUrl('/api/technician/overview'));
  },
  listInspections: async () => {
    return await apiRequest(buildApiUrl('/api/technician/inspections'));
  },
  createInspection: async (inspectionData: any) => {
    return await apiRequest(buildApiUrl('/api/technician/inspections'), {
      method: 'POST',
      body: JSON.stringify(inspectionData),
    });
  },
  uploadInspectionPhoto: async (inspectionId: string, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl(`/api/technician/inspections/${inspectionId}/photo`), {
      method: 'POST',
      headers: { Authorization: token || '' },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload photo');
    }
    return response.json();
  },
  listInventories: async () => {
    return await apiRequest(buildApiUrl('/api/technician/inventories'));
  },
  createInventory: async (inventoryData: any) => {
    return await apiRequest(buildApiUrl('/api/technician/inventories'), {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
  },
  listMaintenanceRequests: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    let url = buildApiUrl('/api/technician/maintenance-requests');
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  updateMaintenanceRequest: async (id: string, updateData: any) => {
    return await apiRequest(buildApiUrl(`/api/technician/maintenance-requests/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  listQuotes: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    let url = buildApiUrl('/api/technician/quotes');
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  submitQuote: async (quoteData: any) => {
    return await apiRequest(buildApiUrl('/api/technician/quotes'), {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },
  getWorkProgress: async (filters: any = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    let url = buildApiUrl('/api/technician/progress');
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    return await apiRequest(url);
  },
  getRepairProgressReport: async () => {
    return await apiRequest(buildApiUrl('/api/technician/progress/report'));
  },
  listTasks: async () => {
    return await apiRequest(buildApiUrl('/api/technician/tasks'));
  },
  createTask: async (taskData: any) => {
    return await apiRequest(buildApiUrl('/api/technician/tasks'), {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },
  updateTask: async (id: string, updateData: any) => {
    return await apiRequest(buildApiUrl(`/api/technician/tasks/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  getAdvertisements: async () => {
    return await apiRequest(buildApiUrl('/api/technician/advertisements'));
  },
};

