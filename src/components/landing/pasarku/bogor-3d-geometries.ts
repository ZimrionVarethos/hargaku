import * as THREE from 'three';
import type { MarketTier } from '@/lib/data/bogor-markets';

export interface TierGeometrySet {
  plinthGeo: THREE.BufferGeometry;
  hallGeo: THREE.BufferGeometry;
  awningGeo: THREE.BufferGeometry;
  lanternGeo: THREE.BufferGeometry;
  lowerRoofGeo: THREE.BufferGeometry;
  upperRoofGeo: THREE.BufferGeometry;
  spireGeo: THREE.BufferGeometry;
  pillarGeo: THREE.BufferGeometry;
  ringGeo: THREE.BufferGeometry;
  beaconGeo: THREE.BufferGeometry;
}

export const TIER_SCALE: Record<MarketTier, { w: number; h: number; roofColor: number }> = {
  induk: { w: 82, h: 52, roofColor: 0xa92717 },
  sentra: { w: 66, h: 40, roofColor: 0xc2611a },
  rakyat: { w: 54, h: 32, roofColor: 0x245034 },
};

function createSharedBoxGeometry(w: number, h: number, d: number, yCenter: number): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, yCenter, 0);
  return geo;
}

export function buildTierGeometrySet(tier: MarketTier, shared: THREE.BufferGeometry[]): TierGeometrySet {
  const cfg = TIER_SCALE[tier];
  const w = cfg.w;
  const d = cfg.w * 0.82;
  const wallH = cfg.h * 0.44;
  const plinthH = 4.5;

  const plinthGeo = createSharedBoxGeometry(w * 1.16, plinthH, d * 1.16, plinthH / 2);
  const hallGeo = createSharedBoxGeometry(w * 0.86, wallH, d * 0.86, plinthH + wallH / 2);
  const awningGeo = createSharedBoxGeometry(w * 1.04, 2.8, d * 1.04, plinthH + wallH * 0.45);
  const lanternGeo = createSharedBoxGeometry(w * 0.89, 3.6, d * 0.89, plinthH + wallH * 0.72);

  const lowerRoofGeo = new THREE.CylinderGeometry(w * 0.38, w * 0.72, cfg.h * 0.28, 4);
  lowerRoofGeo.rotateY(Math.PI / 4);
  lowerRoofGeo.translate(0, plinthH + wallH + cfg.h * 0.14, 0);

  const upperRoofGeo = new THREE.ConeGeometry(w * 0.42, cfg.h * 0.28, 4);
  upperRoofGeo.rotateY(Math.PI / 4);
  upperRoofGeo.translate(0, plinthH + wallH + cfg.h * 0.41, 0);

  const spireGeo = new THREE.SphereGeometry(w * 0.075, 10, 8);
  spireGeo.translate(0, plinthH + wallH + cfg.h * 0.56, 0);

  const pillarGeo = createSharedBoxGeometry(3.2, wallH + 1, 3.2, plinthH + wallH / 2);
  const ringGeo = new THREE.RingGeometry(w * 0.72, w * 0.9, 32);
  ringGeo.rotateX(-Math.PI / 2);
  ringGeo.translate(0, 1.5, 0);

  const beaconGeo = new THREE.OctahedronGeometry(w * 0.16, 0);

  shared.push(
    plinthGeo, hallGeo, awningGeo, lanternGeo,
    lowerRoofGeo, upperRoofGeo, spireGeo, pillarGeo, ringGeo, beaconGeo
  );

  return {
    plinthGeo, hallGeo, awningGeo, lanternGeo,
    lowerRoofGeo, upperRoofGeo, spireGeo, pillarGeo, ringGeo, beaconGeo,
  };
}

