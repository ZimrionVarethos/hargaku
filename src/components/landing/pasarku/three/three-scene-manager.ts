import * as THREE from 'three';
import { createMarketTexturePack, MarketTexturePack } from './three-pbr-textures';
import { createProduceTexturePack, ProduceTexturePack } from './three-produce-textures';
import { createMarketEnvironment, MarketEnvironmentRig } from './three-environment';
import {
  createMarketStalls,
  MarketStallsHandle,
  ThreeStallCompartment,
  StallHitboxMesh,
  StallPriceTagHandle,
} from './three-stalls';
import { createMarketVendors, MarketVendorsHandle } from './three-vendors';
import {
  BasketHitboxMesh,
  createFirstPersonRig,
  FirstPersonGrabHooks,
  FirstPersonRemoveHooks,
  FirstPersonRigHandle,
} from './three-first-person';
import { disposeMarketCorridorScene, refreshPriceTagTextures } from './three-scene-resources';
import {
  BASE_CAMERA_PITCH,
  BASE_CAMERA_YAW,
  applyLookDelta,
  clampCameraSpaceReachTarget,
  isCameraTurnedAway,
} from './three-corridor-math';

export type CorridorRaycastResult =
  | {
      kind: 'basket-item';
      basketItemId: number;
      produceType: string;
      commodityName: string;
    }
  | {
      kind: 'stall';
      compartmentId: number;
      commodityId: number;
      produceType: string;
      hitPoint: THREE.Vector3;
    };

export class ThreeMarketCorridorManager {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private texPack: MarketTexturePack | null = null;
  private pTexPack: ProduceTexturePack | null = null;
  private lights: MarketEnvironmentRig | null = null;
  private stalls: MarketStallsHandle | null = null;
  private vendors: MarketVendorsHandle | null = null;
  private firstPerson: FirstPersonRigHandle | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private hitboxes: StallHitboxMesh[] = [];
  private priceTags: StallPriceTagHandle[] = [];
  private corridorLength = 64;
  private animId: number | null = null;
  private isDisposed = false;
  private isDirty = true;
  private isActive = false;
  private isHidden = false;
  private reducedMotion = false;
  private idleCounter = 0;
  private currentProgress = 0;
  private targetProgress = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private currentPitch = 0;
  private targetPitch = 0;
  private lastTurnedAway = false;
  private lookStateListener: ((turnedAway: boolean) => void) | null = null;
  private lastIdleFrameMs = 0;
  private startTimeMs = 0;
  private motionQuery: MediaQueryList | null = null;

  private readonly handleMotionChange = (e: MediaQueryListEvent) => {
    this.reducedMotion = e.matches;
    this.vendors?.setReducedMotion(e.matches);
    this.firstPerson?.setReducedMotion(e.matches);
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  };

  private readonly handleVisibilityChange = () => {
    this.isHidden = typeof document !== 'undefined' && document.hidden;
    if (!this.isHidden && this.isActive) {
      this.isDirty = true;
      this.scheduleFrame();
    }
  };

  private readonly renderLoop = (now: number) => {
    this.animId = null;
    if (this.isDisposed) return;

    const delta = this.targetProgress - this.currentProgress;
    const isWalking = Math.abs(delta) > 0.0001;
    if (isWalking) {
      this.currentProgress += delta * 0.22;
      this.isDirty = true;
      this.idleCounter = 0;
    } else if (this.currentProgress !== this.targetProgress) {
      this.currentProgress = this.targetProgress;
      this.isDirty = true;
      this.idleCounter = 0;
    }

    const yawDelta = this.targetYaw - this.currentYaw;
    const pitchDelta = this.targetPitch - this.currentPitch;
    const isLooking = Math.abs(yawDelta) > 0.0005 || Math.abs(pitchDelta) > 0.0005;
    if (isLooking) {
      this.currentYaw += yawDelta * 0.28;
      this.currentPitch += pitchDelta * 0.28;
      this.isDirty = true;
      this.idleCounter = 0;
    } else if (this.currentYaw !== this.targetYaw || this.currentPitch !== this.targetPitch) {
      this.currentYaw = this.targetYaw;
      this.currentPitch = this.targetPitch;
      this.isDirty = true;
      this.idleCounter = 0;
    }

    const isGrabAnimating = Boolean(this.firstPerson?.isGrabbing());
    if (isGrabAnimating) {
      this.isDirty = true;
      this.idleCounter = 0;
    }

    if (!isWalking && !isLooking && !isGrabAnimating && this.idleCounter < 18) {
      this.idleCounter++;
      this.isDirty = true;
    }

    const canAnimateIdle = this.isActive && !this.reducedMotion && !this.isHidden;
    if (!this.isDirty && canAnimateIdle && now - this.lastIdleFrameMs >= 33.3) {
      this.isDirty = true;
      this.lastIdleFrameMs = now;
    }

    let keepGrabActive = false;
    if (this.isDirty && this.renderer && this.scene && this.camera) {
      const timeSec = (now - this.startTimeMs) * 0.001;
      const curZ = this.applyCameraAndLights();
      this.vendors?.update(timeSec, curZ);
      keepGrabActive =
        this.firstPerson?.update(this.currentProgress, timeSec, this.camera.aspect, now) ?? false;
      this.renderer.render(this.scene, this.camera);
      this.isDirty = false;
    }

    if (isWalking || isLooking || isGrabAnimating || keepGrabActive || this.idleCounter < 18 || canAnimateIdle) {
      this.scheduleFrame();
    }
  };

