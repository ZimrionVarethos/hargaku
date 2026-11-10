import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';
import type { BogorMarket } from '@/lib/data/bogor-markets';

const ROUTE_SOURCE_ID = 'pasarku-corridor-source';
const ROUTE_GLOW_LAYER_ID = 'pasarku-corridor-glow';
const ROUTE_LINE_LAYER_ID = 'pasarku-corridor-line';
const HALO_SOURCE_ID = 'pasarku-market-halos-source';
const HALO_LAYER_ID = 'pasarku-market-halos';
const ACTIVE_HALO_LAYER_ID = 'pasarku-market-active-halo';
const EXTRUSION_LAYER_ID = 'pasarku-city-3d-buildings';

export function buildCorridorGeoJson(markets: BogorMarket[]): GeoJSON.FeatureCollection {
  const hub = markets.find((m) => m.id === 'kebon-kembang') || markets[0];
  const features: GeoJSON.Feature[] = [];

  for (const m of markets) {
    if (m.id === hub.id) continue;
    features.push({
      type: 'Feature',
      properties: { id: m.id, tier: m.tier },
      geometry: {
        type: 'LineString',
        coordinates: [
          [hub.lng, hub.lat],
          [m.lng, m.lat],
        ],
      },
    });
  }

  return { type: 'FeatureCollection', features };
}

export function buildMarketHaloGeoJson(
  markets: BogorMarket[],
  activeId: string
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: markets.map((m) => ({
      type: 'Feature',
      properties: {
        id: m.id,
        tier: m.tier,
        active: m.id === activeId ? 1 : 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [m.lng, m.lat],
      },
    })),
  };
}

export function applyPasarKuAtmosphere(map: MapboxMap, isDark: boolean): void {
  try {
    map.setConfigProperty('basemap', 'lightPreset', isDark ? 'night' : 'day');
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    map.setConfigProperty('basemap', 'showTransitLabels', false);
  } catch {
  }

  try {
    map.setFog(
      isDark
        ? {
            color: '#0A120E',
            'high-color': '#132A1E',
            'horizon-blend': 0.14,
            'space-color': '#060B08',
            'star-intensity': 0.45,
          }
        : {
            color: '#F9F3EE',
            'high-color': '#DCEFE3',
            'horizon-blend': 0.1,
            'space-color': '#EFE4D4',
            'star-intensity': 0.0,
          }
    );
  } catch {
  }
}

export function addPasarKuDesignLayers(
  map: MapboxMap,
  markets: BogorMarket[],
  activeId: string,
  isDark: boolean
): void {
  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: buildCorridorGeoJson(markets),
    });
  }

  if (!map.getLayer(ROUTE_GLOW_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_GLOW_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      slot: 'middle',
      paint: {
        'line-color': isDark ? '#E54D37' : '#A92717',
        'line-width': 6,
        'line-opacity': 0.18,
        'line-blur': 4,
      },
    });
  }

  if (!map.getLayer(ROUTE_LINE_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_LINE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      slot: 'middle',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': isDark ? '#EEF773' : '#A92717',
        'line-width': 2.2,
        'line-dasharray': [2, 2],
        'line-opacity': 0.72,
      },
    });
  }

  if (!map.getSource(HALO_SOURCE_ID)) {
    map.addSource(HALO_SOURCE_ID, {
      type: 'geojson',
      data: buildMarketHaloGeoJson(markets, activeId),
    });
  }

  if (!map.getLayer(HALO_LAYER_ID)) {
    map.addLayer({
      id: HALO_LAYER_ID,
      type: 'circle',
      source: HALO_SOURCE_ID,
      slot: 'middle',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 8, 15, 28],
        'circle-color': [
          'match',
          ['get', 'tier'],
          'induk',
          '#A92717',
          'sentra',
          '#C2611A',
          '#245034',
        ],
        'circle-opacity': 0.24,
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
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 16, 15, 48],
        'circle-color': '#EEF773',
        'circle-opacity': 0.28,
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
          'fill-extrusion-opacity': 0.65,
        },
      });
    } catch {
    }
  }
}

export function updatePasarKuHaloData(
  map: MapboxMap,
  markets: BogorMarket[],
  activeId: string
): void {
  const src = map.getSource(HALO_SOURCE_ID) as GeoJSONSource | undefined;
  if (src) {
    src.setData(buildMarketHaloGeoJson(markets, activeId));
  }
}
