export interface ParkingSpot {
  parkingSpotId: number;
  parkingSpotName: string;
  isReserved: boolean;
}

export interface ParkingStats {
  availableCount: number;
  totalCount: number;
  occupancyRate: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}