  private scheduleFrame() {
    if (this.isDisposed || this.animId !== null) return;
    this.animId = requestAnimationFrame(this.renderLoop);
  }

  private notifyLookState() {
    const turnedAway = isCameraTurnedAway(this.targetYaw, this.targetPitch);
    if (turnedAway !== this.lastTurnedAway) {
      this.lastTurnedAway = turnedAway;
      this.lookStateListener?.(turnedAway);
    }
  }

  public init(
    container: HTMLDivElement,
    isDark: boolean,
    compartments: ThreeStallCompartment[]
  ) {
    this.isDisposed = false;
    this.isDirty = true;
    this.idleCounter = 0;
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.currentYaw = 0;
    this.targetYaw = 0;
    this.currentPitch = 0;
    this.targetPitch = 0;
    this.lastTurnedAway = false;
    this.startTimeMs = performance.now();
    this.lastIdleFrameMs = this.startTimeMs;
    this.isHidden = typeof document !== 'undefined' && document.hidden;

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.motionQuery.matches;
      this.motionQuery.addEventListener('change', this.handleMotionChange);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    const concurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
    const isMobileHardware =
      typeof window !== 'undefined' &&
      (window.innerWidth <= 900 || window.matchMedia?.('(pointer: coarse)')?.matches === true);
    const isLowEnd = concurrency <= 4 && isMobileHardware;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 90);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(0, 1.58, 0);
    this.camera.rotation.set(BASE_CAMERA_PITCH, BASE_CAMERA_YAW, 0, 'YXZ');
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = isDark ? 0.95 : 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.texPack = createMarketTexturePack();
    this.pTexPack = createProduceTexturePack();
    this.lights = createMarketEnvironment(this.scene, isDark, this.corridorLength, this.texPack);
    this.stalls = createMarketStalls(this.scene, isDark, compartments, this.texPack, this.pTexPack);
    this.hitboxes = this.stalls.hitboxes;
    this.priceTags = this.stalls.priceTags;

