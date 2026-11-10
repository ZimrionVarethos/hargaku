import * as THREE from 'three';

export interface ProduceTexturePack {
  fishTex: THREE.CanvasTexture;
  chiliTex: THREE.CanvasTexture;
  tomatoTex: THREE.CanvasTexture;
  carrotTex: THREE.CanvasTexture;
  shallotTex: THREE.CanvasTexture;
  garlicTex: THREE.CanvasTexture;
  cabbageTex: THREE.CanvasTexture;
  meatTex: THREE.CanvasTexture;
  moundTex: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d')! };
}

export function createProduceTexturePack(): ProduceTexturePack {
  const all: THREE.Texture[] = [];
  const reg = (c: HTMLCanvasElement, repeatX = 1, repeatY = 1) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    all.push(t);
    return t;
  };

  // 1. Ikan Kembung Texture (U: 0=tail -> 1=head, V: 0=belly -> 1=dorsal back)
  const { c: fc, ctx: fctx } = makeCanvas(128, 128);
  const fGrad = fctx.createLinearGradient(0, 0, 0, 128);
  fGrad.addColorStop(0.0, '#12344D'); // dark metallic blue dorsal
  fGrad.addColorStop(0.35, '#1D5E6B'); // teal sheen
  fGrad.addColorStop(0.55, '#CBD5E1'); // silver lateral line
  fGrad.addColorStop(1.0, '#F8FAFC'); // bright silver belly
  fctx.fillStyle = fGrad;
  fctx.fillRect(0, 0, 128, 128);

  // Mackerel vertical dorsal tiger stripes
  fctx.fillStyle = 'rgba(12, 26, 40, 0.42)';
  for (let x = 22; x < 92; x += 9) {
    fctx.fillRect(x, 6, 4, 42);
  }
  // Red gill crescent & clear glossy eye near head (U near 1 -> x ~ 98..120)
  fctx.strokeStyle = '#DC2626';
  fctx.lineWidth = 4;
  fctx.beginPath();
  fctx.arc(96, 68, 14, -0.8, 0.8);
  fctx.stroke();

  fctx.fillStyle = '#FFFFFF';
  fctx.beginPath();
  fctx.arc(110, 56, 7, 0, Math.PI * 2);
  fctx.fill();
  fctx.fillStyle = '#0F172A';
  fctx.beginPath();
  fctx.arc(111, 56, 4, 0, Math.PI * 2);
  fctx.fill();

  // 2. Chili Texture (V: 0=tip -> 0.82=red skin, 0.82..1=green stem & calyx)
  const { c: cc, ctx: cctx } = makeCanvas(64, 128);
  const cGrad = cctx.createLinearGradient(0, 0, 0, 128);
  cGrad.addColorStop(0.0, '#15803D'); // top green stem
  cGrad.addColorStop(0.16, '#16A34A');
  cGrad.addColorStop(0.22, '#DC2626'); // glossy red chili
  cGrad.addColorStop(1.0, '#991B1B');
  cctx.fillStyle = cGrad;
  cctx.fillRect(0, 0, 64, 128);
  cctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  cctx.fillRect(14, 28, 8, 96);

  // 3. Tomato Texture with top green calyx star
  const { c: tc, ctx: tctx } = makeCanvas(128, 128);
  const tGrad = tctx.createLinearGradient(0, 0, 0, 128);
  tGrad.addColorStop(0.0, '#DC2626');
  tGrad.addColorStop(0.75, '#EF4444');
  tGrad.addColorStop(1.0, '#EA580C');
  tctx.fillStyle = tGrad;
  tctx.fillRect(0, 0, 128, 128);
  tctx.fillStyle = '#15803D';
  tctx.fillRect(0, 0, 128, 16);

  // 4. Carrot Texture with horizontal root creases & top green crown
  const { c: crc, ctx: crctx } = makeCanvas(64, 128);
  crctx.fillStyle = '#EA580C';
  crctx.fillRect(0, 0, 64, 128);
  crctx.fillStyle = '#16A34A';
  crctx.fillRect(0, 0, 64, 14);
  crctx.fillStyle = 'rgba(124, 45, 18, 0.35)';
  for (let y = 24; y < 120; y += 14) crctx.fillRect(0, y, 64, 2);

  // 5. Shallot & Garlic Papery Striated Skin
  const { c: shc, ctx: shctx } = makeCanvas(64, 128);
  shctx.fillStyle = '#9F1239';
  shctx.fillRect(0, 0, 64, 128);
  for (let x = 0; x < 64; x += 6) {
    shctx.fillStyle = x % 12 === 0 ? 'rgba(255,220,235,0.2)' : 'rgba(60,5,25,0.25)';
    shctx.fillRect(x, 0, 3, 128);
  }
  shctx.fillStyle = '#78350F';
  shctx.fillRect(0, 114, 64, 14);

  const { c: gac, ctx: gactx } = makeCanvas(64, 128);
  gactx.fillStyle = '#F5F5F0';
  gactx.fillRect(0, 0, 64, 128);
  for (let x = 0; x < 64; x += 8) {
    gactx.fillStyle = 'rgba(180,170,150,0.35)';
    gactx.fillRect(x, 0, 2, 128);
  }

  // 6. Cabbage Leaf Veins
  const { c: cbc, ctx: cbctx } = makeCanvas(128, 128);
  cbctx.fillStyle = '#4ADE80';
  cbctx.fillRect(0, 0, 128, 128);
  cbctx.strokeStyle = '#DCFCE7';
  cbctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    cbctx.beginPath();
    cbctx.moveTo(i * 22, 128);
    cbctx.quadraticCurveTo(i * 22 + 12, 64, i * 22 - 4, 12);
    cbctx.stroke();
  }

  // 7. Marbled Beef Texture
  const { c: mc, ctx: mctx } = makeCanvas(128, 128);
  mctx.fillStyle = '#881337';
  mctx.fillRect(0, 0, 128, 128);
  mctx.strokeStyle = 'rgba(254, 242, 242, 0.72)';
  mctx.lineWidth = 2.5;
  for (let y = 12; y < 120; y += 16) {
    mctx.beginPath();
    mctx.moveTo(0, y);
    mctx.bezierCurveTo(42, y - 10, 86, y + 12, 128, y - 4);
    mctx.stroke();
  }

  // 8. Packed Produce Mound Base Texture (hides bare wood gaps naturally!)
  const { c: mndc, ctx: mndctx } = makeCanvas(128, 128);
  mndctx.fillStyle = '#D4D4D4';
  mndctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 90; i++) {
    const px = (i * 47) % 128;
    const py = (i * 73) % 128;
    const r = 6 + (i % 5) * 2;
    mndctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.22)';
    mndctx.beginPath();
    mndctx.arc(px, py, r, 0, Math.PI * 2);
    mndctx.fill();
  }

  return {
    fishTex: reg(fc),
    chiliTex: reg(cc),
    tomatoTex: reg(tc),
    carrotTex: reg(crc),
    shallotTex: reg(shc),
    garlicTex: reg(gac),
    cabbageTex: reg(cbc),
    meatTex: reg(mc),
    moundTex: reg(mndc, 2, 5),
    dispose: () => all.forEach((t) => t.dispose()),
  };
}

