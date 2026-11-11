import * as THREE from 'three';
import { createPriceTagTexture, StallPriceTagHandle, ThreeStallCompartment } from './three-stalls';
import { MarketTexturePack } from './three-pbr-textures';
import { ProduceTexturePack } from './three-produce-textures';

export function refreshPriceTagTextures(
  priceTags: StallPriceTagHandle[],
  compartments: ThreeStallCompartment[]
) {
  const byId = new Map(compartments.map((c) => [c.id, c]));
  for (const tag of priceTags) {
    const comp = byId.get(tag.compartmentId);
    if (!comp) continue;
    const mat = tag.mesh.material;
    if (mat instanceof THREE.MeshStandardMaterial) {
      if (mat.map) mat.map.dispose();
      mat.map = createPriceTagTexture(tag.label, comp.priceText);
      mat.needsUpdate = true;
    }
  }
}

export function disposeMarketCorridorScene(
  scene: THREE.Scene | null,
  renderer: THREE.WebGLRenderer | null,
  texPack: MarketTexturePack | null,
  pTexPack: ProduceTexturePack | null
) {
  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh || obj instanceof THREE.Sprite) {
        if ('geometry' in obj && obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else if (obj.material) obj.material.dispose();
      }
    });
  }
  texPack?.dispose();
  pTexPack?.dispose();
  renderer?.dispose();
  if (renderer?.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
}
