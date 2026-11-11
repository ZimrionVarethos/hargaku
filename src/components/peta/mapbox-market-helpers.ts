import mapboxgl, { type GeoJSONSource, type Map as MapboxMap } from 'mapbox-gl';

export interface MapboxMarketItem {
  id: string;
  name: string;
  shortName: string;
  latitude: number;
  longitude: number;
  priceText: string;
  status: 'cheaper' | 'average' | 'expensive';
  nearStation?: boolean;
}

const HALO_SOURCE_ID = 'pasarku-peta-halos-source';
const HALO_LAYER_ID = 'pasarku-peta-halos';
const ACTIVE_HALO_LAYER_ID = 'pasarku-peta-active-halo';
const EXTRUSION_LAYER_ID = 'pasarku-peta-3d-buildings';

export function isValidCoordinate(m: MapboxMarketItem): boolean {
  return (
    Number.isFinite(m.latitude) &&
    Number.isFinite(m.longitude) &&
    Math.abs(m.latitude) <= 90 &&
    Math.abs(m.longitude) <= 180 &&
    !(m.latitude === 0 && m.longitude === 0)
  );
}

export function fitCameraToMarkets(
  map: MapboxMap,
  markets: MapboxMarketItem[],
  duration: number
): void {
  const valid = markets.filter(isValidCoordinate);
  if (valid.length === 0) return;

  if (valid.length === 1) {
    map.flyTo({
      center: [valid[0].longitude, valid[0].latitude],
      zoom: 13.8,
      pitch: 48,
      bearing: -14,
      duration,
      essential: true,
    });
    return;
  }

  const bounds = new mapboxgl.LngLatBounds();
  for (const m of valid) {
    bounds.extend([m.longitude, m.latitude]);
  }
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  if (Math.abs(sw.lng - ne.lng) < 0.0005 && Math.abs(sw.lat - ne.lat) < 0.0005) {
    map.flyTo({
      center: [valid[0].longitude, valid[0].latitude],
      zoom: 13.8,
      pitch: 48,
      duration,
      essential: true,
    });
    return;
  }

  map.fitBounds(bounds, {
    padding: { top: 82, right: 56, bottom: 185, left: 48 },
    maxZoom: 13.6,
    pitch: 44,
    duration,
    essential: true,
  });
}

export function buildPetaHaloGeoJson(
  markets: MapboxMarketItem[],
  activeMarketId: string
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: markets.filter(isValidCoordinate).map((m) => ({
      type: 'Feature',
      properties: {
        id: m.id,
        status: m.status,
        active: m.id === activeMarketId ? 1 : 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [m.longitude, m.latitude],
      },
    })),
  };
}

export function addPetaMapLayers(
  map: MapboxMap,
  markets: MapboxMarketItem[],
  activeMarketId: string,
  isDark: boolean
): void {
  if (!map.getSource(HALO_SOURCE_ID)) {
    map.addSource(HALO_SOURCE_ID, {
      type: 'geojson',
      data: buildPetaHaloGeoJson(markets, activeMarketId),
    });
  }

  if (!map.getLayer(HALO_LAYER_ID)) {
    map.addLayer({
      id: HALO_LAYER_ID,
      type: 'circle',
      source: HALO_SOURCE_ID,
      slot: 'middle',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 10, 11, 14, 15, 28],
        'circle-color': [
          'match',
          ['get', 'status'],
          'cheaper',
          '#245034',
          'expensive',
          '#A92717',
          '#A68F6D',
        ],
        'circle-opacity': 0.25,
        'circle-blur': 0.4,
      },
    });
  }

  if (!map.getLayer(ACTIVE_HALO_LAYER_ID)) {
    map.addLayer({
      id: ACTIVE_HALO_LAYER_ID,
      type: 'circle',
      source: HALO_SOURCE_ID,
      slot: 'middle',
      filter: ['==', ['get', 'active'], 1],
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 18, 11, 22, 15, 44],
        'circle-color': '#EEF773',
        'circle-opacity': 0.3,
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#EEF773',
      },
    });
  }

  const style = map.getStyle();
  if (style?.sources?.composite && !map.getLayer(EXTRUSION_LAYER_ID)) {
    try {
      map.addLayer({
        id: EXTRUSION_LAYER_ID,
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 13.5,
        paint: {
          'fill-extrusion-color': isDark ? '#1E3127' : '#EFE4D4',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.62,
        },
      });
    } catch {
    }
  }
}

export function updatePetaHaloData(
  map: MapboxMap,
  markets: MapboxMarketItem[],
  activeMarketId: string
): void {
  const src = map.getSource(HALO_SOURCE_ID) as GeoJSONSource | undefined;
  if (src) {
    src.setData(buildPetaHaloGeoJson(markets, activeMarketId));
  }
}

export function createPetaMarkerElement(
  market: MapboxMarketItem,
  isSelected: boolean,
  isDark: boolean,
  onClick: () => void
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.dataset.marketId = market.id;
  btn.setAttribute('aria-label', `${market.name} ${market.priceText}`);
  btn.className =
    'inline-flex items-center gap-1.5 rounded-full border-2 font-bold whitespace-nowrap transition-transform hover:scale-105 cursor-pointer';

  btn.style.padding = isSelected ? '5px 10px' : '4px 8px';
  btn.style.fontSize = '11px';
  btn.style.backgroundColor = isSelected ? '#EEF773' : isDark ? '#16241D' : '#FFFFFF';
  btn.style.color = isSelected ? '#132E20' : isDark ? '#F9F3EE' : '#132E20';
  btn.style.borderColor = isSelected ? '#A92717' : isDark ? '#4E6B59' : '#132E20';
  btn.style.transform = isSelected ? 'scale(1.08)' : 'scale(1)';
  btn.style.boxShadow = isSelected
    ? '3px 3px 0px #132E20'
    : '2px 2px 0px rgba(19, 46, 32, 0.45)';

  const dot = document.createElement('span');
  dot.style.width = '8px';
  dot.style.height = '8px';
  dot.style.borderRadius = '9999px';
  dot.style.flexShrink = '0';
  dot.style.backgroundColor =
    market.status === 'cheaper'
      ? isDark
        ? '#6EE7A0'
        : '#245034'
      : market.status === 'expensive'
      ? isDark
        ? '#E54D37'
        : '#A92717'
      : isDark
      ? '#D8C098'
      : '#A68F6D';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = market.shortName;

  const priceSpan = document.createElement('span');
  priceSpan.textContent = market.priceText;
  priceSpan.style.padding = '1px 6px';
  priceSpan.style.borderRadius = '9999px';
  priceSpan.style.fontSize = '10px';
  priceSpan.style.fontVariantNumeric = 'tabular-nums';
  priceSpan.style.backgroundColor = isSelected
    ? '#132E20'
    : market.status === 'cheaper'
    ? isDark
      ? '#1E3829'
      : '#E2EFE6'
    : market.status === 'expensive'
    ? isDark
      ? '#3B1A15'
      : '#FBE9E6'
    : isDark
    ? '#1E3127'
    : '#EFE4D4';
  priceSpan.style.color = isSelected
    ? '#EEF773'
    : market.status === 'cheaper'
    ? isDark
      ? '#6EE7A0'
      : '#245034'
    : market.status === 'expensive'
    ? isDark
      ? '#FF8A7A'
      : '#A92717'
    : isDark
    ? '#D0DDD4'
    : '#263E30';

  btn.appendChild(dot);
  btn.appendChild(nameSpan);
  btn.appendChild(priceSpan);
  btn.onclick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return btn;
}
