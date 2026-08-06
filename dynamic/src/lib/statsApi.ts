import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

export interface SiteStats {
  totalVisits: number;
  totalLeads: number;
  dailyHits: Record<string, number>;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  submittedAt: string;
}

export const statsApi = {
  /**
   * Log a visit hit
   */
  logVisit: async (): Promise<void> => {
    try {
      // Use local storage to avoid double-counting in the same session
      const lastVisit = sessionStorage.getItem('gani_session_hit');
      if (lastVisit) return;
      
      await axios.post(`${API_BASE}/stats/visit`);
      sessionStorage.setItem('gani_session_hit', 'true');
    } catch (error) {
      console.error('Failed to log visit:', error);
    }
  },

  /**
   * Get all stats (Admin only)
   */
  getStats: async (): Promise<SiteStats> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_BASE}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // If /api/stats doesn't resolve to a real function, the SPA catch-all
    // rewrite serves index.html (200, HTML) instead of a real stats object.
    if (!response.data || typeof response.data !== 'object' || Array.isArray(response.data)) {
      console.error('statsApi.getStats: expected an object, got', typeof response.data);
      return { totalVisits: 0, totalLeads: 0, dailyHits: {} };
    }
    return response.data;
  },

  /**
   * Get all leads (Admin only)
   */
  getLeads: async (): Promise<Lead[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_BASE}/leads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Same SPA-fallback guard as above - leads.filter(...) runs at render
    // time in Dashboard, so a non-array here would crash the whole page.
    if (!Array.isArray(response.data)) {
      console.error('statsApi.getLeads: expected an array, got', typeof response.data);
      return [];
    }
    return response.data;
  },

  /**
   * Delete a lead (Admin only)
   */
  deleteLead: async (id: string): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    // ?id= instead of a path segment - this Vercel project doesn't resolve
    // bracket-dynamic function files (see properties/index.ts on the API
    // side for the full explanation), so every single-record route here
    // takes its id as a query param instead.
    await axios.delete(`${API_BASE}/leads`, {
      params: { id },
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
