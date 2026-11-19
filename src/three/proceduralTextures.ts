import * as THREE from 'three';

export interface BoxTextureSet {
  brandSideMap: THREE.CanvasTexture;
  qrBadgeMap: THREE.CanvasTexture;
  diffuserMap: THREE.CanvasTexture;
  hdpeBumpMap: THREE.CanvasTexture;
  absorbentPadMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function configureColorTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createBoxTextures(maxAnisotropy: number): BoxTextureSet {
  // 1. FreshLog side branding plate (accurate spelling FRESHLOG + leaf-truck emblem)
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 1024;
  brandCanvas.height = 768;
  const bctx = brandCanvas.getContext('2d')!;

  bctx.fillStyle = '#194309';
  bctx.fillRect(0, 0, 1024, 768);

  // Speed lines + leaf-truck vector emblem matching FreshLog identity
  bctx.save();
  bctx.translate(185, 110);

  // Speed trails
  bctx.fillStyle = '#b9fc12';
  const lines = [
    { x: 20, y: 78, w: 120, h: 10 },
    { x: 0, y: 118, w: 138, h: 11 },
    { x: 14, y: 158, w: 124, h: 10 },
    { x: 40, y: 196, w: 98, h: 9 },
  ];
  for (const l of lines) {
    bctx.beginPath();
    bctx.moveTo(l.x, l.y + l.h / 2);
    bctx.lineTo(l.x + l.w, l.y);
    bctx.lineTo(l.x + l.w, l.y + l.h);
    bctx.closePath();
    bctx.fill();
  }

  // Cargo leaf body
  bctx.strokeStyle = '#b9fc12';
  bctx.lineWidth = 14;
  bctx.lineJoin = 'round';
  bctx.beginPath();
  bctx.moveTo(158, 224);
  bctx.quadraticCurveTo(148, 86, 260, 48);
  bctx.lineTo(418, 30);
  bctx.lineTo(400, 224);
  bctx.closePath();
  bctx.stroke();

  // Filled inner leaf
  bctx.fillStyle = '#b9fc12';
  bctx.beginPath();
  bctx.moveTo(188, 204);
  bctx.quadraticCurveTo(192, 104, 368, 66);
  bctx.quadraticCurveTo(340, 198, 208, 212);
  bctx.closePath();
  bctx.fill();

  // Leaf central vein cutout
  bctx.strokeStyle = '#1d4c0b';
  bctx.lineWidth = 10;
  bctx.beginPath();
  bctx.moveTo(192, 208);
  bctx.quadraticCurveTo(256, 152, 336, 102);
  bctx.stroke();

  // Truck cab
  bctx.fillStyle = '#b9fc12';
  bctx.beginPath();
  bctx.moveTo(432, 66);
  bctx.lineTo(548, 76);
  bctx.lineTo(604, 150);
  bctx.lineTo(604, 224);
  bctx.lineTo(426, 224);
  bctx.closePath();
  bctx.fill();

  // Windshield cutout
  bctx.fillStyle = '#1d4c0b';
  bctx.beginPath();
  bctx.moveTo(454, 94);
  bctx.lineTo(536, 100);
  bctx.lineTo(576, 148);
  bctx.lineTo(454, 148);
  bctx.closePath();
  bctx.fill();

  // Grille accents
  bctx.fillRect(520, 174, 62, 12);
  bctx.fillRect(536, 196, 46, 10);
  bctx.restore();

  // FRESHLOG Wordmark (accurate spelling!)
  bctx.textAlign = 'center';
  bctx.fillStyle = '#f4fccf';
  bctx.font = '700 132px "Bricolage Grotesque", sans-serif';
  bctx.fillText('FRESH', 368, 490);
  bctx.fillStyle = '#b9fc12';
  bctx.font = '500 132px "Bricolage Grotesque", sans-serif';
  bctx.fillText('LOG', 710, 490);

  // Subtle divider
  bctx.fillStyle = 'rgba(185, 252, 18, 0.45)';
  bctx.fillRect(212, 530, 600, 4);

  // Line & model identifier
  bctx.fillStyle = '#f4fccf';
  bctx.font = '600 54px "Plus Jakarta Sans", sans-serif';
  bctx.fillText('FreshBerrys  ·  Caixa M', 512, 608);

  bctx.fillStyle = 'rgba(244, 252, 207, 0.72)';
  bctx.font = '500 32px "JetBrains Mono", monospace';
  bctx.fillText('60 × 50 × 35 cm   ·   < 5 °C / 12h', 512, 666);

  const brandSideMap = configureColorTexture(brandCanvas, maxAnisotropy);

  // 2. Top-Lid Recessed QR Code + ESP32 IoT Badge
  const qrCanvas = document.createElement('canvas');
  qrCanvas.width = 512;
  qrCanvas.height = 512;
  const qctx = qrCanvas.getContext('2d')!;

  qctx.fillStyle = '#b9fc12';
  qctx.fillRect(0, 0, 512, 512);

  qctx.fillStyle = '#f8faf4';
  qctx.fillRect(34, 34, 444, 384);

  // Deterministic high-contrast QR matrix
  const cell = 16;
  const originX = 88;
  const originY = 58;
  const grid = 21;

  const drawFinder = (gx: number, gy: number) => {
    qctx.fillStyle = '#142010';
    qctx.fillRect(originX + gx * cell, originY + gy * cell, 7 * cell, 7 * cell);
    qctx.fillStyle = '#f8faf4';
    qctx.fillRect(originX + (gx + 1) * cell, originY + (gy + 1) * cell, 5 * cell, 5 * cell);
    qctx.fillStyle = '#142010';
    qctx.fillRect(originX + (gx + 2) * cell, originY + (gy + 2) * cell, 3 * cell, 3 * cell);
  };
  drawFinder(0, 0);
  drawFinder(14, 0);
  drawFinder(0, 14);

  qctx.fillStyle = '#142010';
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const inFinder =
        (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (inFinder) continue;
      const hash = (x * 37 + y * 73 + x * y * 13) % 11;
      if (hash < 5) {
        qctx.fillRect(originX + x * cell, originY + y * cell, cell - 1, cell - 1);
      }
    }
  }

