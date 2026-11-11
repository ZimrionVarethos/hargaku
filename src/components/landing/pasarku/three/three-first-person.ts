import * as THREE from 'three';

export interface FirstPersonRigOptions {
  showLeftHand?: boolean;
  reducedMotion?: boolean;
}

export interface FirstPersonRigHandle {
  rigGroup: THREE.Group;
  update: (progress: number, timeSec: number, aspect: number) => void;
  setVisible: (visible: boolean) => void;
  setLeftHandEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setTheme: (isDark: boolean) => void;
  dispose: () => void;
}

function createBambooWeaveTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#9D6E33';
  ctx.fillRect(0, 0, size, size);

  const step = 16;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const parity = ((x / step) + (y / step)) % 2 === 0;
      ctx.fillStyle = parity ? '#D8AD68' : '#BA8848';
      ctx.fillRect(x + 1, y + 1, step - 2, step - 3);
      ctx.fillStyle = '#5E3C16';
      ctx.fillRect(x, y, step, 1.5);
      ctx.fillRect(x, y, 1.5, step);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  return tex;
}

function prepareMesh(mesh: THREE.Mesh) {
  mesh.renderOrder = 20;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  mesh.raycast = () => {};
}

export function createFirstPersonRig(
  camera: THREE.PerspectiveCamera,
  isDark: boolean,
  options: FirstPersonRigOptions = {}
): FirstPersonRigHandle {
  const rigGroup = new THREE.Group();
  rigGroup.name = 'buyer-first-person-rig';
  rigGroup.visible = false;

  const rightRig = new THREE.Group();
  const leftRig = new THREE.Group();
  rigGroup.add(rightRig, leftRig);

  let leftEnabled = options.showLeftHand ?? true;
  let reducedMotion = Boolean(options.reducedMotion);

  const bambooTex = createBambooWeaveTexture();
  const bambooMat = new THREE.MeshStandardMaterial({
    map: bambooTex,
    roughness: 0.78,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xb98544, roughness: 0.72, metalness: 0.05 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc2835a, roughness: 0.62, metalness: 0.02 });
  const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x245034, roughness: 0.85, metalness: 0.03 });
  const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.05 });
  const carrotMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45, metalness: 0.03 });
  const greensMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.68, metalness: 0.02 });
  const greensDarkMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.72, metalness: 0.02 });

  const allMaterials = [bambooMat, rimMat, skinMat, sleeveMat, tomatoMat, carrotMat, greensMat, greensDarkMat];

  const applyTheme = (dark: boolean) => {
    const emissiveHex = dark ? 0x2a180a : 0x000000;
    const emissiveInt = dark ? 0.36 : 0;
    for (const m of allMaterials) {
      m.emissive.setHex(emissiveHex);
      m.emissiveIntensity = emissiveInt;
    }
  };
  applyTheme(isDark);

  const basketBodyGeo = new THREE.CylinderGeometry(0.105, 0.076, 0.095, 14, 1, true);
  const basketBaseGeo = new THREE.CircleGeometry(0.076, 14);
  const basketRimGeo = new THREE.TorusGeometry(0.105, 0.0085, 6, 16);
  const armGeo = new THREE.CapsuleGeometry(0.021, 0.19, 4, 8, 1);
  const sleeveGeo = new THREE.CapsuleGeometry(0.029, 0.13, 4, 8, 1);
  const handGeo = new THREE.SphereGeometry(0.021, 10, 8);
  const tomatoGeo = new THREE.SphereGeometry(0.023, 10, 8);
  const carrotGeo = new THREE.ConeGeometry(0.015, 0.078, 8);
  const greensGeo = new THREE.DodecahedronGeometry(0.022, 0);

  const allGeos = [
    basketBodyGeo, basketBaseGeo, basketRimGeo, armGeo,
    sleeveGeo, handGeo, tomatoGeo, carrotGeo, greensGeo,
  ];

  const basketPivot = new THREE.Group();
  basketPivot.rotation.set(0.36, -0.24, 0.04);

  const basketBody = new THREE.Mesh(basketBodyGeo, bambooMat);
  const basketBase = new THREE.Mesh(basketBaseGeo, bambooMat);
  basketBase.rotation.x = -Math.PI / 2;
  basketBase.position.y = -0.047;
  const basketRim = new THREE.Mesh(basketRimGeo, rimMat);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.y = 0.048;

  const tomatoMesh = new THREE.Mesh(tomatoGeo, tomatoMat);
  tomatoMesh.position.set(-0.036, 0.024, 0.016);
  tomatoMesh.scale.set(1.05, 0.85, 1.05);

  const carrotMesh = new THREE.Mesh(carrotGeo, carrotMat);
  carrotMesh.position.set(0.032, 0.028, -0.014);
  carrotMesh.rotation.set(0.42, 0.2, -0.52);

  const greensMeshA = new THREE.Mesh(greensGeo, greensMat);
  greensMeshA.position.set(-0.002, 0.026, 0.032);
  greensMeshA.scale.set(1.15, 0.9, 1.0);

  const greensMeshB = new THREE.Mesh(greensGeo, greensDarkMat);
  greensMeshB.position.set(0.022, 0.022, 0.024);
  greensMeshB.scale.set(0.9, 0.85, 0.9);

  const rightArm = new THREE.Mesh(armGeo, skinMat);
  rightArm.position.set(0.132, -0.032, 0.072);
  rightArm.rotation.set(1.06, -0.2, 0.32);

  const rightSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  rightSleeve.position.set(0.174, -0.082, 0.132);
  rightSleeve.rotation.set(1.06, -0.2, 0.32);

  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0.105, 0.032, 0.008);
  rightHand.rotation.set(0.35, -0.2, 0.32);
  rightHand.scale.set(0.76, 0.72, 1.18);

  basketPivot.add(
    basketBody, basketBase, basketRim,
    tomatoMesh, carrotMesh, greensMeshA, greensMeshB,
    rightArm, rightSleeve, rightHand
  );
  rightRig.add(basketPivot);

  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.rotation.set(-1.18, 0.22, -0.2);

  const leftArm = new THREE.Mesh(armGeo, skinMat);
  leftArm.position.set(0, 0, 0);

  const leftSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  leftSleeve.position.set(0, -0.105, 0);

  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(0, 0.105, 0);
  leftHand.scale.set(0.84, 1.28, 0.64);
  leftForearmGroup.add(leftArm, leftSleeve, leftHand);
  leftRig.add(leftForearmGroup);

  rigGroup.traverse((obj) => {
    if (obj instanceof THREE.Mesh) prepareMesh(obj);
  });
  camera.add(rigGroup);

  let lagY = 0;
  let lagRotZ = 0;
  let lastProgress = 0;
  let lagSpeed = 0;

  const update = (progress: number, timeSec: number, aspect: number) => {
    const safeAspect = Math.max(0.4, aspect);
    const halfH = 0.45 * Math.tan((camera.fov * Math.PI) / 360);
    const halfW = halfH * safeAspect;
    const isMobile = safeAspect < 0.8;

    const scale = isMobile ? 0.44 : safeAspect < 1.15 ? 0.76 : 0.86;
    const baseX = isMobile ? halfW * 0.46 : Math.min(0.205, Math.max(0.13, halfW * 0.49));
    const baseY = isMobile ? -0.182 : -0.158;

    const deltaP = progress - lastProgress;
    lastProgress = progress;
    lagSpeed += (Math.max(-0.03, Math.min(0.03, deltaP * 1.4)) - lagSpeed) * 0.15;

    let idleBreath = 0;
    if (reducedMotion) {
      lagY = 0;
      lagRotZ = 0;
      lagSpeed = 0;
    } else {
      idleBreath = Math.sin(timeSec * 1.8) * 0.002;
      const targetBobY = Math.sin(progress * 32 * Math.PI + Math.PI / 2) * 0.02;
      const targetRotZ = Math.sin(progress * 16 * Math.PI + Math.PI / 2) * (3 * Math.PI / 180);
      lagY += (targetBobY - lagY) * 0.15;
      lagRotZ += (targetRotZ - lagRotZ) * 0.15;
    }

    rightRig.scale.setScalar(scale);
    rightRig.position.set(baseX, baseY + lagY + idleBreath, -0.45 + Math.abs(lagSpeed) * 0.18);
    rightRig.rotation.set(lagSpeed * 0.5, 0, lagRotZ);

    const showLeft = leftEnabled && safeAspect > 1.2;
    leftRig.visible = showLeft;
    if (showLeft) {
      leftRig.scale.setScalar(0.76);
      leftRig.position.set(-Math.min(0.28, halfW * 0.63), -0.188 - lagY * 0.55 - idleBreath * 0.4, -0.45);
      leftRig.rotation.set(-lagSpeed * 0.35, 0, -lagRotZ * 0.75);
    }
  };

  update(0, 0, camera.aspect || 1.6);

  return {
    rigGroup,
    update,
    setVisible: (visible: boolean) => {
      rigGroup.visible = visible;
    },
    setLeftHandEnabled: (enabled: boolean) => {
      leftEnabled = enabled;
    },
    setReducedMotion: (reduced: boolean) => {
      reducedMotion = reduced;
      if (reduced) {
        lagY = 0;
        lagRotZ = 0;
        lagSpeed = 0;
      }
    },
    setTheme: applyTheme,
    dispose: () => {
      camera.remove(rigGroup);
      for (const g of allGeos) g.dispose();
      for (const m of allMaterials) m.dispose();
      bambooTex.dispose();
    },
  };
}
