const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

export interface LoginResponse {
  success: boolean;
  token?: string;
  message: string;
}

/**
 * Login and store token
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || `Server error: ${response.status}`,
        };
      } catch {
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`,
        };
      }
    }

    const data: LoginResponse = await response.json();

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? `Connection error: ${error.message}` : 'Failed to connect to server. Make sure the API is running.',
    };
  }
}

/**
 * Logout and remove token
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Check if a token is present. This does NOT mean the token is still
 * valid - localStorage happily holds onto an expired JWT until something
 * clears it. Use verifyToken() before trusting this for anything that
 * gates rendering (e.g. the Dashboard), or you get an authenticated view
 * flashing briefly before the first real API call 401s and kicks the user
 * back to the login screen.
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

/**
 * Actually confirms the stored token is still valid against the server
 * (GET /api/auth/verify), rather than just checking that one exists.
 */
export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    // Network error, not an auth failure - don't punish the user for a
    // flaky connection by logging them out.
    return true;
  }
}

/**
 * Get auth token
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

