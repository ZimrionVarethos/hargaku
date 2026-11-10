export type CommodityCategory =
  | 'CABAI_BAWANG'
  | 'BERAS'
  | 'DAGING'
  | 'MINYAK'
  | 'SAYUR';

export interface AdminCommodity {
  id: string;
  name: string;
  slug: string;
  category: CommodityCategory;
  unit: string;
  hapHetPrice: number;
  tolerancePercentage: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface AdminMarket {
  id: string;
  regionId?: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  specialty: string;
  isActive: boolean;
}

export interface DailyPriceRecord {
  marketId: string;
  commodityId: string;
  price: number;
  recordedDate: string;
  previousPrice?: number;
}

export interface AdminReport {
  id: string;
  commodityName: string;
  marketName: string;
  reportedPrice: number;
  unit: string;
  normalizedPricePerKg: number;
  officialHapPrice: number;
  cityAvgPrice: number;
  diffPercent: number;
  submittedAt: string;
  hasPhoto: boolean;
  photoUrl?: string;
  citizenNotes?: string;
  status: 'PENDING' | 'ANOMALY' | 'APPROVED' | 'REJECTED';
  anomalyReason?: string;
  exifSanitized: boolean;
}

export type AdminModule =
  | 'overview'
  | 'reports'
  | 'commodities'
  | 'markets'
  | 'daily-prices'
  | 'settings';

export interface AdminUserProfile {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  role: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AdminState {
  currentUser: AdminUserProfile;
  commodities: AdminCommodity[];
  markets: AdminMarket[];
  dailyPrices: Record<string, DailyPriceRecord>; // key: `${marketId}_${commodityId}`
  reports: AdminReport[];
}

export type AdminAction =
  | { type: 'SET_STATE'; payload: AdminState }
  | { type: 'UPDATE_PROFILE'; payload: Partial<AdminUserProfile> }
  | { type: 'ADD_COMMODITY'; payload: AdminCommodity }
  | { type: 'UPDATE_COMMODITY'; payload: Partial<AdminCommodity> & { id: string } }
  | { type: 'DELETE_COMMODITY'; payload: string }
  | { type: 'ADD_MARKET'; payload: AdminMarket }
  | { type: 'UPDATE_MARKET'; payload: Partial<AdminMarket> & { id: string } }
  | { type: 'DELETE_MARKET'; payload: string }
  | {
      type: 'UPDATE_DAILY_PRICES';
      payload: {
        marketId: string;
        recordedDate: string;
        entries: Array<{ commodityId: string; price: number }>;
      };
    }
  | { type: 'ADD_REPORT'; payload: AdminReport }
  | { type: 'APPROVE_REPORT'; payload: string }
  | { type: 'REJECT_REPORT'; payload: { id: string; reason?: string } }
  | { type: 'REQUEST_REPORT_INFO'; payload: { id: string; note: string } }
  | { type: 'RESET_DEFAULT' };
