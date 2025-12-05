import { buildApiUrl, apiRequest } from '../config/api';

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  [key: string]: any;
}

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    return await apiRequest(buildApiUrl('/api/profile'));
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    return await apiRequest(buildApiUrl('/api/profile'), {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    return await apiRequest(buildApiUrl('/api/profile/change-password'), {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },
};

