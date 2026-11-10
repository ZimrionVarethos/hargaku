import mapboxgl, { type CustomLayerInterface, type Map as MapboxMap } from 'mapbox-gl';
import * as THREE from 'three';
import type { BogorMarket, MarketTier } from '@/lib/data/bogor-markets';

interface MarketMeshBundle {
  marketId: string;
  group: THREE.Group;
  beaconMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  lanternMat: THREE.MeshStandardMaterial;
  baseBeaconY: number;
}

const TIER_SCALE: Record<MarketTier, { w: number; h: number; roofColor: number }> = {
  induk: { w: 82, h: 52, roofColor: 0xa92717 },
  sentra: { w: 66, h: 40, roofColor: 0xc2611a },
  rakyat: { w: 54, h: 32, roofColor: 0x245034 },
};

function createSharedBoxGeometry(w: number, h: number, d: number, yCenter: number): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, yCenter, 0);
  return geo;
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

    for (const m of this.markets) {
      const cfg = TIER_SCALE[m.tier];
      const merch = mapboxgl.MercatorCoordinate.fromLngLat([m.lng, m.lat], 0);
      const dx = (merch.x - this.originMercator.x) / this.meterScale;
      const dz = (merch.y - this.originMercator.y) / this.meterScale;

      const group = new THREE.Group();
      group.position.set(dx, 0, dz);

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
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: m.id === this.activeMarketId ? 1.55 : 0.45,
        roughness: 0.3,
      });

      this.sharedGeometries.push(
        plinthGeo,
        hallGeo,
        awningGeo,
        lanternGeo,
        lowerRoofGeo,
        upperRoofGeo,
        spireGeo,
        pillarGeo,
        ringGeo,
        beaconGeo
      );
      this.sharedMaterials.push(lanternMat);

      group.add(new THREE.Mesh(plinthGeo, plinthMat));
      group.add(new THREE.Mesh(hallGeo, wallMat));
      group.add(new THREE.Mesh(awningGeo, awningMat));
      group.add(new THREE.Mesh(lanternGeo, lanternMat));
      group.add(new THREE.Mesh(lowerRoofGeo, roofMats[m.tier]));
      group.add(new THREE.Mesh(upperRoofGeo, roofMats[m.tier]));
      group.add(new THREE.Mesh(spireGeo, goldMat));

      const px = w * 0.44;
      const pz = d * 0.44;
      for (const [cx, cz] of [
        [-px, -pz],
        [px, -pz],
        [-px, pz],
        [px, pz],
      ]) {
        const col = new THREE.Mesh(pillarGeo, pillarMat);
        col.position.set(cx, 0, cz);
        group.add(col);
      }

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.visible = m.id === this.activeMarketId;
      group.add(ringMesh);

      const baseBeaconY = plinthH + wallH + cfg.h * 0.8;
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
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

    const projection = new THREE.Matrix4().fromArray(matrix);
    const localTransform = new THREE.Matrix4()
      .makeTranslation(this.originMercator.x, this.originMercator.y, this.originMercator.z)
      .scale(new THREE.Vector3(this.meterScale, -this.meterScale, this.meterScale))
      .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2));

    this.camera.projectionMatrix = projection.multiply(localTransform);

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
