import * as THREE from 'three';
import { ThreeStallCompartment } from './three-stalls';
import {
  createVendorAssetPack,
  VENDOR_APRON_PALETTE,
  VENDOR_KERUDUNG_PALETTE,
  VENDOR_SHIRT_PALETTE,
  VENDOR_SKIN_TONES,
  vendorSeedHash,
} from './three-vendor-assets';

export interface MarketVendorsOptions {
  step?: number;
  reducedMotion?: boolean;
}

export interface MarketVendorsHandle {
  vendorsGroup: THREE.Group;
  update: (timeSec: number, cameraZ: number) => void;
  setTheme: (isDark: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
}

interface VendorInstanceData {
  vx: number;
  vz: number;
  yawBase: number;
  isLeft: boolean;
  phase: number;
  waveSpeed: number;
  hatType: 0 | 1 | 2 | 3;
  hatSlotIdx: number;
  curHeadYaw: number;
}

export function createMarketVendors(
  scene: THREE.Scene,
  isDark: boolean,
  compartments: ThreeStallCompartment[],
  options: MarketVendorsOptions = {}
): MarketVendorsHandle {
  const vendorsGroup = new THREE.Group();
  vendorsGroup.name = 'market-vendors';
  const step = Math.max(1, options.step ?? 1);
  let reducedMotion = Boolean(options.reducedMotion);

  const selected = compartments.filter((_, idx) => idx % step === 0);
  const count = selected.length;
  const assets = createVendorAssetPack(isDark);

  const hatBuckets: [number[], number[], number[], number[]] = [[], [], [], []];
  const vendors: VendorInstanceData[] = selected.map((c, idx) => {
    const isL = c.side === 'left';
    const hatType = (Math.floor(vendorSeedHash(c.id, 1) * 4) % 4) as 0 | 1 | 2 | 3;
    const hatSlotIdx = hatBuckets[hatType].length;
    hatBuckets[hatType].push(idx);
    return {
      vx: isL ? 2.46 : -2.46,
      vz: (c.zStart + c.zEnd) / 2,
      yawBase: isL ? -Math.PI / 2 : Math.PI / 2,
      isLeft: isL,
      phase: vendorSeedHash(c.id, 2) * Math.PI * 2,
      waveSpeed: 0.16 + vendorSeedHash(c.id, 3) * 0.08,
      hatType,
      hatSlotIdx,
      curHeadYaw: 0,
    };
  });

  const legsInst = new THREE.InstancedMesh(assets.legsGeo, assets.legsMat, Math.max(1, count));
  const torsoInst = new THREE.InstancedMesh(assets.torsoGeo, assets.clothMat, Math.max(1, count));
  const apronInst = new THREE.InstancedMesh(assets.apronGeo, assets.apronMat, Math.max(1, count));
  const headInst = new THREE.InstancedMesh(assets.headGeo, assets.skinMat, Math.max(1, count));
  const armInst = new THREE.InstancedMesh(assets.armGeo, assets.skinMat, Math.max(1, count * 2));
  const capingInst = new THREE.InstancedMesh(assets.capingGeo, assets.strawMat, Math.max(1, hatBuckets[0].length));
  const kerudungInst = new THREE.InstancedMesh(assets.kerudungGeo, assets.clothMat, Math.max(1, hatBuckets[1].length));
  const kerudungDrapeInst = new THREE.InstancedMesh(assets.kerudungDrapeGeo, assets.clothMat, Math.max(1, hatBuckets[1].length));
  const peciInst = new THREE.InstancedMesh(assets.peciGeo, assets.peciMat, Math.max(1, hatBuckets[2].length));
  const topiCrownInst = new THREE.InstancedMesh(assets.topiCrownGeo, assets.topiMat, Math.max(1, hatBuckets[3].length));
  const topiVisorInst = new THREE.InstancedMesh(assets.topiVisorGeo, assets.topiMat, Math.max(1, hatBuckets[3].length));

  legsInst.count = count;
  torsoInst.count = count;
  apronInst.count = count;
  headInst.count = count;
  armInst.count = count * 2;
  capingInst.count = hatBuckets[0].length;
  kerudungInst.count = hatBuckets[1].length;
  kerudungDrapeInst.count = hatBuckets[1].length;
  peciInst.count = hatBuckets[2].length;
  topiCrownInst.count = hatBuckets[3].length;
  topiVisorInst.count = hatBuckets[3].length;

  const allMeshes = [
    legsInst, torsoInst, apronInst, headInst, armInst,
    capingInst, kerudungInst, kerudungDrapeInst, peciInst, topiCrownInst, topiVisorInst,
  ];

  const col = new THREE.Color();
  vendors.forEach((v, i) => {
    const cid = selected[i].id;
    col.setHex(VENDOR_SHIRT_PALETTE[cid % VENDOR_SHIRT_PALETTE.length]);
    torsoInst.setColorAt(i, col);
    col.setHex(VENDOR_APRON_PALETTE[(cid + 1) % VENDOR_APRON_PALETTE.length]);
    apronInst.setColorAt(i, col);
    const skinHex = VENDOR_SKIN_TONES[cid % VENDOR_SKIN_TONES.length];
    col.setHex(skinHex);
    headInst.setColorAt(i, col);
    armInst.setColorAt(i * 2, col);
    armInst.setColorAt(i * 2 + 1, col);
    if (v.hatType === 1) {
      col.setHex(VENDOR_KERUDUNG_PALETTE[(cid + 2) % VENDOR_KERUDUNG_PALETTE.length]);
      kerudungInst.setColorAt(v.hatSlotIdx, col);
      kerudungDrapeInst.setColorAt(v.hatSlotIdx, col);
    }
  });

  [torsoInst, apronInst, headInst, armInst, kerudungInst, kerudungDrapeInst].forEach((inst) => {
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  });

  for (const m of allMeshes) {
    m.raycast = () => {};
    m.castShadow = true;
    m.receiveShadow = true;
    vendorsGroup.add(m);
  }
  scene.add(vendorsGroup);

  const mVendor = new THREE.Matrix4();
  const mLocal = new THREE.Matrix4();
  const mOut = new THREE.Matrix4();
  const mHeadBase = new THREE.Matrix4();
  const qTemp = new THREE.Quaternion();
  const eTemp = new THREE.Euler();
  const vPos = new THREE.Vector3();
  const vScale = new THREE.Vector3();

  const updateTransforms = (timeSec: number, cameraZ: number) => {
    for (let i = 0; i < count; i++) {
      const v = vendors[i];
      const animT = reducedMotion ? 0 : timeSec;
      const breath = reducedMotion ? 1 : 1 + (Math.sin(animT * 1.9 + v.phase) * 0.5 + 0.5) * 0.015;

      eTemp.set(0, v.yawBase, 0);
      qTemp.setFromEuler(eTemp);
      mVendor.compose(vPos.set(v.vx, 0, v.vz), qTemp, vScale.set(1, 1, 1));

      eTemp.set(0, 0, 0);
      qTemp.setFromEuler(eTemp);
      mLocal.compose(vPos.set(0, 0.56, 0), qTemp, vScale.set(1, 1, 1));
      mOut.multiplyMatrices(mVendor, mLocal);
      legsInst.setMatrixAt(i, mOut);

      mLocal.compose(vPos.set(0, 1.15 * breath, 0), qTemp, vScale.set(1, breath, 1));
      mOut.multiplyMatrices(mVendor, mLocal);
      torsoInst.setMatrixAt(i, mOut);

      mLocal.compose(vPos.set(0, 1.12 * breath, 0.148), qTemp, vScale.set(1, breath, 1));
      mOut.multiplyMatrices(mVendor, mLocal);
      apronInst.setMatrixAt(i, mOut);

      const dz = cameraZ - v.vz;
      let targetYaw = 0;
      if (!reducedMotion) {
        if (Math.abs(dz) < 6) {
          targetYaw = Math.max(-0.46, Math.min(0.46, Math.atan2(dz, 2.46) * (v.isLeft ? 1 : -1)));
        } else {
          targetYaw = Math.sin(animT * 0.55 + v.phase) * 0.1;
        }
      }
      v.curHeadYaw += (targetYaw - v.curHeadYaw) * 0.16;

      eTemp.set(0, v.curHeadYaw, 0);
      qTemp.setFromEuler(eTemp);
      mLocal.compose(vPos.set(0, 1.56 + (breath - 1) * 0.4, 0), qTemp, vScale.set(1, 1, 1));
      mHeadBase.multiplyMatrices(mVendor, mLocal);
      headInst.setMatrixAt(i, mHeadBase);

      const waveCycle = ((animT * v.waveSpeed + v.phase) % 1 + 1) % 1;
      const waveAmp = !reducedMotion && waveCycle < 0.22 ? Math.sin((waveCycle / 0.22) * Math.PI) : 0;

      for (const side of [-1, 1] as const) {
        const isRight = side === 1;
        eTemp.set(isRight ? -0.35 - waveAmp * 0.65 : -0.22 - waveAmp * 0.18, 0, isRight ? -0.14 + waveAmp * 0.25 : 0.14);
        qTemp.setFromEuler(eTemp);
        mLocal.compose(vPos.set(side * 0.172, 1.35 * breath - 0.15, 0.04), qTemp, vScale.set(1, 1, 1));
        mOut.multiplyMatrices(mVendor, mLocal);
        armInst.setMatrixAt(i * 2 + (isRight ? 1 : 0), mOut);
      }

      const placeHat = (rx: number, py: number, pz: number, target: THREE.InstancedMesh) => {
        eTemp.set(rx, 0, 0);
        qTemp.setFromEuler(eTemp);
        mLocal.compose(vPos.set(0, py, pz), qTemp, vScale.set(1, 1, 1));
        mOut.multiplyMatrices(mHeadBase, mLocal);
        target.setMatrixAt(v.hatSlotIdx, mOut);
      };

      if (v.hatType === 0) placeHat(-0.08, 0.102, 0, capingInst);
      else if (v.hatType === 1) {
        placeHat(-0.08, 0.015, -0.004, kerudungInst);
        placeHat(0, -0.055, -0.008, kerudungDrapeInst);
      } else if (v.hatType === 2) placeHat(-0.04, 0.082, 0, peciInst);
      else {
        placeHat(-0.06, 0.072, 0, topiCrownInst);
        placeHat(-0.06, 0.042, 0.11, topiVisorInst);
      }
    }

    for (const m of allMeshes) m.instanceMatrix.needsUpdate = true;
  };

  updateTransforms(0, 0);

  return {
    vendorsGroup,
    update: updateTransforms,
    setTheme: assets.applyTheme,
    setReducedMotion: (reduced: boolean) => {
      reducedMotion = reduced;
      if (reduced) updateTransforms(0, 0);
    },
    dispose: assets.dispose,
  };
}