  // Bottom bar inside badge
  qctx.fillStyle = '#142010';
  qctx.font = '700 28px "JetBrains Mono", monospace';
  qctx.textAlign = 'center';
  qctx.fillText('CERTIFICADO QR · ESP32', 256, 466);

  const qrBadgeMap = configureColorTexture(qrCanvas, maxAnisotropy);

  // 3. Perforated Diffuser Plate texture
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = 512;
  diffCanvas.height = 512;
  const dctx = diffCanvas.getContext('2d')!;
  dctx.fillStyle = '#edf3df';
  dctx.fillRect(0, 0, 512, 512);

  // Border frame
  dctx.strokeStyle = '#c8d4b4';
  dctx.lineWidth = 22;
  dctx.strokeRect(11, 11, 490, 490);

  // Perforation grid
  dctx.fillStyle = '#4f6246';
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 14; col++) {
      const cx = 48 + col * 32;
      const cy = 48 + row * 38;
      dctx.beginPath();
      dctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      dctx.fill();
    }
  }

  const diffuserMap = configureColorTexture(diffCanvas, maxAnisotropy);

  // 4. Subtle HDPE rotomolded pebble micro-grain bump map (linear data map)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bmctx = bumpCanvas.getContext('2d')!;
  const imgData = bmctx.createImageData(256, 256);
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = 112 + Math.floor(rand() * 34);
    imgData.data[i] = v;
    imgData.data[i + 1] = v;
    imgData.data[i + 2] = v;
    imgData.data[i + 3] = 255;
  }
  bmctx.putImageData(imgData, 0, 0);
  const hdpeBumpMap = new THREE.CanvasTexture(bumpCanvas);
  hdpeBumpMap.wrapS = THREE.RepeatWrapping;
  hdpeBumpMap.wrapT = THREE.RepeatWrapping;
  hdpeBumpMap.repeat.set(5, 5);
  hdpeBumpMap.needsUpdate = true;

  // 5. Absorbent Pad (Manta Absorvente) fiber texture
  const padCanvas = document.createElement('canvas');
  padCanvas.width = 512;
  padCanvas.height = 512;
  const pctx = padCanvas.getContext('2d')!;
  pctx.fillStyle = '#b9bfba';
  pctx.fillRect(0, 0, 512, 512);
  pctx.strokeStyle = 'rgba(72, 82, 74, 0.22)';
  pctx.lineWidth = 2;
  for (let i = 0; i < 420; i++) {
    const x1 = rand() * 512;
    const y1 = rand() * 512;
    const angle = rand() * Math.PI * 2;
    const len = 14 + rand() * 28;
    pctx.beginPath();
    pctx.moveTo(x1, y1);
    pctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
    pctx.stroke();
  }
  // Quilted drainage channels pressed into pad
  pctx.strokeStyle = 'rgba(55, 65, 58, 0.25)';
  pctx.lineWidth = 4;
  for (let x = 64; x < 512; x += 64) {
    pctx.beginPath();
    pctx.moveTo(x, 24);
    pctx.lineTo(x, 488);
    pctx.stroke();
  }
  const absorbentPadMap = configureColorTexture(padCanvas, maxAnisotropy);

  // 6. Soft Studio Radial Contact Shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const sctx = shadowCanvas.getContext('2d')!;
  const grad = sctx.createRadialGradient(256, 256, 30, 256, 256, 240);
  grad.addColorStop(0, 'rgba(18, 34, 12, 0.42)');
  grad.addColorStop(0.55, 'rgba(18, 34, 12, 0.18)');
  grad.addColorStop(1, 'rgba(18, 34, 12, 0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 512, 512);
  const contactShadowMap = new THREE.CanvasTexture(shadowCanvas);
  contactShadowMap.needsUpdate = true;

  return {
    brandSideMap,
    qrBadgeMap,
    diffuserMap,
    hdpeBumpMap,
    absorbentPadMap,
    contactShadowMap,
    dispose: () => {
      brandSideMap.dispose();
      qrBadgeMap.dispose();
      diffuserMap.dispose();
      hdpeBumpMap.dispose();
      absorbentPadMap.dispose();
      contactShadowMap.dispose();
    },
  };
}
