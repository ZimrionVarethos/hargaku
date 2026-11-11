import * as THREE from 'three';

export interface BannerCompartmentInfo {
  id: number;
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

const CATEGORY_PALETTE: Record<string, { header: string; accent: string; tag: string }> = {
  SAYURAN: { header: '#1B4332', accent: '#86EFAC', tag: 'SAYURAN' },
  BUMBU: { header: '#7F1D1D', accent: '#FCA5A5', tag: 'CABAI & BAWANG' },
  POKOK: { header: '#78350F', accent: '#FDE047', tag: 'BERAS & SEMBAKO' },
  DAGING: { header: '#881337', accent: '#FDA4AF', tag: 'DAGING & TELUR' },
  IKAN_BUAH: { header: '#0F4C5C', accent: '#67E8F9', tag: 'IKAN & BUAH' },
};

function getPalette(c: BannerCompartmentInfo) {
  if (c.produceType === 'bawang-merah' || c.produceType === 'bawang-putih' || c.produceType === 'cabe') {
    return CATEGORY_PALETTE.BUMBU;
  }
  if (c.produceType === 'ikan' || c.produceType === 'jeruk' || c.produceType === 'semangka') {
    return CATEGORY_PALETTE.IKAN_BUAH;
  }
  if (c.produceType === 'daging' || c.produceType === 'telur') {
    return CATEGORY_PALETTE.DAGING;
  }
  if (c.produceType === 'beras' || c.produceType === 'minyak' || c.produceType === 'gula') {
    return CATEGORY_PALETTE.POKOK;
  }
  return CATEGORY_PALETTE.SAYURAN;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, startPx: number, minPx = 14) {
  let size = startPx;
  while (size > minPx) {
    ctx.font = `bold ${size}px Ubuntu, sans-serif`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  ctx.font = `bold ${size}px Ubuntu, sans-serif`;
  return size;
}

function drawProduceGlyph(ctx: CanvasRenderingContext2D, type: string, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);
  if (type === 'tomat') {
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(0, 4, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(-5, -24, 10, 9);
  } else if (type === 'jeruk') {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 3, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#15803D';
    ctx.beginPath();
    ctx.ellipse(6, -21, 9, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'semangka') {
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.arc(0, 3, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#14532D';
    ctx.lineWidth = 4;
    for (let sx = -12; sx <= 12; sx += 12) {
      ctx.beginPath();
      ctx.moveTo(sx, -17);
      ctx.lineTo(sx, 23);
      ctx.stroke();
    }
  } else if (type === 'wortel') {
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.moveTo(-12, -16);
    ctx.lineTo(12, -16);
    ctx.lineTo(0, 26);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(-6, -26, 12, 10);
  } else if (type === 'bawang-merah' || type === 'bawang-putih') {
    ctx.fillStyle = type === 'bawang-merah' ? '#9F1239' : '#E7E5E4';
    ctx.beginPath();
    ctx.arc(-8, 6, 15, 0, Math.PI * 2);
    ctx.arc(10, 4, 14, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'cabe') {
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, -12);
    ctx.quadraticCurveTo(6, 4, 14, 20);
    ctx.stroke();
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, -12);
    ctx.lineTo(-18, -22);
    ctx.stroke();
  } else if (type === 'telur') {
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.ellipse(-9, 4, 11, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(10, 4, 11, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'ikan') {
    ctx.fillStyle = '#0F4C5C';
    ctx.beginPath();
    ctx.ellipse(-3, 0, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(29, -11);
    ctx.lineTo(24, 0);
    ctx.lineTo(29, 11);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-16, -2, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'daging') {
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.ellipse(0, 2, 24, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FCE7F3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.quadraticCurveTo(0, -6, 14, 5);
    ctx.stroke();
  } else if (type === 'minyak') {
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-11, -10, 22, 32);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(-6, -22, 12, 12);
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(-7, -26, 14, 5);
  } else if (type === 'kol' || type === 'sayur') {
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.arc(0, 2, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#B45309';
    ctx.fillRect(-16, -14, 32, 34);
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(-10, -4, 20, 12);
  }
  ctx.restore();
}

export function createBannerTexture(
  comp: BannerCompartmentInfo,
  w: number,
  h: number,
  isDark: boolean,
  compact: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const pal = getPalette(comp);

  ctx.fillStyle = isDark ? '#1A261F' : '#FCF7F0';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = isDark ? '#4E6B59' : '#132E20';
  ctx.lineWidth = compact ? 6 : 8;
  ctx.strokeRect(3, 3, w - 6, h - 6);

  const topH = Math.round(h * 0.27);
  ctx.fillStyle = pal.header;
  ctx.fillRect(6, 6, w - 12, topH);

  const headerText = `LAPAK #${String(comp.id).padStart(2, '0')} | ${pal.tag}`;
  fitFont(ctx, headerText, w - 32, Math.round(h * 0.13), 12);
  ctx.fillStyle = pal.accent;
  ctx.textAlign = 'left';
  ctx.fillText(headerText, 16, topH * 0.72);

  const iconX = compact ? Math.round(w * 0.18) : Math.round(w * 0.16);
  const iconY = Math.round(h * 0.64);
  const iconR = compact ? 30 : 48;
  ctx.fillStyle = isDark ? '#25382C' : '#EFE4D4';
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = pal.header;
  ctx.lineWidth = compact ? 2.5 : 3.5;
  ctx.stroke();

  ctx.save();
  ctx.translate(iconX, iconY);
  const glyphScale = compact ? 0.72 : 1.15;
  ctx.scale(glyphScale, glyphScale);
  drawProduceGlyph(ctx, comp.produceType, 0, 0);
  ctx.restore();

  const textX = compact ? Math.round(w * 0.34) : Math.round(w * 0.3);
  const maxTextW = w - textX - 20;
  const titleText = comp.name.toUpperCase();
  fitFont(ctx, titleText, maxTextW, Math.round(h * (compact ? 0.2 : 0.22)), 15);
  ctx.fillStyle = isDark ? '#F9F3EE' : '#132E20';
  ctx.fillText(titleText, textX, Math.round(h * 0.56));

  const subLabel = compact ? 'LAPAK KOMODITAS' : 'KLIK LAPAK UNTUK CEK HARGA TERKINI';
  fitFont(ctx, subLabel, maxTextW - 12, Math.round(h * 0.115), 11);
  ctx.fillStyle = isDark ? '#A7F3D0' : '#245034';
  ctx.fillText(subLabel, textX, Math.round(h * 0.77));

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
