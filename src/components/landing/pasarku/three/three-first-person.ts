import * as THREE from 'three';
import { MarketTexturePack } from './three-pbr-textures';
import { ProduceTexturePack } from './three-produce-textures';
import { createGrabProducePool } from './three-grab-produce';
import {
  allocateBasketSlotIndex,
  evaluateGrabTimeline,
  evaluateRemoveTimeline,
  getGrabProduceScale,
  GRAB_ANIMATION_MS,
  REMOVE_ANIMATION_MS,
} from './three-corridor-math';

export interface FirstPersonRigOptions {
  showReachHand?: boolean;
  reducedMotion?: boolean;
}

export interface BasketHitboxMesh extends THREE.Mesh {
  userData: {
    basketItemId: number;
    produceType: string;
    commodityName: string;
  };
}

export interface FirstPersonGrabHooks {
  onPickStart?: () => void;
  onDropInBasket?: () => void;
  onComplete: () => void;
}

export interface FirstPersonRemoveHooks {
  onPullOut?: () => void;
  onComplete?: () => void;
}

export interface FirstPersonRigHandle {
  rigGroup: THREE.Group;
  update: (progress: number, timeSec: number, aspect: number, nowMs?: number) => boolean;
  setVisible: (visible: boolean) => void;
  setReachHandEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setTheme: (isDark: boolean) => void;
  startGrab: (
    produceType: string,
    commodityName: string,
    reachX: number,
    reachY: number,
    hooks: FirstPersonGrabHooks
  ) => void;
  startRemoveBasketItem: (basketItemId: number, hooks?: FirstPersonRemoveHooks) => boolean;
  getBasketHitboxes: () => BasketHitboxMesh[];
  getBasketCount: () => number;
  cancelGrab: () => void;
  isGrabbing: () => boolean;
  dispose: () => void;
}

interface BasketCollectedEntry {
  id: number;
  slotIndex: number;
  produceType: string;
  commodityName: string;
  mesh: THREE.Mesh;
  hitbox: BasketHitboxMesh;
}

interface ActiveActionState {
  mode: 'idle' | 'grab' | 'remove';
  produceType: string;
  commodityName: string;
  reachX: number;
  reachY: number;
  targetBasketItemId: number;
  startedAtMs: number;
  phaseFlagA: boolean;
  phaseFlagB: boolean;
  hasCompleted: boolean;
  heldMesh: THREE.Mesh | null;
  heldBaseScale: number;
  onPickStart: (() => void) | null;
  onDropInBasket: (() => void) | null;
  onComplete: (() => void) | null;
}