    this.vendors = createMarketVendors(this.scene, isDark, compartments, {
      step: isLowEnd ? 2 : 1,
      reducedMotion: this.reducedMotion,
    });
    this.firstPerson = createFirstPersonRig(this.camera, isDark, this.texPack, this.pTexPack, {
      showReachHand: !isLowEnd,
      reducedMotion: this.reducedMotion,
    });
    this.firstPerson.setVisible(this.isActive);
    this.scheduleFrame();
  }

  private applyCameraAndLights(): number {
    if (!this.camera) return 0;
    const curZ = this.currentProgress * (this.corridorLength - 4.0);
    const bobY = this.reducedMotion ? 0 : Math.sin(this.currentProgress * 32 * Math.PI) * 0.035;
    const bobX = this.reducedMotion ? 0 : Math.sin(this.currentProgress * 16 * Math.PI) * 0.025;

    this.camera.position.set(bobX, 1.58 + bobY, curZ);
    this.camera.rotation.set(
      BASE_CAMERA_PITCH + this.currentPitch,
      BASE_CAMERA_YAW + this.currentYaw,
      0,
      'YXZ'
    );

    const dirX = Math.sin(this.currentYaw);
    const dirZ = Math.cos(this.currentYaw);
    if (this.lights) {
      this.lights.nearLight.position.set(dirX * 1.6, 2.5, curZ + dirZ * 1.6);
      this.lights.aheadLight.position.set(dirX * 9.0, 2.5, curZ + dirZ * 9.0);
      this.lights.dirLight.position.set(4, 10, curZ + 6);
      this.lights.dirLight.target.position.set(0, 0, curZ + 10);
      this.lights.dirLight.target.updateMatrixWorld();
    }
    return curZ;
  }

  public setLookStateListener(listener: ((turnedAway: boolean) => void) | null) {
    this.lookStateListener = listener;
  }

  public panLook(deltaYaw: number, deltaPitch: number) {
    const next = applyLookDelta(this.targetYaw, this.targetPitch, deltaYaw, deltaPitch);
    this.targetYaw = next.yawOffset;
    this.targetPitch = next.pitchOffset;
    this.notifyLookState();
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public resetLook() {
    const twoPi = Math.PI * 2;
    let wrapped = ((this.currentYaw % twoPi) + twoPi) % twoPi;
    if (wrapped > Math.PI) wrapped -= twoPi;
    this.currentYaw = wrapped;
    this.targetYaw = 0;
    this.targetPitch = 0;
    this.notifyLookState();
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public triggerGrabCommodity(
    produceType: string,
    commodityName: string,
    hitPoint: THREE.Vector3,
    hooks: FirstPersonGrabHooks
  ) {
    if (!this.camera || !this.firstPerson) {
      hooks.onComplete();
      return;
    }
    this.camera.updateMatrixWorld(true);
    const localHit = this.camera.worldToLocal(hitPoint.clone());
    const { reachX, reachY } = clampCameraSpaceReachTarget(localHit.x, localHit.y);
    this.firstPerson.startGrab(produceType, commodityName, reachX, reachY, hooks);
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public triggerRemoveBasketItem(
    basketItemId: number,
    hooks?: FirstPersonRemoveHooks
  ): boolean {
    if (!this.firstPerson) return false;
    const started = this.firstPerson.startRemoveBasketItem(basketItemId, hooks);
    if (started) {
      this.isDirty = true;
      this.idleCounter = 0;
      this.scheduleFrame();
    }
    return started;
  }

  public getBasketCount(): number {
    return this.firstPerson?.getBasketCount() ?? 0;
  }

  public cancelGrab() {
    this.firstPerson?.cancelGrab();
  }

  public setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;
    if (!active) this.firstPerson?.cancelGrab();
    this.firstPerson?.setVisible(active);
    this.isDirty = true;
    this.idleCounter = 0;
    if (active) this.scheduleFrame();
  }

  public setTheme(isDark: boolean) {
    if (this.renderer) this.renderer.toneMappingExposure = isDark ? 0.95 : 1.15;
    this.lights?.setTheme(isDark);
    this.stalls?.setTheme(isDark);
    this.vendors?.setTheme(isDark);
    this.firstPerson?.setTheme(isDark);
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public updateWalk(walkProgress: number) {
    this.targetProgress = Math.max(0, Math.min(1, walkProgress));
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public updatePriceTags(compartments: ThreeStallCompartment[]) {
    refreshPriceTagTextures(this.priceTags, compartments);
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public handleResize(width: number, height: number) {
    if (!this.camera || !this.renderer || width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public raycastHit(
    clientX: number,
    clientY: number,
    containerRect: DOMRect
  ): CorridorRaycastResult | null {
    if (!this.camera) return null;
    this.pointer.x = ((clientX - containerRect.left) / containerRect.width) * 2 - 1;
    this.pointer.y = -((clientY - containerRect.top) / containerRect.height) * 2 + 1;
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const basketHitboxes = this.firstPerson?.getBasketHitboxes() ?? [];
    if (basketHitboxes.length > 0) {
      const basketHits = this.raycaster.intersectObjects(basketHitboxes, false);
      if (basketHits.length > 0) {
        const hit = basketHits[0].object as BasketHitboxMesh;
        return {
          kind: 'basket-item',
          basketItemId: hit.userData.basketItemId,
          produceType: hit.userData.produceType,
          commodityName: hit.userData.commodityName,
        };
      }
    }

    if (this.hitboxes.length === 0) return null;
    const intersects = this.raycaster.intersectObjects(this.hitboxes);
    if (intersects.length > 0) {
      const hit = intersects[0].object as StallHitboxMesh;
      return {
        kind: 'stall',
        compartmentId: hit.userData.compartmentId,
        commodityId: hit.userData.commodityId,
        produceType: hit.userData.produceType,
        hitPoint: intersects[0].point.clone(),
      };
    }
    return null;
  }

  public destroy() {
    this.isDisposed = true;
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.animId = null;
    this.motionQuery?.removeEventListener('change', this.handleMotionChange);
    this.motionQuery = null;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.lookStateListener = null;
    this.vendors?.dispose();
    this.firstPerson?.dispose();
    this.stalls?.dispose();
    disposeMarketCorridorScene(this.scene, this.renderer, this.texPack, this.pTexPack);
    this.texPack = null;
    this.pTexPack = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.lights = null;
    this.stalls = null;
    this.vendors = null;
    this.firstPerson = null;
    this.hitboxes = [];
    this.priceTags = [];
  }
}
