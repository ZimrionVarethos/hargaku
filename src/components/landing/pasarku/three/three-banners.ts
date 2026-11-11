import * as THREE from 'three';
import { BannerCompartmentInfo, createBannerTexture } from './three-banner-canvas';

export type { BannerCompartmentInfo };

export interface MarketBannersHandle {
  group: THREE.Group;
  setTheme: (isDark: boolean) => void;
  dispose: () => void;
}

interface BannerEntry {
  comp: BannerCompartmentInfo;
  w: number;
  h: number;
  compact: boolean;
  mat: THREE.MeshStandardMaterial;
}

export function createMarketBanners(
  scene: THREE.Scene,
  isDark: boolean,
  compartments: BannerCompartmentInfo[]
): MarketBannersHandle {
  const group = new THREE.Group();
  group.name = 'market-banners';

  const wallGeo = new THREE.PlaneGeometry(2.4, 0.96);
  const signGeo = new THREE.PlaneGeometry(0.92, 0.4);
  const rodGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.05, 4);
  const rodMat = new THREE.MeshStandardMaterial({ color: 0x2a2520, metalness: 0.7, roughness: 0.4 });
  const rodInst = new THREE.InstancedMesh(rodGeo, rodMat, compartments.length * 2);
  const dummy = new THREE.Object3D();
  const entries: BannerEntry[] = [];
  let rodIdx = 0;

  compartments.forEach((c) => {
    const isL = c.side === 'left';
    const posZ = (c.zStart + c.zEnd) / 2;

    const wallTex = createBannerTexture(c, 512, 224, isDark, false);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85, metalness: 0.02 });
    const wallBanner = new THREE.Mesh(wallGeo, wallMat);
    wallBanner.position.set(isL ? 2.79 : -2.79, 2.28, posZ);
    wallBanner.rotation.y = isL ? -Math.PI / 2 : Math.PI / 2;
    group.add(wallBanner);
    entries.push({ comp: c, w: 512, h: 224, compact: false, mat: wallMat });

    const signTex = createBannerTexture(c, 320, 152, isDark, true);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.75,
      metalness: 0.05,
    });
    const signHolder = new THREE.Group();
    const signX = isL ? 1.48 : -1.48;
    const signZ = c.zStart + 0.85;
    signHolder.position.set(signX, 2.2, signZ);
    signHolder.rotation.y = Math.PI + (isL ? 0.18 : -0.18);

    const frontSign = new THREE.Mesh(signGeo, signMat);
    frontSign.position.z = 0.006;
    const backSign = new THREE.Mesh(signGeo, signMat);
    backSign.position.z = -0.006;
    backSign.rotation.y = Math.PI;
    signHolder.add(frontSign, backSign);
    group.add(signHolder);
    entries.push({ comp: c, w: 320, h: 152, compact: true, mat: signMat });

    dummy.position.set(signX - 0.3, 2.9, signZ);
    dummy.updateMatrix();
    rodInst.setMatrixAt(rodIdx++, dummy.matrix);

    dummy.position.set(signX + 0.3, 2.9, signZ);
    dummy.updateMatrix();
    rodInst.setMatrixAt(rodIdx++, dummy.matrix);
  });

  rodInst.instanceMatrix.needsUpdate = true;
  group.add(rodInst);
  scene.add(group);

  let currentDark = isDark;

  const setTheme = (dark: boolean) => {
    if (dark === currentDark) return;
    currentDark = dark;
    for (const entry of entries) {
      if (entry.mat.map) entry.mat.map.dispose();
      entry.mat.map = createBannerTexture(entry.comp, entry.w, entry.h, dark, entry.compact);
      entry.mat.needsUpdate = true;
    }
  };

  const dispose = () => {
    wallGeo.dispose();
    signGeo.dispose();
    rodGeo.dispose();
    rodMat.dispose();
    for (const entry of entries) {
      if (entry.mat.map) entry.mat.map.dispose();
      entry.mat.dispose();
    }
  };

  return { group, setTheme, dispose };
}
