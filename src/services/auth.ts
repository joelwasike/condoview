import { buildApiUrl } from '../config/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    [key: string]: any;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const url = buildApiUrl('/api/login');
    console.log('Login URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const rawText = await response.text();
      console.log('Login response text:', rawText.substring(0, 200));
      
      let data: LoginResponse;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        console.error('Failed to parse login response:', parseErr);
        throw new Error(rawText?.slice(0, 200) || 'Server returned non-JSON response');
      }

      if (!response.ok || !data?.token || !data?.user) {
        const message = (data as any)?.error || `Login failed (HTTP ${response.status})`;
        console.error('Login failed:', message);
        throw new Error(message);
      }

      console.log('Login successful, saving to localStorage');
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('User saved to localStorage:', data.user);

      return data;
    } catch (error) {
      console.error('Login fetch error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};

