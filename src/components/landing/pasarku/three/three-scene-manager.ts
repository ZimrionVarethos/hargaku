import * as THREE from 'three';
import { createMarketTexturePack, MarketTexturePack } from './three-pbr-textures';
import { createProduceTexturePack, ProduceTexturePack } from './three-produce-textures';
import { createMarketEnvironment, MarketEnvironmentRig } from './three-environment';
import {
  createMarketStalls,
  createPriceTagTexture,
  ThreeStallCompartment,
  StallHitboxMesh,
  StallPriceTagHandle,
} from './three-stalls';

export class ThreeMarketCorridorManager {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private texPack: MarketTexturePack | null = null;
  private pTexPack: ProduceTexturePack | null = null;
  private lights: MarketEnvironmentRig | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private hitboxes: StallHitboxMesh[] = [];
  private priceTags: StallPriceTagHandle[] = [];
  private corridorLength = 64;
  private animId: number | null = null;
  private isDisposed = false;
  private isDirty = true;
  private idleCounter = 0;
  private currentProgress = 0;
  private targetProgress = 0;

  private readonly renderLoop = () => {
    this.animId = null;
    if (this.isDisposed) return;

    const delta = this.targetProgress - this.currentProgress;
    if (Math.abs(delta) > 0.0001) {
      this.currentProgress += delta * 0.22;
      this.isDirty = true;
      this.idleCounter = 0;
    } else {
      this.currentProgress = this.targetProgress;
      this.idleCounter++;
      if (this.idleCounter > 10) this.isDirty = false;
    }

    if (this.isDirty && this.renderer && this.scene && this.camera) {
      this.applyCameraAndLights();
      this.renderer.render(this.scene, this.camera);
    }

    if (this.isDirty || Math.abs(this.targetProgress - this.currentProgress) > 0.0001) {
      this.scheduleFrame();
    }
  };

  private scheduleFrame() {
    if (this.isDisposed || this.animId !== null) return;
    this.animId = requestAnimationFrame(this.renderLoop);
  }

  public init(
    container: HTMLDivElement,
    isDark: boolean,
    compartments: ThreeStallCompartment[]
  ) {
    this.isDisposed = false;
    this.isDirty = true;
    this.currentProgress = 0;
    this.targetProgress = 0;

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 90);
    this.camera.position.set(0, 1.58, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
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
    const { hitboxes, priceTags } = createMarketStalls(
      this.scene,
      isDark,
      compartments,
      this.texPack,
      this.pTexPack
    );
    this.hitboxes = hitboxes;
    this.priceTags = priceTags;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  private applyCameraAndLights() {
    if (!this.camera) return;
    const curZ = this.currentProgress * (this.corridorLength - 4.0);
    const bobY = Math.sin(this.currentProgress * 32 * Math.PI) * 0.035;
    const bobX = Math.sin(this.currentProgress * 16 * Math.PI) * 0.025;

    this.camera.position.set(bobX, 1.58 + bobY, curZ);
    this.camera.lookAt(0, 1.52, curZ + 12);

    if (this.lights) {
      this.lights.nearLight.position.set(0, 2.5, curZ + 2.5);
      this.lights.aheadLight.position.set(0, 2.5, curZ + 11.5);
      this.lights.dirLight.position.set(4, 10, curZ + 6);
      this.lights.dirLight.target.position.set(0, 0, curZ + 10);
      this.lights.dirLight.target.updateMatrixWorld();
    }
  }

  public updateWalk(walkProgress: number) {
    this.targetProgress = Math.max(0, Math.min(1, walkProgress));
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public updatePriceTags(compartments: ThreeStallCompartment[]) {
    const byId = new Map(compartments.map((c) => [c.id, c]));
    for (const tag of this.priceTags) {
      const comp = byId.get(tag.compartmentId);
      if (!comp) continue;
      const mat = tag.mesh.material;
      if (mat instanceof THREE.MeshStandardMaterial) {
        if (mat.map) mat.map.dispose();
        mat.map = createPriceTagTexture(tag.label, comp.priceText);
        mat.needsUpdate = true;
      }
    }
    this.isDirty = true;
    this.idleCounter = 0;
    this.scheduleFrame();
  }

  public handleResize(width: number, height: number) {
    if (!this.camera || !this.renderer) return;
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
  ): { compartmentId: number; commodityId: number } | null {
    if (!this.camera || this.hitboxes.length === 0) return null;
    this.pointer.x = ((clientX - containerRect.left) / containerRect.width) * 2 - 1;
    this.pointer.y = -((clientY - containerRect.top) / containerRect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hitboxes);

    if (intersects.length > 0) {
      const hit = intersects[0].object as StallHitboxMesh;
      return {
        compartmentId: hit.userData.compartmentId,
        commodityId: hit.userData.commodityId,
      };
    }
    return null;
  }

  public destroy() {
    this.isDisposed = true;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else if (obj.material) obj.material.dispose();
        }
      });
    }
    if (this.texPack) {
      this.texPack.dispose();
      this.texPack = null;
    }
    if (this.pTexPack) {
      this.pTexPack.dispose();
      this.pTexPack = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
    this.lights = null;
    this.hitboxes = [];
    this.priceTags = [];
  }
}
