import mapboxgl, { type CustomLayerInterface, type Map as MapboxMap } from 'mapbox-gl';
import * as THREE from 'three';
import type { BogorMarket, MarketTier } from '@/lib/data/bogor-markets';
import { TIER_SCALE, buildTierGeometrySet, type TierGeometrySet } from './bogor-3d-geometries';

interface MarketMeshBundle {
  marketId: string;
  group: THREE.Group;
  beaconMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  lanternMat: THREE.MeshStandardMaterial;
  baseBeaconY: number;
}

export class Bogor3DMarketCustomLayer implements CustomLayerInterface {
  public readonly id = 'pasarku-bogor-3d-buildings';
  public readonly type = 'custom' as const;
  public readonly renderingMode = '3d' as const;

  private map: MapboxMap | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.Camera();
  private readonly originMercator: mapboxgl.MercatorCoordinate;
  private readonly meterScale: number;
  private readonly markets: BogorMarket[];
  private readonly bundles: MarketMeshBundle[] = [];
  private readonly sharedGeometries: THREE.BufferGeometry[] = [];
  private readonly sharedMaterials: THREE.Material[] = [];

  private activeMarketId: string;
  private visibleIds: Set<string>;
  private isDark = false;
  private animating = true;
  private sunLight: THREE.DirectionalLight | null = null;
  private fillLight: THREE.HemisphereLight | null = null;
  private readonly scratchProjection = new THREE.Matrix4();
  private readonly scratchTransform = new THREE.Matrix4();
  private readonly scratchRot = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  private readonly scratchScale: THREE.Vector3;

  constructor(
    markets: BogorMarket[],
    originLngLat: [number, number],
    activeMarketId: string,
    isDark: boolean
  ) {
    this.markets = markets;
    this.activeMarketId = activeMarketId;
    this.visibleIds = new Set(markets.map((m) => m.id));
    this.isDark = isDark;
    this.originMercator = mapboxgl.MercatorCoordinate.fromLngLat(originLngLat, 0);
    this.meterScale = this.originMercator.meterInMercatorCoordinateUnits();
    this.scratchScale = new THREE.Vector3(this.meterScale, -this.meterScale, this.meterScale);
  }

  public setState(params: {
    activeMarketId: string;
    visibleIds: string[];
    isDark: boolean;
  }): void {
    this.activeMarketId = params.activeMarketId;
    this.visibleIds = new Set(params.visibleIds);
    this.isDark = params.isDark;

    if (this.sunLight && this.fillLight) {
      this.sunLight.intensity = params.isDark ? 1.15 : 1.75;
      this.sunLight.color.setHex(params.isDark ? 0xfbbf24 : 0xfff8ec);
      this.fillLight.intensity = params.isDark ? 0.75 : 1.1;
    }

    for (const b of this.bundles) {
      const isSelected = b.marketId === this.activeMarketId;
      const isIncluded = this.visibleIds.has(b.marketId);
      b.group.visible = isIncluded;
      b.beaconMesh.visible = isSelected && isIncluded;
      b.ringMesh.visible = isSelected && isIncluded;
      b.lanternMat.emissiveIntensity = isSelected
        ? 1.55
        : params.isDark
          ? 1.1
          : 0.45;
    }

    this.map?.triggerRepaint();
  }

  public setAnimating(val: boolean): void {
    this.animating = val;
    if (val) {
      this.map?.triggerRepaint();
    }
  }

