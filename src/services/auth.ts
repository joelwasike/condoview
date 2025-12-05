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
    const response = await fetch(buildApiUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const rawText = await response.text();
    let data: LoginResponse;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseErr) {
      throw new Error(rawText?.slice(0, 200) || 'Server returned non-JSON response');
    }

    if (!response.ok || !data?.token || !data?.user) {
      const message = (data as any)?.error || `Login failed (HTTP ${response.status})`;
      throw new Error(message);
    }

    // Save to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
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

