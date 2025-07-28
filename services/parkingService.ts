import axios from 'axios';
import { ParkingSpot } from '@/types/parking';

// Configure your Spring Boot backend URL

//CHANGE THIS TO YO DEVICE'S CURRENT IP
export const BASE_URL = 'http://localhost:8080/firstParkingBackEnd';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const parkingService = {
  // Fetch all parking spots
  async getAllParkingSpots(): Promise<ParkingSpot[]> {
    try {
      const response = await api.get('/parkingSpot');
      return response.data;
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      throw new Error('Failed to fetch parking spots');
    }
  },

  // Fetch occupied count
  async getOccupiedCount(): Promise<number> {
    try {
      const response = await api.get('/parkingSpot/occupied-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching occupied count:', error);
      throw new Error('Failed to fetch occupied count');
    }
  },

  // Get parking statistics
  async getParkingStats(): Promise<{ available: number; total: number; occupancyRate: number }> {
    try {
      const [spotsResponse, occupiedResponse] = await Promise.all([
        this.getAllParkingSpots(),
        this.getOccupiedCount()
      ]);

      const total = spotsResponse.length;
      const occupied = occupiedResponse;
      const available = total - occupied;
      const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;

      return {
        available,
        total,
        occupancyRate
      };
    } catch (error) {
      console.error('Error fetching parking stats:', error);
      throw new Error('Failed to fetch parking statistics');
    }
  }
};
