// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://saafimmo-api.theliberec.com',
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Get authentication headers
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

// API request helper
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const hasContentType = options.headers && (options.headers as Record<string, string>)['Content-Type'];
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const corsError = new Error(
        'CORS Error: The API server is not allowing requests from this origin. ' +
        'Please contact the backend administrator to configure CORS headers. ' +
        `Frontend origin: ${window.location.origin}, ` +
        `API URL: ${url}`
      );
      throw corsError;
    }
    
    throw error;
  }
};

