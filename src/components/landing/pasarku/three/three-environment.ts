import * as THREE from 'three';
import { MarketTexturePack } from './three-pbr-textures';

export interface MarketEnvironmentRig {
  dirLight: THREE.DirectionalLight;
  nearLight: THREE.PointLight;
  aheadLight: THREE.PointLight;
}

/**
 * Creates an authentic, GPU-optimized traditional market corridor with batched structures & pooled lights
 */
export function createMarketEnvironment(
  scene: THREE.Scene,
  isDark: boolean,
  corridorLength: number,
  tex: MarketTexturePack
): MarketEnvironmentRig {
  const envGroup = new THREE.Group();
  envGroup.name = 'market-environment';

  // 1. Atmosphere & Fog (warm golden end glow)
  const fogColor = isDark ? 0x120d09 : 0xf2e6d8;
  scene.background = new THREE.Color(fogColor);
  scene.fog = new THREE.FogExp2(fogColor, 0.02);

  // 2. Efficient Lighting Rig (Hemisphere + Directional + 2 Pooled Camera-Tracking PointLights)
  const hemiLight = new THREE.HemisphereLight(
    isDark ? 0xffd29d : 0xfff5e4,
    isDark ? 0x211810 : 0x6b5a4b,
    isDark ? 0.65 : 1.15
  );
  envGroup.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(isDark ? 0xffb366 : 0xfffbeb, isDark ? 0.48 : 1.25);
  dirLight.position.set(4, 10, 6);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 28;
  dirLight.shadow.camera.left = -4;
  dirLight.shadow.camera.right = 4;
  dirLight.shadow.camera.top = 14;
  dirLight.shadow.camera.bottom = -4;
  envGroup.add(dirLight);
  envGroup.add(dirLight.target);

  const nearLight = new THREE.PointLight(0xffdf80, isDark ? 3.2 : 2.1, 12, 1.8);
  nearLight.position.set(0, 2.5, 2.5);
  envGroup.add(nearLight);

  const aheadLight = new THREE.PointLight(0xffdf80, isDark ? 2.8 : 1.8, 12, 1.8);
  aheadLight.position.set(0, 2.5, 11);
  envGroup.add(aheadLight);

  // 3. Damp Cobblestone Walkway, Curbs, and Side Market Walls
  const floorMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1f1812 : 0x5c5045,
    roughness: 0.85,
    metalness: 0.08,
    map: tex.stoneMap,
    normalMap: tex.stoneNorm,
    roughnessMap: tex.stoneRough,
  });
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.6, corridorLength + 18), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, corridorLength / 2);
  floorMesh.receiveShadow = true;
  envGroup.add(floorMesh);

  const curbGeo = new THREE.BoxGeometry(0.18, 0.1, corridorLength + 18);
  const curbMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x16110d : 0x45392f,
    roughness: 0.9,
    metalness: 0.04,
  });
  [-1.04, 1.04].forEach((cx) => {
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(cx, 0.05, corridorLength / 2);
    curb.receiveShadow = true;
    envGroup.add(curb);
  });

  // Aged Market Side Partition Walls (backdrop for wall posters & booths)
  const wallGeo = new THREE.PlaneGeometry(corridorLength + 18, 3.4);
  const wallMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1d1915 : 0xd6cab8,
    roughness: 0.92,
    metalness: 0.02,
  });
  [-2.48, 2.48].forEach((wx) => {
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(wx, 1.7, corridorLength / 2);
    wall.rotation.y = wx < 0 ? Math.PI / 2 : -Math.PI / 2;
    wall.receiveShadow = true;
    envGroup.add(wall);
  });

  // 4. Corrugated Zinc Roof Overhead
  const roofMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1d2023 : 0x3b4146,
    map: tex.roofMap,
    normalMap: tex.roofNorm,
    roughness: 0.56,
    metalness: 0.72,
  });
  const roofGeo = new THREE.PlaneGeometry(3.2, corridorLength + 18);
  [-1, 1].forEach((s) => {
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(s * 1.45, 3.75, corridorLength / 2);
    roof.rotation.set(-Math.PI / 2, -s * 0.22, 0);
    envGroup.add(roof);
  });

  // 5. Batched Trusses, Posts, Awnings & Red-White Bunting (InstancedMesh)
  const trussMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x18120e : 0x2e241c,
    roughness: 0.42,
    metalness: 0.72,
  });
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const trussSpacing = 5.0;
  const numTrusses = Math.ceil(corridorLength / trussSpacing) + 1;
  const trussInst = new THREE.InstancedMesh(unitBox, trussMat, numTrusses * 5);
  trussInst.castShadow = true;

  const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f3f0, roughness: 0.7 });

  const stripeW = 0.65;
  const numStripes = Math.ceil(corridorLength / stripeW);
  const awningCount = Math.ceil(numStripes / 2) * 2;
  const redAwning = new THREE.InstancedMesh(unitBox, redMat, awningCount);
  const whiteAwning = new THREE.InstancedMesh(unitBox, whiteMat, awningCount);

  const penGeo = new THREE.ConeGeometry(0.1, 0.2, 3);
  const penRed = new THREE.InstancedMesh(penGeo, redMat, numTrusses * 7);
  const penWhite = new THREE.InstancedMesh(penGeo, whiteMat, numTrusses * 7);

  const dummy = new THREE.Object3D();
  let trIdx = 0;
  let prIdx = 0;
  let pwIdx = 0;

  for (let i = 0; i < numTrusses; i++) {
    const z = i * trussSpacing;
    const setBox = (x: number, y: number, bz: number, sx: number, sy: number, sz: number, rz = 0) => {
      dummy.position.set(x, y, bz);
      dummy.rotation.set(0, 0, rz);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      trussInst.setMatrixAt(trIdx++, dummy.matrix);
    };
    setBox(0, 3.38, z, 5.1, 0.09, 0.09);
    setBox(-2.46, 1.7, z, 0.08, 3.4, 0.08);
    setBox(2.46, 1.7, z, 0.08, 3.4, 0.08);
    setBox(-1.3, 3.65, z, 2.7, 0.07, 0.07, 0.22);
    setBox(1.3, 3.65, z, 2.7, 0.07, 0.07, -0.22);

    for (let p = -6; p <= 6; p++) {
      dummy.position.set(p * 0.34, 3.24, z);
      dummy.rotation.set(Math.PI, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      if ((p + 6) % 2 === 0) penRed.setMatrixAt(prIdx++, dummy.matrix);
      else penWhite.setMatrixAt(pwIdx++, dummy.matrix);
    }
  }
  trussInst.count = trIdx;
  penRed.count = prIdx;
  penWhite.count = pwIdx;
  trussInst.instanceMatrix.needsUpdate = true;
  penRed.instanceMatrix.needsUpdate = true;
  penWhite.instanceMatrix.needsUpdate = true;
  envGroup.add(trussInst, penRed, penWhite);

  let raIdx = 0;
  let waIdx = 0;
  for (let s = 0; s < numStripes; s++) {
    const sz = s * stripeW;
    const target = s % 2 === 0 ? redAwning : whiteAwning;
    [-1, 1].forEach((sideSign) => {
      dummy.position.set(sideSign * 1.85, 3.08, sz);
      dummy.rotation.set(0, 0, -sideSign * 0.26);
      dummy.scale.set(1.4, 0.025, stripeW * 0.96);
      dummy.updateMatrix();
      if (s % 2 === 0) target.setMatrixAt(raIdx++, dummy.matrix);
      else target.setMatrixAt(waIdx++, dummy.matrix);
    });
  }
  redAwning.count = raIdx;
  whiteAwning.count = waIdx;
  redAwning.instanceMatrix.needsUpdate = true;
  whiteAwning.instanceMatrix.needsUpdate = true;
  envGroup.add(redAwning, whiteAwning);

  // 6. Lightweight Hanging Bulbs & Additive Glow Sprites (Zero transmission double-pass!)
  const cordGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.72, 4);
  const bulbGeo = new THREE.SphereGeometry(0.065, 8, 8);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x110d0a, roughness: 0.9 });
  const bulbGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
  const spriteMat = new THREE.SpriteMaterial({
    map: tex.glowSprite,
    color: 0xffd275,
    transparent: true,
    opacity: isDark ? 0.85 : 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const lampSpacing = 7.5;
  const numLamps = Math.ceil(corridorLength / lampSpacing);
  const cordInst = new THREE.InstancedMesh(cordGeo, cordMat, numLamps);
  const bulbInst = new THREE.InstancedMesh(bulbGeo, bulbGlowMat, numLamps);

  for (let l = 0; l < numLamps; l++) {
    const lz = l * lampSpacing + 2.5;
    dummy.position.set(0, 3.0, lz);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    cordInst.setMatrixAt(l, dummy.matrix);

    dummy.position.set(0, 2.6, lz);
    dummy.updateMatrix();
    bulbInst.setMatrixAt(l, dummy.matrix);

    const halo = new THREE.Sprite(spriteMat);
    halo.position.set(0, 2.6, lz);
    halo.scale.set(1.3, 1.3, 1);
    envGroup.add(halo);
  }
  cordInst.instanceMatrix.needsUpdate = true;
  bulbInst.instanceMatrix.needsUpdate = true;
  envGroup.add(cordInst, bulbInst);

  scene.add(envGroup);
  return { dirLight, nearLight, aheadLight };
}
