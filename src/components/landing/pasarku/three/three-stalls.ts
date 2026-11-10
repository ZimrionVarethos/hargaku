import * as THREE from 'three';
import { MarketTexturePack } from './three-pbr-textures';
import { ProduceTexturePack } from './three-produce-textures';
import { createInstancedMarketProduce } from './three-produce';
import { createMarketBanners } from './three-banners';

export interface ThreeStallCompartment {
  id: number;
  commodityId: number;
  name: string;
  label: string;
  priceText: string;
  unitText: string;
  category: string;
  zStart: number;
  zEnd: number;
  side: 'left' | 'right';
  produceType: string;
}

export interface StallHitboxMesh extends THREE.Mesh {
  userData: {
    compartmentId: number;
    commodityId: number;
    name: string;
  };
}

export interface StallPriceTagHandle {
  compartmentId: number;
  label: string;
  mesh: THREE.Mesh;
}

/**
 * Creates 3-tier stepped wooden stalls via InstancedMesh batching + organic produce + wall posters
 */
export function createMarketStalls(
  scene: THREE.Scene,
  isDark: boolean,
  compartments: ThreeStallCompartment[],
  tex: MarketTexturePack,
  pTex: ProduceTexturePack
): { stallsGroup: THREE.Group; hitboxes: StallHitboxMesh[]; priceTags: StallPriceTagHandle[] } {
  const stallsGroup = new THREE.Group();
  stallsGroup.name = 'market-stalls';
  const hitboxes: StallHitboxMesh[] = [];
  const priceTags: StallPriceTagHandle[] = [];

  const woodBaseMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x22160d : 0x5a3418,
    roughness: 0.82,
    metalness: 0.04,
    map: tex.woodMap,
    normalMap: tex.woodNorm,
    roughnessMap: tex.woodRough,
  });

  const woodPlankMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x2e1e12 : 0x6e4321,
    roughness: 0.68,
    metalness: 0.05,
    map: tex.woodMap,
    normalMap: tex.woodNorm,
  });

  const woodDividerMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x160e08 : 0x381f0d,
    roughness: 0.9,
    metalness: 0.02,
  });

  const unitGeo = new THREE.BoxGeometry(1, 1, 1);
  const riserInst = new THREE.InstancedMesh(unitGeo, woodBaseMat, compartments.length * 3);
  const topInst = new THREE.InstancedMesh(unitGeo, woodPlankMat, compartments.length * 3);
  const divInst = new THREE.InstancedMesh(unitGeo, woodDividerMat, compartments.length * 3);

  riserInst.castShadow = true;
  riserInst.receiveShadow = true;
  topInst.receiveShadow = true;
  divInst.castShadow = true;

  const dummy = new THREE.Object3D();
  let rIdx = 0;
  let tIdx = 0;
  let dIdx = 0;

  const tagGeo = new THREE.PlaneGeometry(0.36, 0.16);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const tierDefs = [
    { dirMult: 0.37, yHeight: 0.58, width: 0.36 },
    { dirMult: 0, yHeight: 0.82, width: 0.36 },
    { dirMult: -0.37, yHeight: 1.06, width: 0.36 },
  ];

  compartments.forEach((c) => {
    const isL = c.side === 'left';
    const depth = c.zEnd - c.zStart;
    const posZ = (c.zStart + c.zEnd) / 2;
    const dir = isL ? -1 : 1; // Visual left (+1.62) faces aisle center (-X)
    const benchCenterX = isL ? 1.62 : -1.62;

    tierDefs.forEach((tier, ti) => {
      const tx = benchCenterX + dir * tier.dirMult;

      dummy.position.set(tx, tier.yHeight / 2, posZ);
      dummy.scale.set(tier.width, tier.yHeight, depth);
      dummy.updateMatrix();
      riserInst.setMatrixAt(rIdx++, dummy.matrix);

      dummy.position.set(tx, tier.yHeight + 0.015, posZ);
      dummy.scale.set(tier.width + 0.02, 0.03, depth);
      dummy.updateMatrix();
      topInst.setMatrixAt(tIdx++, dummy.matrix);

      if (ti === 0) {
        dummy.position.set(tx + dir * 0.18, tier.yHeight * 0.35, posZ);
        dummy.scale.set(0.02, 0.018, depth);
        dummy.updateMatrix();
        divInst.setMatrixAt(dIdx++, dummy.matrix);

        dummy.position.set(tx + dir * 0.18, tier.yHeight * 0.7, posZ);
        dummy.scale.set(0.02, 0.018, depth);
        dummy.updateMatrix();
        divInst.setMatrixAt(dIdx++, dummy.matrix);
      }
    });

    // Compartment wooden divider partition
    dummy.position.set(benchCenterX, 0.58, posZ + depth / 2);
    dummy.scale.set(1.15, 1.15, 0.04);
    dummy.updateMatrix();
    divInst.setMatrixAt(dIdx++, dummy.matrix);

    // Front chalk price tag facing into the central aisle
    const priceTag = create3DPriceTag(c.label, c.priceText, tagGeo);
    priceTag.position.set(benchCenterX + dir * 0.57, 0.48, posZ);
    priceTag.rotation.y = isL ? -Math.PI / 2 : Math.PI / 2;
    stallsGroup.add(priceTag);
    priceTags.push({ compartmentId: c.id, label: c.label, mesh: priceTag });

    // Raycast Hitbox covering both produce counter & side banner cleanly without overlap
    const hitGeo = new THREE.BoxGeometry(1.6, 2.55, Math.max(0.5, depth - 0.16));
    const hitbox = new THREE.Mesh(hitGeo, hitMat);
    hitbox.position.set(isL ? 1.75 : -1.75, 1.25, posZ);
    hitbox.userData = { compartmentId: c.id, commodityId: c.commodityId, name: c.name };
    stallsGroup.add(hitbox);
    hitboxes.push(hitbox as unknown as StallHitboxMesh);
  });

  riserInst.instanceMatrix.needsUpdate = true;
  topInst.instanceMatrix.needsUpdate = true;
  divInst.instanceMatrix.needsUpdate = true;
  stallsGroup.add(riserInst, topInst, divInst);

  scene.add(stallsGroup);

  createInstancedMarketProduce(scene, compartments, tex, pTex);
  createMarketBanners(scene, isDark, compartments);

  return { stallsGroup, hitboxes, priceTags };
}

export function createPriceTagTexture(label: string, priceText: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 70;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#181f1b';
    ctx.fillRect(0, 0, 160, 70);
    ctx.strokeStyle = '#e2d8ce';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 156, 66);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Ubuntu, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 80, 27);

    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 22px Ubuntu, sans-serif';
    ctx.fillText(priceText, 80, 55);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function create3DPriceTag(
  label: string,
  priceText: string,
  tagGeo: THREE.PlaneGeometry
): THREE.Mesh {
  const texture = createPriceTagTexture(label, priceText);
  const tagMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 });
  return new THREE.Mesh(tagGeo, tagMat);
}
