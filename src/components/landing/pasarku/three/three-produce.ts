import * as THREE from 'three';
import { MarketTexturePack } from './three-pbr-textures';
import { ProduceTexturePack } from './three-produce-textures';
import {
  createTomatoGeo, createOrangeGeo, createOnionGeo, createCarrotGeo,
  createChiliGeo, createFishGeo, createMoundGeo, createPotatoGeo,
  createCabbageGeo, createEggGeo, createGreensBundleGeo, createOilBottleGeo,
  createSackGeo, createCrateGeo, createBasinGeo,
} from './three-produce-geometries';

export interface ProduceCompartmentInput {
  id: number;
  zStart: number;
  zEnd: number;
  side: 'left' | 'right';
  produceType: string;
}

interface InstanceItem {
  matrix: THREE.Matrix4;
  color: THREE.Color;
}

function rng(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pushInst(
  list: InstanceItem[],
  x: number, y: number, z: number,
  rx: number, ry: number, rz: number,
  sx: number, sy: number, sz: number,
  hexColor: number
) {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz));
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz)
  );
  list.push({ matrix: m, color: new THREE.Color(hexColor) });
}

function buildInstancedMesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  items: InstanceItem[],
  castShadow: boolean
): THREE.InstancedMesh | null {
  if (items.length === 0) return null;
  const inst = new THREE.InstancedMesh(geo, mat, items.length);
  items.forEach((it, idx) => {
    inst.setMatrixAt(idx, it.matrix);
    inst.setColorAt(idx, it.color);
  });
  inst.instanceMatrix.needsUpdate = true;
  if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  inst.castShadow = castShadow;
  inst.receiveShadow = true;
  return inst;
}