  public onAdd(map: MapboxMap, gl: WebGLRenderingContext): void {
    this.map = map;

    const hemi = new THREE.HemisphereLight(0xfffbeb, 0x132e20, this.isDark ? 0.75 : 1.1);
    this.scene.add(hemi);
    this.fillLight = hemi;

    const dir = new THREE.DirectionalLight(this.isDark ? 0xfbbf24 : 0xfff8ec, this.isDark ? 1.15 : 1.75);
    dir.position.set(180, 320, 140).normalize();
    this.scene.add(dir);
    this.sunLight = dir;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf9f3ee, roughness: 0.72, metalness: 0.05 });
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1e3829, roughness: 0.85, metalness: 0.1 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x3b2419, roughness: 0.78 });
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xa92717, roughness: 0.65 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35, metalness: 0.65 });
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xeef773, wireframe: true });
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xeef773,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    this.sharedMaterials.push(wallMat, plinthMat, pillarMat, awningMat, goldMat, beaconMat, ringMat);

    const roofMats: Record<MarketTier, THREE.MeshStandardMaterial> = {
      induk: new THREE.MeshStandardMaterial({ color: TIER_SCALE.induk.roofColor, roughness: 0.58 }),
      sentra: new THREE.MeshStandardMaterial({ color: TIER_SCALE.sentra.roofColor, roughness: 0.58 }),
      rakyat: new THREE.MeshStandardMaterial({ color: TIER_SCALE.rakyat.roofColor, roughness: 0.62 }),
    };
    this.sharedMaterials.push(roofMats.induk, roofMats.sentra, roofMats.rakyat);

    const tierGeometries: Partial<Record<MarketTier, TierGeometrySet>> = {};

    for (const m of this.markets) {
      const cfg = TIER_SCALE[m.tier];
      const geoSet =
        tierGeometries[m.tier] || (tierGeometries[m.tier] = buildTierGeometrySet(m.tier, this.sharedGeometries));

      const merch = mapboxgl.MercatorCoordinate.fromLngLat([m.lng, m.lat], 0);
      const dx = (merch.x - this.originMercator.x) / this.meterScale;
      const dz = (merch.y - this.originMercator.y) / this.meterScale;

      const group = new THREE.Group();
      group.position.set(dx, 0, dz);

      const w = cfg.w;
      const d = cfg.w * 0.82;
      const wallH = cfg.h * 0.44;
      const plinthH = 4.5;

      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: m.id === this.activeMarketId ? 1.55 : 0.45,
        roughness: 0.3,
      });
      this.sharedMaterials.push(lanternMat);

      group.add(new THREE.Mesh(geoSet.plinthGeo, plinthMat));
      group.add(new THREE.Mesh(geoSet.hallGeo, wallMat));
      group.add(new THREE.Mesh(geoSet.awningGeo, awningMat));
      group.add(new THREE.Mesh(geoSet.lanternGeo, lanternMat));
      group.add(new THREE.Mesh(geoSet.lowerRoofGeo, roofMats[m.tier]));
      group.add(new THREE.Mesh(geoSet.upperRoofGeo, roofMats[m.tier]));
      group.add(new THREE.Mesh(geoSet.spireGeo, goldMat));

      const px = w * 0.44;
      const pz = d * 0.44;
      for (const [cx, cz] of [
        [-px, -pz],
        [px, -pz],
        [-px, pz],
        [px, pz],
      ]) {
        const col = new THREE.Mesh(geoSet.pillarGeo, pillarMat);
        col.position.set(cx, 0, cz);
        group.add(col);
      }

      const ringMesh = new THREE.Mesh(geoSet.ringGeo, ringMat);
      ringMesh.visible = m.id === this.activeMarketId;
      group.add(ringMesh);

      const baseBeaconY = plinthH + wallH + cfg.h * 0.8;
      const beaconMesh = new THREE.Mesh(geoSet.beaconGeo, beaconMat);
      beaconMesh.position.set(0, baseBeaconY, 0);
      beaconMesh.visible = m.id === this.activeMarketId;
      group.add(beaconMesh);

      this.scene.add(group);
      this.bundles.push({
        marketId: m.id,
        group,
        beaconMesh,
        ringMesh,
        lanternMat,
        baseBeaconY,
      });
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }

  public render(_gl: WebGLRenderingContext, matrix: number[]): void {
    const t = performance.now() * 0.0022;
    for (const b of this.bundles) {
      if (b.beaconMesh.visible) {
        b.beaconMesh.rotation.y = t;
        b.beaconMesh.position.y = b.baseBeaconY + Math.sin(t * 2) * 5;
        const pulse = 1 + Math.sin(t * 2.5) * 0.08;
        b.ringMesh.scale.set(pulse, 1, pulse);
      }
    }

    this.scratchProjection.fromArray(matrix);
    this.scratchTransform
      .makeTranslation(this.originMercator.x, this.originMercator.y, this.originMercator.z)
      .scale(this.scratchScale)
      .multiply(this.scratchRot);

    this.camera.projectionMatrix.multiplyMatrices(this.scratchProjection, this.scratchTransform);

    if (this.renderer) {
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
    }

    if (this.animating) {
      this.map?.triggerRepaint();
    }
  }

  public onRemove(): void {
    for (const geo of this.sharedGeometries) {
      geo.dispose();
    }
    for (const mat of this.sharedMaterials) {
      mat.dispose();
    }
    this.sharedGeometries.length = 0;
    this.sharedMaterials.length = 0;
    this.bundles.length = 0;
    this.renderer = null;
    this.map = null;
  }
}
