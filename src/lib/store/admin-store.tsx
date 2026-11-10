'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import type {
  AdminCommodity,
  AdminMarket,
  DailyPriceRecord,
  AdminReport,
  AdminUserProfile,
  AdminState,
  AdminAction,
} from '../types/admin';
import { INITIAL_ADMIN_STATE, adminStoreReducer } from './admin-state';
import { getAdminAuthHeaders } from '../auth/admin-auth';

interface AdminStoreContextType {
  isLoaded: boolean;
  dataSource: 'supabase' | 'fallback';
  currentUser: AdminUserProfile;
  commodities: AdminCommodity[];
  markets: AdminMarket[];
  dailyPrices: Record<string, DailyPriceRecord>;
  reports: AdminReport[];
  updateProfile: (patch: Partial<AdminUserProfile>) => void;
  addCommodity: (commodity: AdminCommodity) => void;
  updateCommodity: (id: string, patch: Partial<AdminCommodity>) => void;
  deleteCommodity: (id: string) => void;
  addMarket: (market: AdminMarket) => void;
  updateMarket: (id: string, patch: Partial<AdminMarket>) => void;
  deleteMarket: (id: string) => void;
  updateDailyPrices: (
    marketId: string,
    recordedDate: string,
    entries: Array<{ commodityId: string; price: number }>
  ) => void;
  addReport: (report: AdminReport, skipServerSync?: boolean) => void;
  approveReport: (id: string) => void;
  rejectReport: (id: string, reason?: string) => void;
  requestReportInfo: (id: string, note: string) => void;
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'hargaku_admin_store_v3';

const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

async function syncAdminMutation(
  action: AdminAction,
  extra?: { mergedCommodity?: AdminCommodity; mergedMarket?: AdminMarket }
) {
  try {
    await fetch('/api/v1/admin/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({ action, ...extra }),
    });
  } catch {
    // Keep optimistic client state if server is temporarily unreachable
  }
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminStoreReducer, INITIAL_ADMIN_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('fallback');
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let active = true;

    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('hargaku_admin_store_v2') ||
        localStorage.getItem('hargaku_admin_store_v1');

      if (saved) {
        const parsed = JSON.parse(saved) as AdminState;
        if (parsed && Array.isArray(parsed.commodities) && Array.isArray(parsed.markets)) {
          const isOldBogorOnly = parsed.markets.length <= 5;
          dispatch({
            type: 'SET_STATE',
            payload: {
              ...INITIAL_ADMIN_STATE,
              ...parsed,
              markets: isOldBogorOnly ? INITIAL_ADMIN_STATE.markets : parsed.markets,
              dailyPrices: isOldBogorOnly
                ? { ...INITIAL_ADMIN_STATE.dailyPrices, ...parsed.dailyPrices }
                : parsed.dailyPrices,
            },
          });
        }
      }
      localStorage.removeItem('hargaku_admin_store_v1');
      localStorage.removeItem('hargaku_admin_store_v2');
    } catch {
      // Fallback silently to initial state
    }

    fetch('/api/v1/admin/bootstrap', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json: { success?: boolean; data?: Partial<AdminState> & { source?: 'supabase' | 'fallback' } }) => {
        if (!active || !json?.success || !json.data) return;
        const serverData = json.data;
        if (serverData.source === 'supabase') setDataSource('supabase');
        if (Array.isArray(serverData.commodities) && Array.isArray(serverData.markets)) {
          dispatch({
            type: 'SET_STATE',
            payload: {
              ...stateRef.current,
              commodities: serverData.commodities,
              markets: serverData.markets,
              dailyPrices: serverData.dailyPrices || stateRef.current.dailyPrices,
              reports: Array.isArray(serverData.reports) ? serverData.reports : stateRef.current.reports,
            },
          });
        }
      })
      .catch(() => {
        // Offline or unreachable fallback uses cached local data
      })
      .finally(() => {
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [state, isLoaded]);

  const updateProfile = useCallback((patch: Partial<AdminUserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: patch });
  }, []);

  const addCommodity = useCallback((commodity: AdminCommodity) => {
    const action: AdminAction = { type: 'ADD_COMMODITY', payload: commodity };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const updateCommodity = useCallback((id: string, patch: Partial<AdminCommodity>) => {
    const current = stateRef.current.commodities.find((c) => c.id === id);
    const mergedCommodity = current ? { ...current, ...patch, id } : undefined;
    const action: AdminAction = { type: 'UPDATE_COMMODITY', payload: { ...patch, id } };
    dispatch(action);
    void syncAdminMutation(action, { mergedCommodity });
  }, []);

  const deleteCommodity = useCallback((id: string) => {
    const action: AdminAction = { type: 'DELETE_COMMODITY', payload: id };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const addMarket = useCallback((market: AdminMarket) => {
    const action: AdminAction = { type: 'ADD_MARKET', payload: market };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const updateMarket = useCallback((id: string, patch: Partial<AdminMarket>) => {
    const current = stateRef.current.markets.find((m) => m.id === id);
    const mergedMarket = current ? { ...current, ...patch, id } : undefined;
    const action: AdminAction = { type: 'UPDATE_MARKET', payload: { ...patch, id } };
    dispatch(action);
    void syncAdminMutation(action, { mergedMarket });
  }, []);

  const deleteMarket = useCallback((id: string) => {
    const action: AdminAction = { type: 'DELETE_MARKET', payload: id };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const updateDailyPrices = useCallback(
    (marketId: string, recordedDate: string, entries: Array<{ commodityId: string; price: number }>) => {
      const action: AdminAction = {
        type: 'UPDATE_DAILY_PRICES',
        payload: { marketId, recordedDate, entries },
      };
      dispatch(action);
      void syncAdminMutation(action);
    },
    []
  );

  const addReport = useCallback((report: AdminReport, skipServerSync = false) => {
    const action: AdminAction = { type: 'ADD_REPORT', payload: report };
    dispatch(action);
    if (!skipServerSync) void syncAdminMutation(action);
  }, []);

  const approveReport = useCallback((id: string) => {
    const action: AdminAction = { type: 'APPROVE_REPORT', payload: id };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const rejectReport = useCallback((id: string, reason?: string) => {
    const action: AdminAction = { type: 'REJECT_REPORT', payload: { id, reason } };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const requestReportInfo = useCallback((id: string, note: string) => {
    const action: AdminAction = { type: 'REQUEST_REPORT_INFO', payload: { id, note } };
    dispatch(action);
    void syncAdminMutation(action);
  }, []);

  const resetToDefaultData = useCallback(() => {
    const action: AdminAction = { type: 'RESET_DEFAULT' };
    dispatch(action);
    void syncAdminMutation(action);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <AdminStoreContext.Provider
      value={{
        isLoaded,
        dataSource,
        currentUser: state.currentUser || INITIAL_ADMIN_STATE.currentUser,
        commodities: state.commodities,
        markets: state.markets,
        dailyPrices: state.dailyPrices,
        reports: state.reports,
        updateProfile,
        addCommodity,
        updateCommodity,
        deleteCommodity,
        addMarket,
        updateMarket,
        deleteMarket,
        updateDailyPrices,
        addReport,
        approveReport,
        rejectReport,
        requestReportInfo,
        resetToDefaultData,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore(): AdminStoreContextType {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return context;
}
