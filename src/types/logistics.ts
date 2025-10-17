export interface Geolocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Crate {
  id: string;
  trackId: string;
  unitName: string;
  status: 'Loaded' | 'In Transit' | 'Verified' | 'Delivered';
  position: { row: number; col: number };
  color: string;
}

export interface Checkpoint {
  id: string;
  crateId: string;
  trackId: string;
  unitName: string;
  geolocation: Geolocation;
  report: string;
  operator: string;
  timestamp: number;
  transactionHash?: string;
  verified: boolean;
  flagged: boolean;
  auditorNotes?: string;
}

export interface Track {
  id: string;
  name: string;
  status: 'Active' | 'In Transit' | 'Completed';
  crates: Crate[];
  currentLocation?: Geolocation;
}

