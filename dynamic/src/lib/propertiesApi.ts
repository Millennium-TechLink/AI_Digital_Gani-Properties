import axios from 'axios';
import { Property } from '@/types/property';

// Use environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for API calls
});

/**
 * Custom error class for API errors
 */
export class PropertiesApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'PropertiesApiError';
  }
}

export const propertiesApi = {
  /**
   * Get all properties from the API
   * Fully dynamic - no static fallback
   * @throws {PropertiesApiError} If API call fails
   */
  getAll: async (): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>('/properties');
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new PropertiesApiError('Invalid response format from API');
      }
      
      if (response.data.length === 0) {
        console.warn('API returned empty properties array');
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.error || error.message || 'Failed to fetch properties';
        
        throw new PropertiesApiError(
          `Failed to fetch properties: ${message}`,
          statusCode,
          error
        );
      }
      
      throw new PropertiesApiError(
        'An unexpected error occurred while fetching properties',
        undefined,
        error
      );
    }
  },

  /**
   * Get a single property by ID
   * Fully dynamic - no static fallback
   * @throws {PropertiesApiError} If API call fails or property not found
   */
  getById: async (id: string): Promise<Property | null> => {
    try {
      const response = await api.get<Property>(`/properties/${id}`);
      
      if (!response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        
        if (statusCode === 404) {
          return null; // Property not found
        }
        
        const message = error.response?.data?.error || error.message || 'Failed to fetch property';
        throw new PropertiesApiError(
          `Failed to fetch property: ${message}`,
          statusCode,
          error
        );
      }
      
      throw new PropertiesApiError(
        'An unexpected error occurred while fetching property',
        undefined,
        error
      );
    }
  },

  /**
   * Get a property by slug
   * Fetches all properties and filters by slug
   * @throws {PropertiesApiError} If API call fails
   */
  getBySlug: async (slug: string): Promise<Property | null> => {
    try {
      const allProperties = await propertiesApi.getAll();
      return allProperties.find(p => p.slug === slug) || null;
    } catch (error) {
      if (error instanceof PropertiesApiError) {
        throw error;
      }
      
      throw new PropertiesApiError(
        'Failed to fetch property by slug',
        undefined,
        error
      );
    }
  },

  /**
   * Create a new property
   * @throws {PropertiesApiError} If API call fails
   */
  create: async (property: Omit<Property, 'id' | 'slug' | 'postedAt'>): Promise<Property> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new PropertiesApiError('Authentication required', 401);
      }

      const response = await api.post<Property>('/properties', property, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.data) {
        throw new PropertiesApiError('Invalid response format from API');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.error || error.message || 'Failed to create property';
        
        throw new PropertiesApiError(
          `Failed to create property: ${message}`,
          statusCode,
          error
        );
      }
      
      if (error instanceof PropertiesApiError) {
        throw error;
      }
      
      throw new PropertiesApiError(
        'An unexpected error occurred while creating property',
        undefined,
        error
      );
    }
  },

  /**
   * Update an existing property
   * @throws {PropertiesApiError} If API call fails
   */
  update: async (id: string, updates: Partial<Omit<Property, 'id' | 'slug' | 'postedAt'>>): Promise<Property> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new PropertiesApiError('Authentication required', 401);
      }

      const response = await api.put<Property>(`/properties/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.data) {
        throw new PropertiesApiError('Invalid response format from API');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.error || error.message || 'Failed to update property';
        
        throw new PropertiesApiError(
          `Failed to update property: ${message}`,
          statusCode,
          error
        );
      }
      
      if (error instanceof PropertiesApiError) {
        throw error;
      }
      
      throw new PropertiesApiError(
        'An unexpected error occurred while updating property',
        undefined,
        error
      );
    }
  },

  /**
   * Delete a property
   * @throws {PropertiesApiError} If API call fails
   */
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new PropertiesApiError('Authentication required', 401);
      }

      await api.delete(`/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.error || error.message || 'Failed to delete property';
        
        throw new PropertiesApiError(
          `Failed to delete property: ${message}`,
          statusCode,
          error
        );
      }
      
      if (error instanceof PropertiesApiError) {
        throw error;
      }
      
      throw new PropertiesApiError(
        'An unexpected error occurred while deleting property',
        undefined,
        error
      );
    }
  },
};
