import * as THREE from 'three';

export interface MarketTexturePack {
  woodMap: THREE.CanvasTexture;
  woodNorm: THREE.CanvasTexture;
  woodRough: THREE.CanvasTexture;
  stoneMap: THREE.CanvasTexture;
  stoneNorm: THREE.CanvasTexture;
  stoneRough: THREE.CanvasTexture;
  roofMap: THREE.CanvasTexture;
  roofNorm: THREE.CanvasTexture;
  burlapMap: THREE.CanvasTexture;
  organicNorm: THREE.CanvasTexture;
  glowSprite: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d')! };
}

function wrapRepeat(tex: THREE.CanvasTexture, rx: number, ry: number) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(rx, ry);
  return tex;
}

export function createMarketTexturePack(): MarketTexturePack {
  const allTex: THREE.Texture[] = [];
  const reg = <T extends THREE.Texture>(t: T): T => {
    allTex.push(t);
    return t;
  };

  const wS = 256;
  const { c: wc, ctx: wctx } = makeCanvas(wS, wS);
  wctx.fillStyle = '#6B4223';
  wctx.fillRect(0, 0, wS, wS);
  for (let y = 0; y < wS; y++) {
    const grain = Math.sin(y * 0.25) * 12 + Math.sin(y * 0.06) * 20;
    const d = Math.sin((y + grain) * 0.14) * 0.16;
    wctx.fillStyle = d > 0 ? `rgba(38,18,6,${d})` : `rgba(145,92,48,${-d * 0.8})`;
    wctx.fillRect(0, y, wS, 1);
  }
  wctx.fillStyle = 'rgba(20,10,4,0.65)';
  for (let y = 0; y < wS; y += 64) wctx.fillRect(0, y, wS, 2);

  const { c: wnc, ctx: wnctx } = makeCanvas(wS, wS);
  const wImg = wnctx.createImageData(wS, wS);
  for (let y = 0; y < wS; y++) {
    const ny = Math.min(255, Math.max(0, Math.round(128 + Math.cos(y * 0.25) * 22)));
    for (let x = 0; x < wS; x++) {
      const idx = (y * wS + x) * 4;
      wImg.data[idx] = 128;
      wImg.data[idx + 1] = ny;
      wImg.data[idx + 2] = 246;
      wImg.data[idx + 3] = 255;
    }
  }
  wnctx.putImageData(wImg, 0, 0);

  const { c: wrc, ctx: wrctx } = makeCanvas(wS, wS);
  for (let y = 0; y < wS; y++) {
    const v = Math.round(175 + Math.sin(y * 0.22) * 45);
    wrctx.fillStyle = `rgb(${v},${v},${v})`;
    wrctx.fillRect(0, y, wS, 1);
  }

  const woodMap = reg(wrapRepeat(new THREE.CanvasTexture(wc), 1, 1));
  const woodNorm = reg(wrapRepeat(new THREE.CanvasTexture(wnc), 1, 1));
  const woodRough = reg(wrapRepeat(new THREE.CanvasTexture(wrc), 1, 1));

  const sS = 256;
  const { c: sc, ctx: sctx } = makeCanvas(sS, sS);
  sctx.fillStyle = '#4B4138';
  sctx.fillRect(0, 0, sS, sS);
  const bw = 32;
  const bh = 16;
  for (let y = 0; y < sS; y += bh) {
    const off = (Math.floor(y / bh) % 2) * (bw / 2);
    for (let x = -bw; x < sS + bw; x += bw) {
      const shade = 62 + ((Math.abs(x * 13 + y * 7) % 28));
      sctx.fillStyle = `rgb(${shade + 6},${shade},${shade - 5})`;
      sctx.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
    }
  }
  sctx.fillStyle = 'rgba(34, 85, 42, 0.32)';
  for (let i = 0; i < 18; i++) {
    const lx = (i * 53) % sS;
    const ly = (i * 89) % sS;
    sctx.fillRect(lx, ly, 4, 2);
  }

  const { c: snc, ctx: snctx } = makeCanvas(sS, sS);
  snctx.fillStyle = '#8080FF';
  snctx.fillRect(0, 0, sS, sS);
  for (let y = 0; y < sS; y += bh) {
    snctx.fillStyle = '#8056E2';
    snctx.fillRect(0, y, sS, 2);
    snctx.fillStyle = '#80AAFF';
    snctx.fillRect(0, y + 2, sS, 2);
  }

  const { c: src, ctx: srctx } = makeCanvas(sS, sS);
  srctx.fillStyle = '#C8C8C8';
  srctx.fillRect(0, 0, sS, sS);
  const puddle = srctx.createRadialGradient(sS / 2, sS / 2, 10, sS / 2, sS / 2, sS * 0.45);
  puddle.addColorStop(0, '#2C2C2C');
  puddle.addColorStop(0.55, '#6E6E6E');
  puddle.addColorStop(1, '#C8C8C8');
  srctx.fillStyle = puddle;
  srctx.fillRect(0, 0, sS, sS);

  const stoneMap = reg(wrapRepeat(new THREE.CanvasTexture(sc), 2, 18));
  const stoneNorm = reg(wrapRepeat(new THREE.CanvasTexture(snc), 2, 18));
  const stoneRough = reg(wrapRepeat(new THREE.CanvasTexture(src), 2, 18));

  const rS = 128;
  const { c: rc, ctx: rctx } = makeCanvas(rS, rS);
  const { c: rnc, ctx: rnctx } = makeCanvas(rS, rS);
  const rImg = rnctx.createImageData(rS, rS);
  for (let x = 0; x < rS; x++) {
    const wave = Math.sin((x / rS) * Math.PI * 12);
    const tone = Math.round(92 + wave * 28);
    rctx.fillStyle = `rgb(${tone},${tone + 2},${tone + 5})`;
    rctx.fillRect(x, 0, 1, rS);
    const nx = Math.min(255, Math.max(0, Math.round(128 + Math.cos((x / rS) * Math.PI * 12) * 58)));
    for (let y = 0; y < rS; y++) {
      const idx = (y * rS + x) * 4;
      rImg.data[idx] = nx;
      rImg.data[idx + 1] = 128;
      rImg.data[idx + 2] = 235;
      rImg.data[idx + 3] = 255;
    }
  }
  rnctx.putImageData(rImg, 0, 0);
  const roofMap = reg(wrapRepeat(new THREE.CanvasTexture(rc), 4, 24));
  const roofNorm = reg(wrapRepeat(new THREE.CanvasTexture(rnc), 4, 24));

  const { c: bc, ctx: bctx } = makeCanvas(128, 128);
  bctx.fillStyle = '#A67C52';
  bctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 4) {
    bctx.fillStyle = i % 8 === 0 ? 'rgba(60,38,18,0.28)' : 'rgba(220,190,145,0.18)';
    bctx.fillRect(i, 0, 2, 128);
    bctx.fillRect(0, i, 128, 2);
  }
  const burlapMap = reg(wrapRepeat(new THREE.CanvasTexture(bc), 2, 2));

  const { c: oc, ctx: octx } = makeCanvas(128, 128);
  const oImg = octx.createImageData(128, 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const idx = (y * 128 + x) * 4;
      const n = (Math.sin(x * 0.45) + Math.cos(y * 0.45)) * 14;
      oImg.data[idx] = Math.min(255, Math.max(0, 128 + n));
      oImg.data[idx + 1] = Math.min(255, Math.max(0, 128 + n));
      oImg.data[idx + 2] = 248;
      oImg.data[idx + 3] = 255;
    }
  }
  octx.putImageData(oImg, 0, 0);
  const organicNorm = reg(wrapRepeat(new THREE.CanvasTexture(oc), 1, 1));

  const { c: gc, ctx: gctx } = makeCanvas(128, 128);
  const gGrad = gctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  gGrad.addColorStop(0, 'rgba(255, 248, 210, 0.95)');
  gGrad.addColorStop(0.28, 'rgba(255, 212, 110, 0.52)');
  gGrad.addColorStop(0.65, 'rgba(255, 175, 65, 0.14)');
  gGrad.addColorStop(1, 'rgba(255, 160, 40, 0)');
  gctx.fillStyle = gGrad;
  gctx.fillRect(0, 0, 128, 128);
  const glowSprite = reg(new THREE.CanvasTexture(gc));

  return {
    woodMap, woodNorm, woodRough,
    stoneMap, stoneNorm, stoneRough,
    roofMap, roofNorm, burlapMap, organicNorm, glowSprite,
    dispose: () => allTex.forEach((t) => t.dispose()),
  };
}
