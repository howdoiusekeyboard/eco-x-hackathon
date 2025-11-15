import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  userType: 'farmer' | 'industry';
  createdAt: Timestamp | Date | string;
}

// Location Type
export interface Location {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  district?: string;
}

// Waste Batch Types
export type WasteStatus = 'pending' | 'matched' | 'collected' | 'delivered' | 'match_failed';

export interface WasteBatch {
  id: string;
  farmerId: string;
  farmerName?: string;
  wasteType: string;
  quantityKg: number;
  moistureLevel?: string;
  season?: string;
  location: Location;
  photoUrl?: string;
  qualityScore?: number;
  status: WasteStatus;
  matchId?: string;
  matchedIndustry?: string;
  estimatedValue?: number;
  co2SavedTons?: number;
  pm25PreventedKg?: number;
  aiModel?: string;
  region?: string;
  district?: string;
  state?: string;
  country?: string;
  createdAt: Timestamp | Date | string;
  matchedAt?: Timestamp | Date | string;
  error?: string;
  failedAt?: Timestamp | Date | string;
}

// Industry Types
export interface Industry {
  id: string;
  name: string;
  type: string;
  location: Location;
  demandKg: number;
  preferredWasteTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  description: string;
  contact: string;
  isActive: boolean;
  capacity_kg_per_month?: number;
  createdAt: Timestamp | Date | string;
}

// AI Match Types
export type MatchStatus = 'autonomous_pending' | 'accepted' | 'rejected' | 'completed';

export interface AIMatch {
  id: string;
  wasteBatchId: string;
  farmerId: string;
  farmerName?: string;
  industryId: string;
  industryName: string;

  // Pricing
  pricePerKg: number;
  totalValue: number;
  currency: string;

  // AI Decision
  reasoning: string;
  matchScore: number;
  factors: {
    proximityScore: number;
    demandFitScore: number;
    qualityScore: number;
    priceScore: number;
  };
  logisticsNote?: string;
  environmentalImpact?: string;

  // Logistics
  distanceKm: number;
  decisionTimeSeconds: number;
  co2SavedTons: number;
  pm25PreventedKg: number;

  // Location
  region: string;
  district?: string;
  state?: string;
  country?: string;

  // Status
  status: MatchStatus;
  agentName: string;
  aiModel: string;

  // Timestamps
  timestamp: Timestamp | Date | string;
  createdAt: string;
  acceptedAt?: Timestamp | Date | string;

  // Waste Details
  wasteType: string;
  wasteQuantityKg: number;
  wasteLocation: Location;
  wastePhotoUrl?: string | null;
  wasteSeason?: string;
}

// IoT Reading Types
export interface IoTReading {
  id: string;
  wasteBatchId: string;
  temperatureCelsius: number;
  moisturePercent: number;
  weightKg: number;
  sensorLocation?: string;
  status?: 'healthy' | 'warning' | 'critical';
  timestamp: Timestamp | Date | string;
}

// Form Data Types (for UI forms)
export interface WasteSubmissionForm {
  wasteType: string;
  quantityKg: number;
  moistureLevel?: string;
  season?: string;
  photo: File | null;
  location?: Location;
}

export interface LoginForm {
  email?: string;
  phoneNumber?: string;
  password?: string;
  userType: 'farmer' | 'industry';
}