const COLLECTED_SLOTS: ReadonlyArray<readonly [number, number, number]> = [
  [-0.036, 0.038, -0.014],
  [0.034, 0.036, 0.016],
  [0.0, 0.042, 0.0],
  [-0.024, 0.04, 0.026],
  [0.026, 0.04, -0.024],
  [-0.044, 0.044, 0.008],
  [0.044, 0.042, -0.004],
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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
  tex: MarketTexturePack,
  pTex: ProduceTexturePack,
  options: FirstPersonRigOptions = {}
): FirstPersonRigHandle {
  const rigGroup = new THREE.Group();
  rigGroup.name = 'buyer-first-person-rig';
  rigGroup.visible = false;

  const basketRig = new THREE.Group();
  const reachRig = new THREE.Group();
  rigGroup.add(basketRig, reachRig);

  let reachEnabled = options.showReachHand ?? true;
  let reducedMotion = Boolean(options.reducedMotion);

  const producePool = createGrabProducePool(tex, pTex, isDark);
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
  const basketHitMat = new THREE.MeshBasicMaterial({ visible: false });

  const allMaterials = [bambooMat, rimMat, skinMat, sleeveMat, basketHitMat];

  const applyTheme = (dark: boolean) => {
    const emissiveHex = dark ? 0x2a180a : 0x000000;
    const emissiveInt = dark ? 0.36 : 0;
    for (const m of [bambooMat, rimMat, skinMat, sleeveMat]) {
      m.emissive.setHex(emissiveHex);
      m.emissiveIntensity = emissiveInt;
    }
    producePool.setTheme(dark);
  };
  applyTheme(isDark);

  const basketBodyGeo = new THREE.CylinderGeometry(0.105, 0.076, 0.095, 14, 1, true);
  const basketBaseGeo = new THREE.CircleGeometry(0.076, 14);
  const basketRimGeo = new THREE.TorusGeometry(0.105, 0.0085, 6, 16);
  const armGeo = new THREE.CapsuleGeometry(0.021, 0.19, 4, 8, 1);
  const sleeveGeo = new THREE.CapsuleGeometry(0.029, 0.13, 4, 8, 1);
  const handGeo = new THREE.SphereGeometry(0.021, 10, 8);
  const basketHitGeo = new THREE.SphereGeometry(0.034, 8, 6);

  const allGeos = [
    basketBodyGeo,
    basketBaseGeo,
    basketRimGeo,
    armGeo,
    sleeveGeo,
    handGeo,
    basketHitGeo,
  ];

  const basketPivot = new THREE.Group();
  basketPivot.rotation.set(0.36, 0.24, -0.04);

  const basketBody = new THREE.Mesh(basketBodyGeo, bambooMat);
  const basketBase = new THREE.Mesh(basketBaseGeo, bambooMat);
  basketBase.rotation.x = -Math.PI / 2;
  basketBase.position.y = -0.047;
  const basketRim = new THREE.Mesh(basketRimGeo, rimMat);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.y = 0.048;

  const leftArm = new THREE.Mesh(armGeo, skinMat);
  leftArm.position.set(-0.132, -0.032, 0.072);
  leftArm.rotation.set(1.06, 0.2, -0.32);

  const leftSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  leftSleeve.position.set(-0.174, -0.082, 0.132);
  leftSleeve.rotation.set(1.06, 0.2, -0.32);

  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(-0.105, 0.032, 0.008);
  leftHand.rotation.set(0.35, 0.2, -0.32);
  leftHand.scale.set(0.76, 0.72, 1.18);

  const collectedGroup = new THREE.Group();
  const collectedItems: BasketCollectedEntry[] = [];

  basketPivot.add(
    basketBody,
    basketBase,
    basketRim,
    collectedGroup,
    leftArm,
    leftSleeve,
    leftHand
  );
  basketRig.add(basketPivot);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.rotation.set(-1.18, -0.22, 0.2);

  const rightArm = new THREE.Mesh(armGeo, skinMat);
  rightArm.position.set(0, 0, 0);

  const rightSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  rightSleeve.position.set(0, -0.105, 0);

  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0, 0.105, 0);
  rightHand.scale.set(0.84, 1.28, 0.64);

  const handCarryAnchor = new THREE.Group();
  handCarryAnchor.position.set(-0.006, 0.124, 0.016);

  rightForearmGroup.add(rightArm, rightSleeve, rightHand, handCarryAnchor);
  reachRig.add(rightForearmGroup);

  rigGroup.traverse((obj) => {
    if (obj instanceof THREE.Mesh) prepareMesh(obj);
  });
  camera.add(rigGroup);

  let lagY = 0;
  let lagRotZ = 0;
  let lastProgress = 0;
  let lagSpeed = 0;
  let catchBounce = 0;
  let nextBasketItemId = 1;

  const actionState: ActiveActionState = {
    mode: 'idle',
    produceType: 'tomat',
    commodityName: 'Komoditas',
    reachX: 0,
    reachY: 0,
    targetBasketItemId: 0,
    startedAtMs: 0,
    phaseFlagA: false,
    phaseFlagB: false,
    hasCompleted: false,
    heldMesh: null,
    heldBaseScale: 0.65,
    onPickStart: null,
    onDropInBasket: null,
    onComplete: null,
  };

  const removeEntryFromBasket = (entryIndex: number): BasketCollectedEntry | null => {
    if (entryIndex < 0 || entryIndex >= collectedItems.length) return null;
    const [removed] = collectedItems.splice(entryIndex, 1);
    collectedGroup.remove(removed.mesh);
    collectedGroup.remove(removed.hitbox);
    return removed;
  };

  const addProduceToBasket = (produceType: string, commodityName: string) => {
    const occupied = collectedItems.map((item) => item.slotIndex);
    const { slotIndex, evictSlotIndex } = allocateBasketSlotIndex(occupied, COLLECTED_SLOTS.length);
    if (evictSlotIndex !== null) {
      const idx = collectedItems.findIndex((item) => item.slotIndex === evictSlotIndex);
      if (idx >= 0) removeEntryFromBasket(idx);
    }

    const slot = COLLECTED_SLOTS[slotIndex];
    const id = nextBasketItemId++;

    const itemMesh = producePool.createProduceMesh(produceType);
    itemMesh.scale.multiplyScalar(0.76);
    itemMesh.position.set(slot[0], slot[1], slot[2]);
    itemMesh.rotation.set(0.25, (slotIndex + 1) * 1.1, 0.15);

    const hitbox = new THREE.Mesh(basketHitGeo, basketHitMat) as unknown as BasketHitboxMesh;
    hitbox.position.set(slot[0], slot[1] + 0.006, slot[2]);
    hitbox.renderOrder = 21;
    hitbox.castShadow = false;
    hitbox.receiveShadow = false;
    hitbox.frustumCulled = false;
    hitbox.userData = {
      basketItemId: id,
      produceType,
      commodityName,
    };

    collectedGroup.add(itemMesh);
    collectedGroup.add(hitbox);
    collectedItems.push({
      id,
      slotIndex,
      produceType,
      commodityName,
      mesh: itemMesh,
      hitbox,
    });
  };

  const detachById = (basketItemId: number): BasketCollectedEntry | null => {
    const idx = collectedItems.findIndex((item) => item.id === basketItemId);
    if (idx < 0) return null;
    return removeEntryFromBasket(idx);
  };

  const clearHeldMesh = () => {
    if (actionState.heldMesh) {
      handCarryAnchor.remove(actionState.heldMesh);
      actionState.heldMesh = null;
    }
  };

  const cancelGrab = () => {
    clearHeldMesh();
    actionState.mode = 'idle';
    actionState.targetBasketItemId = 0;
    actionState.phaseFlagA = false;
    actionState.phaseFlagB = false;
    actionState.hasCompleted = false;
    actionState.onPickStart = null;
    actionState.onDropInBasket = null;
    actionState.onComplete = null;
    rightForearmGroup.rotation.set(-1.18, -0.22, 0.2);
  };

  const startGrab = (
    produceType: string,
    commodityName: string,
    reachX: number,
    reachY: number,
    hooks: FirstPersonGrabHooks
  ) => {
    cancelGrab();
    if (reducedMotion) {
      hooks.onPickStart?.();
      addProduceToBasket(produceType, commodityName);
      hooks.onDropInBasket?.();
      hooks.onComplete();
      return;
    }
    actionState.mode = 'grab';
    actionState.produceType = produceType;
    actionState.commodityName = commodityName;
    actionState.reachX = reachX;
    actionState.reachY = reachY;
    actionState.startedAtMs = performance.now();
    actionState.phaseFlagA = false;
    actionState.phaseFlagB = false;
    actionState.hasCompleted = false;
    actionState.onPickStart = hooks.onPickStart ?? null;
    actionState.onDropInBasket = hooks.onDropInBasket ?? null;
    actionState.onComplete = hooks.onComplete;
  };

  const startRemoveBasketItem = (
    basketItemId: number,
    hooks: FirstPersonRemoveHooks = {}
  ): boolean => {
    const target = collectedItems.find((item) => item.id === basketItemId);
    if (!target) return false;
    cancelGrab();
    if (reducedMotion) {
      detachById(basketItemId);
      hooks.onPullOut?.();
      hooks.onComplete?.();
      return true;
    }
    actionState.mode = 'remove';
    actionState.targetBasketItemId = target.id;
    actionState.produceType = target.produceType;
    actionState.commodityName = target.commodityName;
    actionState.startedAtMs = performance.now();
    actionState.phaseFlagA = false;
    actionState.phaseFlagB = false;
    actionState.hasCompleted = false;
    actionState.onPickStart = hooks.onPullOut ?? null;
    actionState.onComplete = hooks.onComplete ?? null;
    return true;
  };

  const update = (progress: number, timeSec: number, aspect: number, nowMs = performance.now()): boolean => {
    const safeAspect = Math.max(0.4, aspect);
    const halfH = 0.45 * Math.tan((camera.fov * Math.PI) / 360);
    const halfW = halfH * safeAspect;
    const isMobile = safeAspect < 0.8;

    const basketScale = isMobile ? 0.44 : safeAspect < 1.15 ? 0.76 : 0.86;
    const leftBaseX = isMobile ? -halfW * 0.46 : -Math.min(0.205, Math.max(0.13, halfW * 0.49));
    const leftBaseY = isMobile ? -0.182 : -0.158;

    const deltaP = progress - lastProgress;
    lastProgress = progress;
    lagSpeed += (Math.max(-0.03, Math.min(0.03, deltaP * 1.4)) - lagSpeed) * 0.15;

    let idleBreath = 0;
    if (reducedMotion) {
      lagY = 0;
      lagRotZ = 0;
      lagSpeed = 0;
      catchBounce = 0;
    } else {
      idleBreath = Math.sin(timeSec * 1.8) * 0.002;
      const targetBobY = Math.sin(progress * 32 * Math.PI + Math.PI / 2) * 0.02;
      const targetRotZ = Math.sin(progress * 16 * Math.PI + Math.PI / 2) * (3 * Math.PI / 180);
      lagY += (targetBobY - lagY) * 0.15;
      lagRotZ += (targetRotZ - lagRotZ) * 0.15;
      if (catchBounce > 0.002) catchBounce *= 0.84;
      else catchBounce = 0;
    }

    basketRig.scale.setScalar(basketScale);
    basketRig.position.set(
      leftBaseX,
      leftBaseY + lagY + idleBreath - catchBounce * 0.016,
      -0.45 + Math.abs(lagSpeed) * 0.18
    );
    basketRig.rotation.set(lagSpeed * 0.5 + catchBounce * 0.08, 0, -lagRotZ);

    const restX = isMobile ? halfW * 0.54 : Math.min(0.27, halfW * 0.62);
    const restY = (isMobile ? -0.205 : -0.188) - lagY * 0.55 - idleBreath * 0.4;
    const restZ = -0.45;
    const restScale = isMobile ? 0.56 : 0.76;

    const showRestRight = reachEnabled && safeAspect > 1.05;
    const isAnimating = actionState.mode !== 'idle';
    reachRig.visible = showRestRight || isAnimating;

    if (!isAnimating) {
      reachRig.scale.setScalar(restScale);
      reachRig.position.set(restX, restY, restZ);
      reachRig.rotation.set(0, 0, 0);
      rightForearmGroup.rotation.set(-1.18 - lagSpeed * 0.35, -0.22, 0.2 - lagRotZ * 0.75);
      return catchBounce > 0.002;
    }

    const elapsed = Math.max(0, nowMs - actionState.startedAtMs);
    const dropX = leftBaseX + 0.06;
    const dropY = leftBaseY + 0.035;
    const dropZ = -0.35;

    if (actionState.mode === 'grab') {
      const tl = evaluateGrabTimeline(elapsed, GRAB_ANIMATION_MS);
      const grabX = Math.max(-0.14, Math.min(0.28, restX * 0.42 + actionState.reachX));
      const grabY = Math.max(-0.22, Math.min(0.06, restY + 0.09 + actionState.reachY));
      const grabZ = -0.52;

      if (tl.phase === 'reach') {
        const a = tl.reachAlpha;
        reachRig.position.set(lerp(restX, grabX, a), lerp(restY, grabY, a), lerp(restZ, grabZ, a));
        rightForearmGroup.rotation.set(
          lerp(-1.18, -1.42, a),
          lerp(-0.22, -actionState.reachX * 1.15, a),
          lerp(0.2, 0.05, a)
        );
      } else if (tl.phase === 'carry') {
        if (!actionState.phaseFlagA) {
          actionState.phaseFlagA = true;
          const held = producePool.createProduceMesh(actionState.produceType);
          handCarryAnchor.add(held);
          actionState.heldMesh = held;
          actionState.heldBaseScale = getGrabProduceScale(actionState.produceType);
          const pickCb = actionState.onPickStart;
          actionState.onPickStart = null;
          if (pickCb) pickCb();
        }
        const a = tl.carryAlpha;
        const arcY = Math.sin(a * Math.PI) * 0.055;
        reachRig.position.set(
          lerp(grabX, dropX, a),
          lerp(grabY, dropY, a) + arcY,
          lerp(grabZ, dropZ, a)
        );
        rightForearmGroup.rotation.set(
          lerp(-1.42, -1.04, a),
          lerp(-actionState.reachX * 1.15, 0.42, a),
          lerp(0.05, 0.54, a)
        );
      } else if (tl.phase === 'drop') {
        if (tl.triggerBasketDrop && !actionState.phaseFlagB) {
          actionState.phaseFlagB = true;
          clearHeldMesh();
          addProduceToBasket(actionState.produceType, actionState.commodityName);
          catchBounce = 1.0;
          const dropCb = actionState.onDropInBasket;
          actionState.onDropInBasket = null;
          if (dropCb) dropCb();
        }
        const a = tl.settleAlpha;
        reachRig.position.set(lerp(dropX, restX, a), lerp(dropY, restY, a), lerp(dropZ, restZ, a));
        rightForearmGroup.rotation.set(
          lerp(-1.04, -1.18, a),
          lerp(0.42, -0.22, a),
          lerp(0.54, 0.2, a)
        );
      } else if (tl.isFinished) {
        if (!actionState.phaseFlagB) {
          actionState.phaseFlagB = true;
          clearHeldMesh();
          addProduceToBasket(actionState.produceType, actionState.commodityName);
          catchBounce = 1.0;
          const dropCb = actionState.onDropInBasket;
          actionState.onDropInBasket = null;
          if (dropCb) dropCb();
        }
        const cb = !actionState.hasCompleted ? actionState.onComplete : null;
        actionState.hasCompleted = true;
        cancelGrab();
        if (cb) cb();
      }
    } else if (actionState.mode === 'remove') {
      const tl = evaluateRemoveTimeline(elapsed, REMOVE_ANIMATION_MS);
      const tossX = restX + 0.15;
      const tossY = restY - 0.11;
      const tossZ = -0.32;

      if (tl.phase === 'reach-basket') {
        const a = tl.reachAlpha;
        reachRig.position.set(lerp(restX, dropX, a), lerp(restY, dropY, a), lerp(restZ, dropZ, a));
        rightForearmGroup.rotation.set(
          lerp(-1.18, -1.04, a),
          lerp(-0.22, 0.42, a),
          lerp(0.2, 0.54, a)
        );
      } else if (tl.phase === 'pull-out') {
        if (!actionState.phaseFlagA) {
          actionState.phaseFlagA = true;
          detachById(actionState.targetBasketItemId);
          catchBounce = 0.55;
          const held = producePool.createProduceMesh(actionState.produceType);
          handCarryAnchor.add(held);
          actionState.heldMesh = held;
          actionState.heldBaseScale = getGrabProduceScale(actionState.produceType);
          const pullCb = actionState.onPickStart;
          actionState.onPickStart = null;
          if (pullCb) pullCb();
        }
        const a = tl.pullAlpha;
        const arcY = Math.sin(a * Math.PI) * 0.068;
        reachRig.position.set(
          lerp(dropX, tossX, a),
          lerp(dropY, tossY, a) + arcY,
          lerp(dropZ, tossZ, a)
        );
        rightForearmGroup.rotation.set(
          lerp(-1.04, -1.26, a),
          lerp(0.42, -0.36, a),
          lerp(0.54, -0.04, a)
        );
        if (actionState.heldMesh) {
          const shrink = Math.max(0.02, 1 - a * 0.85);
          actionState.heldMesh.scale.setScalar(actionState.heldBaseScale * shrink);
        }
      } else if (tl.phase === 'settle') {
        if (!actionState.phaseFlagB) {
          actionState.phaseFlagB = true;
          clearHeldMesh();
        }
        const a = tl.settleAlpha;
        reachRig.position.set(lerp(tossX, restX, a), lerp(tossY, restY, a), lerp(tossZ, restZ, a));
        rightForearmGroup.rotation.set(
          lerp(-1.26, -1.18, a),
          lerp(-0.36, -0.22, a),
          lerp(-0.04, 0.2, a)
        );
      } else if (tl.isFinished) {
        if (!actionState.phaseFlagA) {
          actionState.phaseFlagA = true;
          detachById(actionState.targetBasketItemId);
          catchBounce = 0.55;
          const pullCb = actionState.onPickStart;
          actionState.onPickStart = null;
          if (pullCb) pullCb();
        }
        const cb = !actionState.hasCompleted ? actionState.onComplete : null;
        actionState.hasCompleted = true;
        cancelGrab();
        if (cb) cb();
      }
    }

    reachRig.scale.setScalar(restScale);
    return actionState.mode !== 'idle' || catchBounce > 0.002;
  };

  update(0, 0, camera.aspect || 1.6);

  return {
    rigGroup,
    update,
    setVisible: (visible: boolean) => {
      rigGroup.visible = visible;
    },
    setReachHandEnabled: (enabled: boolean) => {
      reachEnabled = enabled;
    },
    setReducedMotion: (reduced: boolean) => {
      reducedMotion = reduced;
      if (reduced) {
        lagY = 0;
        lagRotZ = 0;
        lagSpeed = 0;
        catchBounce = 0;
        cancelGrab();
      }
    },
    setTheme: applyTheme,
    startGrab,
    startRemoveBasketItem,
    getBasketHitboxes: () => collectedItems.map((item) => item.hitbox),
    getBasketCount: () => collectedItems.length,
    cancelGrab,
    isGrabbing: () => actionState.mode !== 'idle' || catchBounce > 0.002,
    dispose: () => {
      cancelGrab();
      while (collectedItems.length > 0) removeEntryFromBasket(0);
      camera.remove(rigGroup);
      for (const g of allGeos) g.dispose();
      for (const m of allMaterials) m.dispose();
      bambooTex.dispose();
      producePool.dispose();
    },
  };
}
