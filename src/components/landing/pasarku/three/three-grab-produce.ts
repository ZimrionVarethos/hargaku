import * as THREE from 'three';
import { MarketTexturePack } from './three-pbr-textures';
import { ProduceTexturePack } from './three-produce-textures';
import {
  createTomatoGeo,
  createOrangeGeo,
  createOnionGeo,
  createCarrotGeo,
  createChiliGeo,
  createFishGeo,
  createPotatoGeo,
  createCabbageGeo,
  createEggGeo,
  createGreensBundleGeo,
  createOilBottleGeo,
  createSackGeo,
} from './three-produce-geometries';
import { getGrabProduceScale } from './three-corridor-math';

export interface GrabProducePoolHandle {
  createProduceMesh: (produceType: string) => THREE.Mesh;
  setTheme: (isDark: boolean) => void;
  dispose: () => void;
}

export function createGrabProducePool(
  tex: MarketTexturePack,
  pTex: ProduceTexturePack,
  isDark: boolean
): GrabProducePoolHandle {
  const geos: Record<string, THREE.BufferGeometry> = {
    tomat: createTomatoGeo(),
    jeruk: createOrangeGeo(),
    semangka: createOrangeGeo(),
    'bawang-merah': createOnionGeo(),
    'bawang-putih': createOnionGeo(),
    wortel: createCarrotGeo(),
    cabe: createChiliGeo(),
    ikan: createFishGeo(),
    daging: createPotatoGeo(),
    kol: createCabbageGeo(),
    telur: createEggGeo(),
    sayur: createGreensBundleGeo(),
    minyak: createOilBottleGeo(),
    beras: createSackGeo(),
    gula: createSackGeo(),
  };

  const makeMat = (color: number, roughness: number, map?: THREE.Texture, norm?: THREE.Texture) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.04,
      map: map ?? null,
      normalMap: norm ?? null,
    });

  const mats: Record<string, THREE.MeshStandardMaterial> = {
    tomat: makeMat(0xffffff, 0.25, pTex.tomatoTex, tex.organicNorm),
    jeruk: makeMat(0xf59e0b, 0.34, undefined, tex.organicNorm),
    semangka: makeMat(0xffffff, 0.3, pTex.watermelonTex, tex.organicNorm),
    'bawang-merah': makeMat(0xffffff, 0.4, pTex.shallotTex, tex.organicNorm),
    'bawang-putih': makeMat(0xffffff, 0.48, pTex.garlicTex, tex.organicNorm),
    wortel: makeMat(0xffffff, 0.4, pTex.carrotTex, tex.organicNorm),
    cabe: makeMat(0xffffff, 0.24, pTex.chiliTex),
    ikan: makeMat(0xffffff, 0.22, pTex.fishTex),
    daging: makeMat(0xffffff, 0.35, pTex.meatTex, tex.organicNorm),
    kol: makeMat(0xffffff, 0.54, pTex.cabbageTex, tex.organicNorm),
    telur: makeMat(0xd97706, 0.32),
    sayur: makeMat(0x16a34a, 0.7, undefined, tex.organicNorm),
    minyak: makeMat(0xf59e0b, 0.18),
    beras: makeMat(0xf8fafc, 0.92, tex.burlapMap),
    gula: makeMat(0xfef3c7, 0.92, tex.burlapMap),
  };

  const setTheme = (dark: boolean) => {
    const emissiveHex = dark ? 0x241408 : 0x000000;
    const emissiveInt = dark ? 0.28 : 0;
    for (const m of Object.values(mats)) {
      m.emissive.setHex(emissiveHex);
      m.emissiveIntensity = emissiveInt;
    }
  };
  setTheme(isDark);

  const createProduceMesh = (produceType: string): THREE.Mesh => {
    const key = geos[produceType] ? produceType : 'tomat';
    const mesh = new THREE.Mesh(geos[key], mats[key]);
    mesh.scale.setScalar(getGrabProduceScale(key));
    mesh.renderOrder = 21;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    mesh.raycast = () => {};
    return mesh;
  };

  const dispose = () => {
    for (const g of Object.values(geos)) g.dispose();
    for (const m of Object.values(mats)) m.dispose();
  };

  return { createProduceMesh, setTheme, dispose };
}
