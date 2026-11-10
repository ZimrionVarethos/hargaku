import { Region, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { MOCK_REGIONS } from '../mock/regions.data';

export async function fetchRegions(): Promise<Region[]> {
  if (IS_MOCK || typeof window === 'undefined') {
    return MOCK_REGIONS;
  }

  try {
    const res = await apiClient<ApiResponse<Region[]>>('/regions');
    return res.data;
  } catch {
    return MOCK_REGIONS;
  }
}