export function createInstancedMarketProduce(
  scene: THREE.Scene,
  compartments: ProduceCompartmentInput[],
  tex: MarketTexturePack,
  pTex: ProduceTexturePack
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'market-produce-instanced';

  const buckets: Record<string, InstanceItem[]> = {
    tomato: [], orange: [], shallot: [], garlic: [], carrot: [],
    chili: [], potato: [], cabbage: [], greens: [], egg: [],
    fish: [], meat: [], oil: [], sack: [], crate: [], basin: [], mound: [],
  };

  const scatterTop = (
    bucket: InstanceItem[], tx: number, ty: number, cz: number, depth: number,
    seed: number, count: number, colors: number[], scaleBase: number, rotMaxX: number
  ) => {
    for (let k = 0; k < count; k++) {
      const s = seed + k * 7;
      const dx = (rng(s) - 0.5) * 0.25;
      const dz = (rng(s + 1) - 0.5) * (depth - 0.36);
      const moundH = Math.max(0, 1 - (dx / 0.14) ** 2) * 0.055;
      const sc = scaleBase * (0.86 + rng(s + 2) * 0.28);
      pushInst(
        bucket, tx + dx, ty + moundH + (k % 2) * 0.015, cz + dz,
        (rng(s + 3) - 0.5) * rotMaxX, rng(s + 4) * 6.28, (rng(s + 5) - 0.5) * rotMaxX,
        sc, sc, sc, colors[k % colors.length]
      );
    }
  };

  compartments.forEach((c) => {
    const isL = c.side === 'left';
    const dir = isL ? -1 : 1; // Visual left (+1.62) faces aisle (-X)
    const cx = isL ? 1.62 : -1.62;
    const depth = c.zEnd - c.zStart;
    const cz = (c.zStart + c.zEnd) / 2;
    const tiers = [
      { tx: cx + dir * 0.37, ty: 0.6 },
      { tx: cx, ty: 0.84 },
      { tx: cx - dir * 0.37, ty: 1.08 },
    ];

    // Containers & floor sacks
    for (let dz = -depth / 2 + 0.32; dz <= depth / 2 - 0.32; dz += 0.56) {
      tiers.forEach((t, ti) => {
        if (c.produceType === 'wortel' && ti < 2) {
          pushInst(buckets.crate, t.tx, t.ty + 0.04, cz + dz, 0, 0, 0, 0.96, 1, 1.05, 0xea580c);
        } else if (c.produceType === 'sayur' && ti < 2) {
          pushInst(buckets.crate, t.tx, t.ty + 0.04, cz + dz, 0, 0, 0, 0.96, 0.95, 1.05, 0xf1f5f9);
        } else if (c.produceType === 'telur' && ti < 2) {
          pushInst(buckets.crate, t.tx, t.ty + 0.018, cz + dz, 0, 0, 0, 0.96, 0.35, 0.95, 0x78716c);
        } else if ((c.produceType === 'ikan' || c.produceType === 'daging') && ti < 2) {
          const trayCol = c.produceType === 'ikan' ? 0x0284c7 : 0xf8fafc;
          pushInst(buckets.crate, t.tx, t.ty + 0.025, cz + dz, 0, 0, 0, 0.98, 0.45, 1.06, trayCol);
        }
      });
    }

    if (!isL && (c.id === 11 || c.id === 12)) {
      pushInst(buckets.basin, cx + dir * 0.37, 0.67, cz, 0, 0, 0, 1.05, 1.05, 1.05, 0x2563eb);
    }
    if (c.produceType === 'wortel' || c.produceType === 'beras' || c.produceType === 'gula') {
      pushInst(buckets.sack, cx + dir * 0.64, 0.2, cz - 0.5, 0.14, 0.4, 0, 1.02, 0.95, 1.02, 0xeab308);
      pushInst(buckets.sack, cx + dir * 0.64, 0.2, cz + 0.6, -0.1, 1.1, 0.08, 1.0, 0.92, 1.0, 0xa16207);
    }

    tiers.forEach((t, ti) => {
      const seed = c.id * 1000 + ti * 137;
      const moundL = depth - 0.28;

      if (c.produceType === 'tomat') {
        pushInst(buckets.mound, t.tx, t.ty + 0.032, cz, 0, 0, 0, 0.96, 1.0, moundL, 0xb91c1c);
        scatterTop(buckets.tomato, t.tx, t.ty + 0.068, cz, depth, seed, 30, [0xffffff, 0xfef2f2, 0xfecaca, 0xd9f99d], 1.0, 0.6);
      } else if (c.produceType === 'jeruk') {
        pushInst(buckets.mound, t.tx, t.ty + 0.032, cz, 0, 0, 0, 0.96, 1.0, moundL, 0xd97706);
        scatterTop(buckets.orange, t.tx, t.ty + 0.068, cz, depth, seed, 32, [0xf59e0b, 0xf97316, 0xfbbf24], 1.0, 0.4);
      } else if (c.produceType === 'bawang-merah') {
        pushInst(buckets.mound, t.tx, t.ty + 0.03, cz, 0, 0, 0, 0.96, 0.95, moundL, 0x6b1d35);
        scatterTop(buckets.shallot, t.tx, t.ty + 0.064, cz, depth, seed, 44, [0xffffff, 0xfce7f3, 0xfbcfe8], 1.0, 1.2);
      } else if (c.produceType === 'bawang-putih') {
        pushInst(buckets.mound, t.tx, t.ty + 0.03, cz, 0, 0, 0, 0.96, 0.95, moundL, 0xd6d3d1);
        scatterTop(buckets.garlic, t.tx, t.ty + 0.064, cz, depth, seed, 42, [0xffffff, 0xfafaf9, 0xf5f5f4], 1.02, 1.2);
      } else if (c.produceType === 'cabe') {
        pushInst(buckets.mound, t.tx, t.ty + 0.028, cz, 0, 0, 0, 0.96, 0.85, moundL, 0x7f1d1d);
        scatterTop(buckets.chili, t.tx, t.ty + 0.056, cz, depth, seed, 58, [0xffffff, 0xfecaca, 0xfef2f2], 1.05, 0.4);
      } else if (c.produceType === 'wortel') {
        if (ti < 2) {
          pushInst(buckets.mound, t.tx, t.ty + 0.055, cz, 0, 0, 0, 0.9, 0.75, moundL, 0xc2410c);
          scatterTop(buckets.carrot, t.tx, t.ty + 0.095, cz, depth, seed, 28, [0xffffff, 0xffedd5], 1.02, 0.35);
        } else {
          for (let dz = -depth / 2 + 0.5; dz <= depth / 2 - 0.5; dz += 0.65) {
            pushInst(buckets.sack, t.tx, t.ty + 0.19, cz + dz, 0, rng(dz) * 3, 0, 0.92, 0.95, 0.92, 0x92400e);
          }
        }
      } else if (c.produceType === 'kol') {
        for (let dz = -depth / 2 + 0.28; dz <= depth / 2 - 0.28; dz += 0.26) {
          pushInst(buckets.cabbage, t.tx, t.ty + 0.095, cz + dz, rng(dz) * 2, dz, 0, 1.0, 0.92, 1.0, 0xffffff);
        }
      } else if (c.produceType === 'sayur') {
        for (let dz = -depth / 2 + 0.3; dz <= depth / 2 - 0.3; dz += 0.24) {
          const cols = [0x15803d, 0x166534, 0x16a34a];
          pushInst(buckets.greens, t.tx - 0.05, t.ty + 0.09, cz + dz, 0.14, (isL ? 0.3 : -0.3) + (rng(dz) - 0.5) * 0.25, 0, 1, 1, 1, cols[Math.abs(Math.round(dz * 7)) % 3]);
          pushInst(buckets.greens, t.tx + 0.05, t.ty + 0.11, cz + dz + 0.08, -0.1, isL ? 0.4 : -0.4, 0, 0.95, 0.95, 0.95, cols[(Math.abs(Math.round(dz * 7)) + 1) % 3]);
        }
      } else if (c.produceType === 'telur') {
        if (ti < 2) {
          for (let dz = -depth / 2 + 0.36; dz <= depth / 2 - 0.36; dz += 0.56) {
            for (let ex = -0.09; ex <= 0.091; ex += 0.09) {
              for (let ez = -0.12; ez <= 0.121; ez += 0.08) {
                pushInst(buckets.egg, t.tx + ex, t.ty + 0.052, cz + dz + ez, 0, 0, 0, 1, 1, 1, 0xd97706);
              }
            }
          }
        } else {
          for (let dz = -depth / 2 + 0.45; dz <= depth / 2 - 0.45; dz += 0.65) {
            pushInst(buckets.sack, t.tx, t.ty + 0.19, cz + dz, 0, 0, 0, 0.92, 0.95, 0.92, 0x92400e);
          }
        }
      } else if (c.produceType === 'ikan') {
        if (ti < 2) {
          // Crushed ice mound inside blue fish trays + packed lateral Ikan Kembung
          pushInst(buckets.mound, t.tx, t.ty + 0.048, cz, 0, 0, 0, 0.9, 0.55, moundL, 0xe0f2fe);
          for (let dz = -depth / 2 + 0.26; dz <= depth / 2 - 0.26; dz += 0.22) {
            const s = seed + dz * 19;
            pushInst(buckets.fish, t.tx - 0.04, t.ty + 0.088, cz + dz, Math.PI / 2 - 0.15, (rng(s) - 0.5) * 0.4, isL ? 0.4 : -0.4, 1.05, 1.05, 1.05, 0xffffff);
            pushInst(buckets.fish, t.tx + 0.05, t.ty + 0.088, cz + dz + 0.09, Math.PI / 2 - 0.15, (rng(s + 2) - 0.5) * 0.4, isL ? -0.35 : 0.35, 1.0, 1.0, 1.0, 0xf8fafc);
          }
        }
      } else if (c.produceType === 'daging') {
        if (ti < 2) {
          for (let dz = -depth / 2 + 0.3; dz <= depth / 2 - 0.3; dz += 0.22) {
            pushInst(buckets.meat, t.tx, t.ty + 0.072, cz + dz, 0.1, dz * 1.5, 0, 1.2, 0.75, 1.1, 0xffffff);
          }
        }
      } else if (c.produceType === 'minyak') {
        for (let dz = -depth / 2 + 0.22; dz <= depth / 2 - 0.22; dz += 0.17) {
          pushInst(buckets.oil, t.tx - 0.05, t.ty, cz + dz, 0, 0, 0, 1, 1, 1, 0xf59e0b);
          pushInst(buckets.oil, t.tx + 0.06, t.ty, cz + dz + 0.06, 0, 0, 0, 1, 1, 1, 0xfbbf24);
        }
      } else {
        // Beras & Gula: pearly white mound bins + woven sacks on back shelf
        if (ti < 2) {
          const binCol = c.produceType === 'gula' ? 0xfef3c7 : 0xf8fafc;
          pushInst(buckets.mound, t.tx, t.ty + 0.04, cz, 0, 0, 0, 0.96, 1.15, moundL, binCol);
        } else {
          for (let dz = -depth / 2 + 0.42; dz <= depth / 2 - 0.42; dz += 0.56) {
            pushInst(buckets.sack, t.tx, t.ty + 0.19, cz + dz, 0, rng(dz + ti) * 2, 0, 0.94, 0.96, 0.94, 0xe7e5e4);
          }
        }
      }
    });
  });

  const mat = (roughness: number, map?: THREE.Texture, norm?: THREE.Texture, clearcoat = 0) =>
    clearcoat > 0
      ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness, clearcoat, clearcoatRoughness: 0.14, map: map || null, normalMap: norm || null })
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0.04, map: map || null, normalMap: norm || null });

  const defs: Array<[string, () => THREE.BufferGeometry, THREE.Material, boolean]> = [
    ['mound', createMoundGeo, mat(0.85, pTex.moundTex, tex.organicNorm), false],
    ['tomato', createTomatoGeo, mat(0.18, pTex.tomatoTex, tex.organicNorm, 0.85), false],
    ['orange', createOrangeGeo, mat(0.34, undefined, tex.organicNorm, 0.3), false],
    ['shallot', createOnionGeo, mat(0.4, pTex.shallotTex, tex.organicNorm, 0.35), false],
    ['garlic', createOnionGeo, mat(0.48, pTex.garlicTex, tex.organicNorm), false],
    ['carrot', createCarrotGeo, mat(0.4, pTex.carrotTex, tex.organicNorm), false],
    ['chili', createChiliGeo, mat(0.2, pTex.chiliTex, undefined, 0.72), false],
    ['cabbage', createCabbageGeo, mat(0.54, pTex.cabbageTex, tex.organicNorm), true],
    ['greens', createGreensBundleGeo, mat(0.7, undefined, tex.organicNorm), false],
    ['egg', createEggGeo, mat(0.3, undefined, undefined, 0.4), false],
    ['fish', createFishGeo, mat(0.18, pTex.fishTex, undefined, 0.82), false],
    ['meat', createPotatoGeo, mat(0.32, pTex.meatTex, tex.organicNorm, 0.65), false],
    ['oil', createOilBottleGeo, mat(0.15, undefined, undefined, 0.9), true],
    ['sack', createSackGeo, mat(0.95, tex.burlapMap), true],
    ['crate', createCrateGeo, mat(0.55), true],
    ['basin', createBasinGeo, mat(0.28, undefined, undefined, 0.55), true],
  ];

  defs.forEach(([key, geoFn, mMat, castShadow]) => {
    const m = buildInstancedMesh(geoFn(), mMat, buckets[key], castShadow);
    if (m) group.add(m);
  });

  scene.add(group);
  return group;
}
