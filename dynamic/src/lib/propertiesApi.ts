import axios from 'axios';
import { Property } from '@/types/property';

// Use Vercel API URL or fallback to localhost for development
// For Netlify: Ensure VITE_API_URL is set in environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const propertiesApi = {
  /**
   * Get all properties from the API
   * No static fallback - database only
   */
  getAll: async (): Promise<Property[]> => {
    if (!API_BASE_URL) {
      console.warn('API URL not configured. Please set VITE_API_URL environment variable.');
      return [];
    }

    try {
      const response = await api.get<Property[]>('/properties');
      
      if (!response.data) {
        console.warn('No properties found in database');
        return [];
      }

      // Ensure we return an array
      const properties = Array.isArray(response.data) ? response.data : [];
      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      
      // Don't throw in production, return empty array for graceful degradation
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          console.warn('API server is not available. Returning empty array.');
          return [];
        }
        if (error.response?.status === 404) {
          return [];
        }
        // In production, return empty array instead of throwing
        if (import.meta.env.PROD) {
          return [];
        }
        throw new Error(error.response?.data?.error || 'Failed to fetch properties');
      }
      
      // In production, return empty array instead of throwing
      if (import.meta.env.PROD) {
        return [];
      }
      throw new Error('Failed to fetch properties');
    }
  },

  /**
   * Get a single property by ID
   */
  getById: async (id: string): Promise<Property | null> => {
    if (!API_BASE_URL || !id) {
      return null;
    }

    try {
      const response = await api.get<Property>(`/properties/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching property:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
          return null;
        }
        if (import.meta.env.PROD) {
          return null;
        }
      }
      
      if (import.meta.env.PROD) {
        return null;
      }
      throw new Error('Failed to fetch property');
    }
  },

  /**
   * Get a property by slug
   */
  getBySlug: async (slug: string): Promise<Property | null> => {
    if (!slug) {
      return null;
    }

    try {
      const allProperties = await propertiesApi.getAll();
      const property = allProperties.find(p => p?.slug === slug);
      return property || null;
    } catch (error) {
      console.error('Error fetching property by slug:', error);
      return null;
    }
  },
};
