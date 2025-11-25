import axios from 'axios';
import { Property } from '@/types/property';
import propertiesData from '@/data/properties.json';

// Use Vercel API URL or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Fallback to static data if API fails
let staticPropertiesCache: Property[] | null = null;

async function loadStaticProperties(): Promise<Property[]> {
  if (staticPropertiesCache) {
    return staticPropertiesCache;
  }
  
  try {
    // Use the directly imported JSON data
    staticPropertiesCache = propertiesData as Property[];
    return staticPropertiesCache;
  } catch (error) {
    console.error('Failed to load static properties:', error);
    return [];
  }
}

export const propertiesApi = {
  /**
   * Get all properties from the pipeline API
   * Falls back to static JSON if API is unavailable or returns empty
   */
  getAll: async (): Promise<Property[]> => {
    try {
      // Remove /api prefix since baseURL already includes it
      const response = await api.get<Property[]>('/properties');
      // If API returns data, use it; otherwise fall back to static data
      if (response.data && response.data.length > 0) {
        return response.data;
      } else {
        console.warn('Pipeline API returned empty data, using static data');
        return loadStaticProperties();
      }
    } catch (error) {
      // Silently fall back to static data in development
      if (import.meta.env.DEV) {
        return loadStaticProperties();
      }
      console.warn('Pipeline API unavailable, falling back to static data:', error);
      return loadStaticProperties();
    }
  },

  /**
   * Get a single property by ID
   */
  getById: async (id: string): Promise<Property | null> => {
    try {
      // Remove /api prefix since baseURL already includes it
      const response = await api.get<Property>(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Pipeline API unavailable, searching static data:', error);
      const staticProps = await loadStaticProperties();
      return staticProps.find(p => p.id === id) || null;
    }
  },

  /**
   * Get a property by slug
   */
  getBySlug: async (slug: string): Promise<Property | null> => {
    try {
      const allProperties = await propertiesApi.getAll();
      return allProperties.find(p => p.slug === slug) || null;
    } catch (error) {
      console.error('Error fetching property by slug:', error);
      return null;
    }
  },
};

