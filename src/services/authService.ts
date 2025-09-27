// Authentication service for FarmIQ
const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: number;
  role: 'farmer' | 'vendor' | 'admin';
  name: string;
  username: string;
}

export interface LoginCredentials {
  role: 'farmer' | 'vendor' | 'admin';
  username: string;
  password: string;
}

export interface RegisterData {
  role: 'farmer' | 'vendor' | 'admin';
  name: string;
  phone: string;
  aadhar: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  redirectUrl?: string;
  message?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<{ ok: boolean; userId: number }> {
    return this.makeRequest<{ ok: boolean; userId: number }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getSession(): Promise<SessionResponse> {
    return this.makeRequest<SessionResponse>('/auth/session');
  }

  async logout(): Promise<{ ok: boolean }> {
    return this.makeRequest<{ ok: boolean }>('/auth/logout', {
      method: 'POST',
    });
  }

  // Helper method to get redirect URL based on role
  getRedirectUrl(role: 'farmer' | 'vendor' | 'admin'): string {
    switch (role) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }
}

export const authService = new AuthService();
