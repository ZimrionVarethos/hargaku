'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMapInstance, Marker as LeafletMarkerInstance } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarketItem {
  id: string;
  name: string;
  shortName?: string;
  latitude: number;
  longitude: number;
  priceText?: string;
  badgeText?: string;
  status?: 'cheaper' | 'average' | 'expensive';
  address?: string;
  hours?: string;
  specialty?: string;
}

interface LeafletMarketMapProps {
  markets: MapMarketItem[];
  activeMarketId?: string;
  onSelectMarket?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function LeafletMarketMap({
  markets,
  activeMarketId,
  onSelectMarket,
  center,
  zoom = 14,
  className = 'w-full h-full min-h-[360px] rounded-[18px]',
}: LeafletMarketMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Map<string, LeafletMarkerInstance>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !containerRef.current) return;

      const initialCenter: [number, number] =
        center ||
        (markets[0]
          ? [markets[0].latitude, markets[0].longitude]
          : [-6.591234, 106.792345]);

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapRef.current = map;

      renderMarkers(L, map);
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.flyTo(center, zoom, {
      duration: 1.0,
    });
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      if (mapRef.current) {
        renderMarkers(L, mapRef.current);
      }
    });
  }, [markets, activeMarketId]);

  useEffect(() => {
    if (!mapRef.current || !activeMarketId) return;
    const target = markets.find((m) => m.id === activeMarketId);
    if (target && target.latitude && target.longitude) {
      mapRef.current.flyTo([target.latitude, target.longitude], 15, {
        duration: 0.8,
      });
    }
  }, [activeMarketId, markets]);

  const renderMarkers = (L: typeof import('leaflet'), map: LeafletMapInstance) => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    markets.forEach((market) => {
      if (!market.latitude || !market.longitude) return;

      const isActive = market.id === activeMarketId;
      const isCheaper = market.status === 'cheaper';

      const htmlContent = `
        <div class="clay-leaflet-pin" style="transform: translate(-50%, -100%); transition: transform 0.2s ease;">
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: ${isActive ? '5px 12px' : '4px 9px'};
            background: ${isActive ? '#1B1A18' : '#FFFFFF'};
            color: ${isActive ? '#EEF773' : '#1B1A18'};
            border: ${isActive ? '2px solid #1B1A18' : '1.5px solid #1B1A18'};
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: ${
              isActive
                ? '0 6px 16px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.1)'
                : '0 2px 6px rgba(0,0,0,0.12)'
            };
            cursor: pointer;
            font-family: inherit;
          ">
            <span style="display: inline-block; width: 7px; height: 7px; border-radius: 9999px; background: ${
              isActive ? '#EEF773' : isCheaper ? '#15803D' : '#FF7714'
            };"></span>
            <span>${market.shortName || market.name}</span>
            ${
              market.priceText
                ? `<span style="
                    background: ${isActive ? '#EEF773' : isCheaper ? '#DCFCE7' : '#F4F3F0'};
                    color: ${isActive ? '#1B1A18' : isCheaper ? '#15803D' : '#6E6D67'};
                    padding: 1px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 700;
                  ">${market.priceText}</span>`
                : ''
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: htmlContent,
        className: 'clay-custom-marker-wrapper',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([market.latitude, market.longitude], {
        icon: customIcon,
        zIndexOffset: isActive ? 1000 : 100,
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px 2px;">
          <p style="font-size: 10px; font-weight: 700; color: #8C8B85; text-transform: uppercase; margin: 0 0 2px;">Pasar Tradisional</p>
          <h4 style="font-size: 14px; font-weight: 700; color: #1B1A18; margin: 0 0 4px;">${market.name}</h4>
          ${market.address ? `<p style="font-size: 11px; color: #6E6D67; margin: 0 0 6px;">${market.address}</p>` : ''}
          ${
            market.priceText
              ? `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: #FAF9F5; border: 1px solid #E5E3DE; border-radius: 6px; margin-top: 6px;">
                  <span style="font-size: 11px; color: #6E6D67;">Harga Pantauan</span>
                  <span style="font-size: 12px; font-weight: 700; color: #1B1A18;">${market.priceText}</span>
                </div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -28],
        closeButton: false,
      });

      marker.on('click', () => {
        if (onSelectMarket) {
          onSelectMarket(market.id);
        }
      });

      markersRef.current.set(market.id, marker);
    });
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[360px]" />
    </div>
  );
}
