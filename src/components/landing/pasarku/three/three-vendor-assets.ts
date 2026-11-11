import * as THREE from 'three';

export const VENDOR_SKIN_TONES = [0xc6865c, 0xb5734b, 0xa3613b, 0xd29972] as const;
export const VENDOR_SHIRT_PALETTE = [0xa92717, 0x245034, 0xe6d5b8, 0x132e20] as const;
export const VENDOR_APRON_PALETTE = [0x1f3a2c, 0xf3ead8, 0x7c2d12, 0x2c4237] as const;
export const VENDOR_KERUDUNG_PALETTE = [0xe6d5b8, 0x245034, 0xa92717, 0x132e20] as const;

export function vendorSeedHash(id: number, salt: number): number {
  const x = Math.sin(id * 91.3458 + salt * 47.531) * 43758.5453;
  return x - Math.floor(x);
}

function createBatikShirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = 'rgba(20, 14, 10, 0.16)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 64; y += 16) {
    for (let x = 0; x < 64; x += 16) {
      ctx.beginPath();
      ctx.arc(x + 8, y + 8, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(x + 7, y + 7, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

export interface VendorAssetPack {
  clothMat: THREE.MeshStandardMaterial;
  skinMat: THREE.MeshStandardMaterial;
  legsMat: THREE.MeshStandardMaterial;
  apronMat: THREE.MeshStandardMaterial;
  strawMat: THREE.MeshStandardMaterial;
  peciMat: THREE.MeshStandardMaterial;
  topiMat: THREE.MeshStandardMaterial;
  legsGeo: THREE.CylinderGeometry;
  torsoGeo: THREE.CapsuleGeometry;
  headGeo: THREE.SphereGeometry;
  armGeo: THREE.CapsuleGeometry;
  apronGeo: THREE.PlaneGeometry;
  capingGeo: THREE.ConeGeometry;
  kerudungGeo: THREE.SphereGeometry;
  kerudungDrapeGeo: THREE.CylinderGeometry;
  peciGeo: THREE.CylinderGeometry;
  topiCrownGeo: THREE.CylinderGeometry;
  topiVisorGeo: THREE.BoxGeometry;
  applyTheme: (isDark: boolean) => void;
  dispose: () => void;
}

export function createVendorAssetPack(isDark: boolean): VendorAssetPack {
  const batikTex = createBatikShirtTexture();
  const clothMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: batikTex,
    roughness: 0.78,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, metalness: 0.02 });
  const legsMat = new THREE.MeshStandardMaterial({ color: 0x1e2421, roughness: 0.88, metalness: 0.03 });
  const apronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const strawMat = new THREE.MeshStandardMaterial({ color: 0xc89d54, roughness: 0.88, metalness: 0.02 });
  const peciMat = new THREE.MeshStandardMaterial({ color: 0x161c18, roughness: 0.9, metalness: 0.04 });
  const topiMat = new THREE.MeshStandardMaterial({ color: 0x245034, roughness: 0.78, metalness: 0.04 });

  const allMaterials = [clothMat, skinMat, legsMat, apronMat, strawMat, peciMat, topiMat];
  const applyTheme = (dark: boolean) => {
    const emissiveHex = dark ? 0x2f190b : 0x000000;
    const emissiveInt = dark ? 0.46 : 0;
    for (const m of allMaterials) {
      m.emissive.setHex(emissiveHex);
      m.emissiveIntensity = emissiveInt;
    }
    legsMat.color.setHex(dark ? 0x181c1a : 0x232926);
    peciMat.color.setHex(dark ? 0x1a221d : 0x141916);
  };
  applyTheme(isDark);

  const legsGeo = new THREE.CylinderGeometry(0.11, 0.135, 0.72, 8, 1);
  const torsoGeo = new THREE.CapsuleGeometry(0.14, 0.34, 4, 8, 1);
  const headGeo = new THREE.SphereGeometry(0.105, 12, 8);
  const armGeo = new THREE.CapsuleGeometry(0.042, 0.28, 3, 6, 1);
  const apronGeo = new THREE.PlaneGeometry(0.24, 0.42);
  const capingGeo = new THREE.ConeGeometry(0.22, 0.085, 10, 1);
  const kerudungGeo = new THREE.SphereGeometry(0.114, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.46);
  const kerudungDrapeGeo = new THREE.CylinderGeometry(0.112, 0.138, 0.21, 12, 1, true, Math.PI * 0.36, Math.PI * 1.28);
  const peciGeo = new THREE.CylinderGeometry(0.104, 0.108, 0.088, 10, 1);
  const topiCrownGeo = new THREE.CylinderGeometry(0.106, 0.11, 0.07, 10, 1);
  const topiVisorGeo = new THREE.BoxGeometry(0.15, 0.014, 0.09);

  const allGeometries = [
    legsGeo, torsoGeo, headGeo, armGeo, apronGeo,
    capingGeo, kerudungGeo, kerudungDrapeGeo, peciGeo, topiCrownGeo, topiVisorGeo,
  ];

  return {
    clothMat, skinMat, legsMat, apronMat, strawMat, peciMat, topiMat,
    legsGeo, torsoGeo, headGeo, armGeo, apronGeo,
    capingGeo, kerudungGeo, kerudungDrapeGeo, peciGeo, topiCrownGeo, topiVisorGeo,
    applyTheme,
    dispose: () => {
      for (const g of allGeometries) g.dispose();
      for (const m of allMaterials) m.dispose();
      batikTex.dispose();
    },
  };
}
