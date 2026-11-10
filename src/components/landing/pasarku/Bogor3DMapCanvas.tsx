'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WarningCircle } from '@phosphor-icons/react';
import { BOGOR_MAP_CENTER, type BogorMarket } from '@/lib/data/bogor-markets';
import { useTheme } from '@/lib/store/theme-store';
import { Bogor3DMarketCustomLayer } from './Bogor3DMarketCustomLayer';
import { Bogor3DMapOverlay } from './Bogor3DMapOverlay';
import {
  addPasarKuDesignLayers,
  applyPasarKuAtmosphere,
  updatePasarKuHaloData,
} from './BogorMapLayersHelper';

interface Props {
  allMarkets: BogorMarket[];
  visibleMarkets: BogorMarket[];
  activeMarketId: string;
  flyRequestSeq: number;
  onSelectMarket: (marketId: string, shouldFly?: boolean) => void;
}

export function Bogor3DMapCanvas({
  allMarkets,
  visibleMarkets,
  activeMarketId,
  flyRequestSeq,
  onSelectMarket,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const customLayerRef = useRef<Bogor3DMarketCustomLayer | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; btn: HTMLButtonElement }>>(
    new Map()
  );

  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const activeMarket =
    allMarkets.find((m) => m.id === activeMarketId) || visibleMarkets[0] || allMarkets[0];

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

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: BOGOR_MAP_CENTER,
      zoom: 12.75,
      pitch: 56,
      bearing: -20,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    mapRef.current = map;

    map.on('style.load', () => {
      applyPasarKuAtmosphere(map, isDark);
      addPasarKuDesignLayers(map, allMarkets, activeMarketId, isDark);

      const layer = new Bogor3DMarketCustomLayer(allMarkets, BOGOR_MAP_CENTER, activeMarketId, isDark);
      customLayerRef.current = layer;
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer);
      }

      for (const m of allMarkets) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.marketId = m.id;
        btn.className =
          'px-2.5 py-1 rounded-full border-2 text-[10px] font-bold shadow-md transition-transform hover:scale-105 cursor-pointer whitespace-nowrap';
        btn.textContent = `${m.code.replace('UNIT ', '#')} ${m.shortName.replace('Pasar ', '')}`;
        btn.onclick = () => onSelectMarket(m.id, true);

        const marker = new mapboxgl.Marker({ element: btn, anchor: 'bottom', offset: [0, -14] })
          .setLngLat([m.lng, m.lat])
          .addTo(map);
        markersRef.current.set(m.id, { marker, btn });
      }
      setMapReady(true);
    });

    map.on('error', () => {
      setMapError('Layer peta Mapbox gagal dimuat. Periksa token Mapbox di Admin Console.');
    });

    const markersMap = markersRef.current;
    return () => {
      markersMap.forEach(({ marker }) => marker.remove());
      markersMap.clear();
      customLayerRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // Intentionally initialize Mapbox once per loaded token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configLoaded, mapboxToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    applyPasarKuAtmosphere(map, isDark);
  }, [isDark, mapReady]);

  useEffect(() => {
    if (!containerRef.current || !mapReady) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        customLayerRef.current?.setAnimating(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const visibleIds = visibleMarkets.map((m) => m.id);
    const visibleSet = new Set(visibleIds);

    updatePasarKuHaloData(map, visibleMarkets, activeMarketId);
    customLayerRef.current?.setState({ activeMarketId, visibleIds, isDark });

    markersRef.current.forEach(({ btn }, id) => {
      const isSelected = id === activeMarketId;
      const isShown = visibleSet.has(id);
      btn.style.display = isShown ? 'inline-flex' : 'none';
      btn.style.backgroundColor = isSelected ? '#EEF773' : isDark ? '#16241D' : '#FFFFFF';
      btn.style.color = isSelected ? '#132E20' : isDark ? '#F9F3EE' : '#132E20';
      btn.style.borderColor = isSelected ? '#A92717' : '#132E20';
      btn.style.transform = isSelected ? 'scale(1.12)' : 'scale(1)';
      btn.style.zIndex = isSelected ? '20' : '5';
    });
  }, [activeMarketId, visibleMarkets, isDark, mapReady]);

  useEffect(() => {
    if (flyRequestSeq === 0 || !mapRef.current || !mapReady || !activeMarket) return;
    const idx = allMarkets.findIndex((m) => m.id === activeMarket.id);
    mapRef.current.flyTo({
      center: [activeMarket.lng, activeMarket.lat],
      zoom: 16.1,
      pitch: 64,
      bearing: ((idx * 25) % 80) - 40,
      duration: 1250,
      essential: true,
    });
  }, [flyRequestSeq, activeMarket, allMarkets, mapReady]);

  const handleResetOverview = () => {
    mapRef.current?.flyTo({
      center: BOGOR_MAP_CENTER,
      zoom: 12.75,
      pitch: 56,
      bearing: -20,
      duration: 1100,
    });
  };

  const handleOrbit = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ bearing: map.getBearing() + 45, duration: 650 });
  };

  return (
    <div className="market-card relative w-full h-[430px] sm:h-[490px] overflow-hidden bg-[var(--bg-stage)]">
      {!configLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#F9F3EE]">
          Menghubungkan Peta 3D Mapbox dari database Supabase...
        </div>
      )}

      {configLoaded && (!mapboxToken || mapError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-3 bg-[var(--bg-muted)] text-[var(--text-primary)]">
          <WarningCircle size={28} weight="bold" className="text-[var(--accent-chili)]" />
          <p className="text-sm font-bold">
            {mapError || 'Token Mapbox 3D belum diatur di database Supabase.'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] max-w-md">
            Masuk ke Dashboard Admin &gt; Integrasi AI &amp; Peta untuk memasukkan token Mapbox GL JS agar peta 3D bangunan 13 unit pasar aktif otomatis.
          </p>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      {mapReady && (
        <Bogor3DMapOverlay
          activeMarket={activeMarket}
          onFocusMarket={(id) => onSelectMarket(id, true)}
          onOrbit={handleOrbit}
          onResetOverview={handleResetOverview}
        />
      )}
    </div>
  );
}
