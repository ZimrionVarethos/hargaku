'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Table, WarningCircle } from '@phosphor-icons/react';
import { useTheme } from '@/lib/store/theme-store';
import { applyPasarKuAtmosphere } from '@/components/landing/pasarku/BogorMapLayersHelper';
import {
  addPetaMapLayers,
  createPetaMarkerElement,
  fitCameraToMarkets,
  isValidCoordinate,
  updatePetaHaloData,
  type MapboxMarketItem,
} from './mapbox-market-helpers';

export type { MapboxMarketItem };

interface MapboxMarketMapProps {
  markets: MapboxMarketItem[];
  activeMarketId: string;
  onSelectMarket: (id: string) => void;
  onEnableLightMode?: () => void;
  focusSeq?: number;
  orbitSeq?: number;
  resetSeq?: number;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [106.798, -6.597];

export default function MapboxMarketMap({
  markets,
  activeMarketId,
  onSelectMarket,
  onEnableLightMode,
  focusSeq = 0,
  orbitSeq = 0,
  resetSeq = 0,
  className = 'w-full h-full',
}: MapboxMarketMapProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const marketsRef = useRef(markets);
  const activeIdRef = useRef(activeMarketId);
  const isDarkRef = useRef(isDark);
  const mapReadyRef = useRef(false);
  const onSelectMarketRef = useRef(onSelectMarket);
  const prevScopeKeyRef = useRef<string>('');

  const [mapboxToken, setMapboxToken] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    marketsRef.current = markets;
  }, [markets]);

  useEffect(() => {
    activeIdRef.current = activeMarketId;
  }, [activeMarketId]);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    onSelectMarketRef.current = onSelectMarket;
  }, [onSelectMarket]);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/map/config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json: { data?: { mapboxToken?: string } }) => {
        if (!active) return;
        setMapboxToken(json.data?.mapboxToken?.trim() || '');
        setConfigLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setMapboxToken('');
        setConfigLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!configLoaded || !mapboxToken || !containerRef.current || mapRef.current) return;

    const initialValid = marketsRef.current.filter(isValidCoordinate);
    const initialCenter: [number, number] = initialValid[0]
      ? [initialValid[0].longitude, initialValid[0].latitude]
      : DEFAULT_CENTER;

    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = mapboxToken;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/standard',
        center: initialCenter,
        zoom: 12.6,
        pitch: 48,
        bearing: -14,
        antialias: true,
      });
    } catch {
      setMapError('WebGL Mapbox tidak tersedia di peramban ini. Gunakan Mode Ringan.');
      return;
    }

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    map.on('style.load', () => {
      applyPasarKuAtmosphere(map, isDarkRef.current);
      addPetaMapLayers(map, marketsRef.current, activeIdRef.current, isDarkRef.current);
      prevScopeKeyRef.current = marketsRef.current.map((m) => m.id).join('|');
      fitCameraToMarkets(map, marketsRef.current, 0);
      mapReadyRef.current = true;
      setMapReady(true);
    });

    map.on('error', () => {
      if (!mapReadyRef.current) {
        setMapError('Layer peta Mapbox gagal dimuat. Periksa token Mapbox di Admin Console.');
      }
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapReadyRef.current = false;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [configLoaded, mapboxToken]);

  useEffect(() => {
    if (!containerRef.current || !mapReady) return;
    const obs = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    applyPasarKuAtmosphere(map, isDark);
  }, [isDark, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const valid = markets.filter(isValidCoordinate);
    updatePetaHaloData(map, valid, activeMarketId);

    const nextMarkers: mapboxgl.Marker[] = [];
    for (const item of valid) {
      const isSelected = item.id === activeMarketId;
      const el = createPetaMarkerElement(item, isSelected, isDark, () => {
        onSelectMarketRef.current(item.id);
        map.flyTo({
          center: [item.longitude, item.latitude],
          zoom: Math.max(map.getZoom(), 14.8),
          pitch: 56,
          bearing: -15,
          duration: 950,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom', offset: [0, -8] })
        .setLngLat([item.longitude, item.latitude])
        .addTo(map);
      marker.getElement().style.zIndex = isSelected ? '30' : '5';
      nextMarkers.push(marker);
    }

    markersRef.current = nextMarkers;
  }, [markets, activeMarketId, isDark, mapReady]);

  const marketScopeKey = useMemo(() => markets.map((m) => m.id).join('|'), [markets]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (prevScopeKeyRef.current !== marketScopeKey) {
      prevScopeKeyRef.current = marketScopeKey;
      fitCameraToMarkets(map, marketsRef.current, 900);
    }
  }, [marketScopeKey, mapReady]);

  useEffect(() => {
    if (resetSeq === 0 || !mapRef.current || !mapReady) return;
    fitCameraToMarkets(mapRef.current, marketsRef.current, 950);
  }, [resetSeq, mapReady]);

  useEffect(() => {
    if (focusSeq === 0 || !mapRef.current || !mapReady) return;
    const target = marketsRef.current.find((m) => m.id === activeIdRef.current && isValidCoordinate(m));
    if (!target) return;
    mapRef.current.flyTo({
      center: [target.longitude, target.latitude],
      zoom: 15.5,
      pitch: 58,
      bearing: -16,
      duration: 1050,
      essential: true,
    });
  }, [focusSeq, mapReady]);

  useEffect(() => {
    if (orbitSeq === 0 || !mapRef.current || !mapReady) return;
    const map = mapRef.current;
    map.easeTo({ bearing: map.getBearing() + 45, duration: 600 });
  }, [orbitSeq, mapReady]);

  return (
    <div className={`peta-mapbox-stage relative overflow-hidden bg-[var(--bg-stage)] ${className}`}>
      {!configLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-xs font-bold text-[#F9F3EE]">
          Menghubungkan Peta Spasial Mapbox dari server...
        </div>
      )}

      {configLoaded && (!mapboxToken || mapError) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 gap-3 bg-[var(--bg-muted)] text-[var(--text-primary)]">
          <WarningCircle size={32} weight="bold" className="text-[var(--accent-chili)]" />
          <p className="text-sm font-bold max-w-md">
            {mapError || 'Token Mapbox GL JS belum dikonfigurasi di Admin Console.'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] max-w-md">
            Masukkan token Mapbox melalui Admin &gt; Integrasi AI &amp; Peta, atau buka tabel peringkat lengkap menggunakan Mode Ringan.
          </p>
          {onEnableLightMode && (
            <button
              type="button"
              onClick={onEnableLightMode}
              className="market-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-2 mt-1"
            >
              <Table size={15} weight="bold" />
              <span>Buka Mode Ringan (Tabel Harga)</span>
            </button>
          )}
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
