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
      if (axios.isAxiosError(error) && !error.response) {
        // Silently fail for network errors (API not running)
        return;
      }
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
    return response.data;
  },

  /**
   * Delete a lead (Admin only)
   */
  deleteLead: async (id: string): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    await axios.delete(`${API_BASE}/leads/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
