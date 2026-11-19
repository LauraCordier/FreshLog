import * as THREE from 'three';
import { createBoxTextures } from './proceduralTextures';
import type { ProductModelId } from '../utils/coldChainModel';

export interface ProductFamily3DHandle {
  root: THREE.Group;
  step: (
    opts: { frontDoorOpen: boolean; topLidOpen: boolean; co2Active: boolean },
    dt: number,
    isSoftwareGl: boolean,
  ) => boolean;
  cameras: {
    hero: { pos: [number, number, number]; target: [number, number, number] };
    front: { pos: [number, number, number]; target: [number, number, number] };
    side: { pos: [number, number, number]; target: [number, number, number] };
  };
  dispose: () => void;
}

function createFamilyBrandTexture(
  title: string,
  subtitle: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#194309';
  ctx.fillRect(0, 0, 512, 384);

  // Leaf-truck mark
  ctx.strokeStyle = '#b9fc12';
  ctx.fillStyle = '#b9fc12';
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (const [y, len] of [
    [92, 54],
    [118, 74],
    [144, 58],
  ]) {
    ctx.beginPath();
    ctx.moveTo(116 - len, y);
    ctx.lineTo(126, y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(148, 166);
  ctx.bezierCurveTo(140, 102, 198, 66, 276, 68);
  ctx.bezierCurveTo(270, 134, 218, 174, 148, 166);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(166, 152);
  ctx.quadraticCurveTo(212, 124, 254, 86);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(276, 68);
  ctx.lineTo(342, 92);
  ctx.lineTo(356, 148);
  ctx.lineTo(356, 168);
  ctx.lineTo(148, 168);
  ctx.stroke();

  ctx.fillStyle = '#b9fc12';
  ctx.font = '800 66px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FRESHLOG', 256, 246);

  ctx.fillStyle = '#f4fccf';
  ctx.font = '600 28px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(title, 256, 296);

  ctx.fillStyle = '#b9fc12';
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillText(subtitle, 256, 336);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  return tex;
}

function createSharedMaterials(
  productId: Exclude<ProductModelId, 'caixa-m'>,
  maxAnisotropy: number,
  isSoftwareGl: boolean,
) {
  const textures = createBoxTextures(maxAnisotropy);
  const brandMeta: Record<Exclude<ProductModelId, 'caixa-m'>, [string, string]> = {
    'caixa-p': ['FreshBerrys · Caixa P', '50 × 30 × 35 cm · < 5 °C'],
    'base-rodizios': ['FreshBerrys · Caixa M', 'Base c/ Rodízios · 36 kg'],
    'meio-palete': ['Meio Palete Isotérmico', '100 kg · 60 mm PU · < 5 °C'],
    'conteiner-palete': ['Contêiner de Palete PBR', '200 kg · 60 mm PU · < 5 °C'],
  };
  const [brandTitle, brandSub] = brandMeta[productId];
  const familyBrandMap = createFamilyBrandTexture(brandTitle, brandSub, maxAnisotropy);

  const hdpeMat = new THREE.MeshStandardMaterial({
    color: 0x184208,
    roughness: 0.62,
    metalness: 0.04,
    bumpMap: textures.hdpeBumpMap,
    bumpScale: 0.015,
  });

  const innerLinerMat = new THREE.MeshStandardMaterial({
    color: 0xf4fccf,
    roughness: 0.36,
    metalness: 0.02,
  });

  const limeMat = new THREE.MeshStandardMaterial({
    color: 0x9ce800,
    roughness: 0.36,
    metalness: 0.04,
  });

  const epdmMat = new THREE.MeshStandardMaterial({
    color: 0x1b2019,
    roughness: 0.9,
    metalness: 0.04,
  });

  const darkPocketMat = new THREE.MeshStandardMaterial({
    color: 0x122b07,
    roughness: 0.82,
    metalness: 0.04,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xcfd6cf,
    roughness: 0.24,
    metalness: 0.88,
  });

  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0x8fd2f4,
    roughness: 0.16,
    metalness: 0.02,
    transmission: isSoftwareGl ? 0 : 0.4,
    transparent: true,
    opacity: isSoftwareGl ? 0.78 : 0.9,
    clearcoat: 0.75,
  });

  const shelfMat = new THREE.MeshStandardMaterial({
    color: 0xdce4d7,
    roughness: 0.4,
    metalness: 0.3,
  });

  const crateMat = new THREE.MeshStandardMaterial({
    color: 0x224c12,
    roughness: 0.58,
    metalness: 0.05,
  });

  const berryRedMat = new THREE.MeshStandardMaterial({
    color: 0xcf2430,
    roughness: 0.3,
    metalness: 0.02,
  });

  const berryBlueMat = new THREE.MeshStandardMaterial({
    color: 0x2c3f73,
    roughness: 0.46,
    metalness: 0.04,
  });

  const padMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.absorbentPadMap,
    roughness: 0.94,
    metalness: 0.0,
  });

  const brandMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: familyBrandMap,
    roughness: 0.58,
    metalness: 0.04,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const qrMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.qrBadgeMap,
    roughness: 0.35,
    metalness: 0.05,
  });

  const co2AuraMat = new THREE.MeshBasicMaterial({
    color: 0xb9fc12,
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const shadowMat = new THREE.MeshBasicMaterial({
    map: textures.contactShadowMap,
    transparent: true,
    depthWrite: false,
    opacity: 0.88,
  });

  return {
    textures: {
      dispose: () => {
        textures.dispose();
        familyBrandMap.dispose();
      },
    },
    hdpeMat,
    innerLinerMat,
    limeMat,
    epdmMat,
    darkPocketMat,
    metalMat,
    iceMat,
    shelfMat,
    crateMat,
    berryRedMat,
    berryBlueMat,
    padMat,
    brandMat,
    qrMat,
    co2AuraMat,
    shadowMat,
  };
}

function disposeGroup(root: THREE.Group, textures: { dispose: () => void }) {
  textures.dispose();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
}

function createCompactClamshell(
  w: number,
  h: number,
  d: number,
  berryMat: THREE.Material,
  shelfMat: THREE.Material,
): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.45, d), shelfMat);
  base.position.y = h * 0.22;
  g.add(base);

  const berryCluster = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.86, h * 0.52, d * 0.86),
    berryMat,
  );
  berryCluster.position.y = h * 0.62;
  g.add(berryCluster);
  return g;
}

function createEmbrapaCrate(
  w: number,
  h: number,
  d: number,
  crateMat: THREE.Material,
  berryMat: THREE.Material,
  shelfMat: THREE.Material,
): THREE.Group {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), crateMat);
  shell.position.y = h / 2;
  shell.castShadow = true;
  g.add(shell);

  const rim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, 0.06, d + 0.04), shelfMat);
  rim.position.y = h;
  g.add(rim);

  const berries = new THREE.Mesh(new THREE.BoxGeometry(w * 0.88, 0.16, d * 0.84), berryMat);
  berries.position.y = h + 0.04;
  g.add(berries);
  return g;
}

/**
 * Builds interactive 3D assemblies for Caixa P, Base com Rodízios, Meio Palete, and Contêiner de Palete.
 * All models feature consistent lateral-opening front doors matching the studio renders.
 */
export function createProductFamily3D(
  productId: Exclude<ProductModelId, 'caixa-m'>,
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): ProductFamily3DHandle {
  const m = createSharedMaterials(productId, maxAnisotropy, isSoftwareGl);
  const root = new THREE.Group();

  // =========================================================================
  // 1. CAIXA P — ENTREGA FINAL (50 × 30 × 35 cm)
  // =========================================================================
  if (productId === 'caixa-p') {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 6.2), m.shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.008;
    root.add(shadow);

    // Dimensions: 5.0 wide (50cm) x 3.5 tall (35cm) x 3.0 deep (30cm)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.34, 3.0), m.hdpeMat);
    floor.position.y = 0.2;
    floor.castShadow = true;
    root.add(floor);

    const floorInner = new THREE.Mesh(new THREE.BoxGeometry(4.24, 0.05, 2.24), m.innerLinerMat);
    floorInner.position.y = 0.39;
    root.add(floorInner);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.08, 2.0), m.padMat);
    pad.position.y = 0.45;
    root.add(pad);

    // Back, left, right walls
    const back = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.55, 0.34), m.hdpeMat);
    back.position.set(0, 1.62, -1.33);
    back.castShadow = true;
    root.add(back);

    const backIn = new THREE.Mesh(new THREE.BoxGeometry(4.26, 2.42, 0.06), m.innerLinerMat);
    backIn.position.set(0, 1.62, -1.14);
    root.add(backIn);

    for (const side of [-1, 1]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.55, 2.66), m.hdpeMat);
      wall.position.set(side * 2.33, 1.62, 0);
      wall.castShadow = true;
      root.add(wall);

      const inner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.42, 2.26), m.innerLinerMat);
      inner.position.set(side * 2.14, 1.62, 0);
      root.add(inner);
    }

    // Left brand decal
    const brand = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.32), m.brandMat);
    brand.position.set(-2.51, 1.35, 0);
    brand.rotation.y = -Math.PI / 2;
    root.add(brand);

    // Front EPDM gasket frame
    const epdmTop = new THREE.Mesh(new THREE.BoxGeometry(4.36, 0.06, 0.06), m.epdmMat);
    epdmTop.position.set(0, 2.8, 1.48);
    const epdmBot = new THREE.Mesh(new THREE.BoxGeometry(4.36, 0.06, 0.06), m.epdmMat);
    epdmBot.position.set(0, 0.42, 1.48);
    root.add(epdmTop, epdmBot);

    // 2 shelves with clamshells
    for (const [sy, mat] of [
      [0.82, m.berryRedMat],
      [1.56, m.berryBlueMat],
    ] as const) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.06, 2.05), m.shelfMat);
      shelf.position.set(0, sy, 0);
      root.add(shelf);
      for (const cx of [-1.2, 0, 1.2]) {
        const clam = createCompactClamshell(1.0, 0.44, 1.55, mat, m.shelfMat);
        clam.position.set(cx, sy + 0.03, 0);
        root.add(clam);
      }
    }

    // Diffuser + 2x1kg ice cartridges in top plenum
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(4.18, 0.07, 2.12), m.shelfMat);
    diffuser.position.set(0, 2.22, 0);
    root.add(diffuser);
    for (const ix of [-0.95, 0.95]) {
      const ice = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.36, 1.85), m.iceMat);
      ice.position.set(ix, 2.48, 0);
      root.add(ice);
    }

    const co2Aura = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.5, 2.0), m.co2AuraMat);
    co2Aura.position.set(0, 1.42, 0);
    root.add(co2Aura);

    // Lateral-opening Front Door (hinged on right, 2 lime latches on left)
    const frontDoorPivot = new THREE.Group();
    frontDoorPivot.position.set(2.16, 1.62, 1.5);
    root.add(frontDoorPivot);

    for (const hy of [-0.68, 0.68]) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 10), m.metalMat);
      hinge.position.set(0.04, hy, 0.02);
      frontDoorPivot.add(hinge);
    }

    const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(4.36, 2.38, 0.24), m.hdpeMat);
    doorSlab.position.set(-2.16, 0, 0.1);
    doorSlab.castShadow = true;
    frontDoorPivot.add(doorSlab);

    const doorIn = new THREE.Mesh(new THREE.BoxGeometry(4.08, 2.1, 0.06), m.innerLinerMat);
    doorIn.position.set(-2.16, 0, -0.02);
    frontDoorPivot.add(doorIn);

    const doorGrip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.64, 0.08), m.limeMat);
    doorGrip.position.set(-3.9, 0, 0.24);
    frontDoorPivot.add(doorGrip);

    for (const ly of [1.14, 2.08]) {
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.2, 0.14), m.limeMat);
      latch.position.set(-2.22, ly, 1.62);
      root.add(latch);
    }

    // Hinged Top Lid with bright lime carrying handle + 4 L-lugs + QR badge
    const topLidPivot = new THREE.Group();
    topLidPivot.position.set(0, 2.94, -1.5);
    root.add(topLidPivot);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(5.06, 0.48, 3.06), m.hdpeMat);
    lid.position.set(0, 0.26, 1.5);
    lid.castShadow = true;
    topLidPivot.add(lid);

    // Prominent lime top carry handle (characteristic of Caixa P for moto/hand delivery)
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 0.24), m.limeMat);
    handleBar.position.set(0, 0.72, 1.5);
    topLidPivot.add(handleBar);
    for (const hx of [-0.78, 0.78]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.24), m.limeMat);
      post.position.set(hx, 0.58, 1.5);
      topLidPivot.add(post);
    }

    const qr = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.05, 0.74), m.qrMat);
    qr.position.set(1.75, 0.51, 0.85);
    topLidPivot.add(qr);

    let doorAngle = 0;
    let lidAngle = 0;

    return {
      root,
      step: (opts, dt, isSw) => {
        const lambda = isSw ? 14 : 9;
        let moving = false;
        const tgtDoor = opts.frontDoorOpen ? Math.PI * 0.58 : 0;
        const tgtLid = opts.topLidOpen ? -Math.PI * 0.42 : 0;
        doorAngle = THREE.MathUtils.damp(doorAngle, tgtDoor, lambda, dt);
        lidAngle = THREE.MathUtils.damp(lidAngle, tgtLid, lambda, dt);
        if (Math.abs(doorAngle - tgtDoor) > 0.005 || Math.abs(lidAngle - tgtLid) > 0.005) {
          moving = true;
        }
        frontDoorPivot.rotation.y = doorAngle;
        topLidPivot.rotation.x = lidAngle;
        co2Aura.visible = opts.co2Active;
        return moving;
      },
      cameras: {
        hero: { pos: [-7.2, 5.2, 8.2], target: [0, 1.4, 0] },
        front: { pos: [0.3, 2.5, 9.0], target: [0, 1.4, 0.2] },
        side: { pos: [-8.2, 2.8, 1.8], target: [0, 1.4, 0] },
      },
      dispose: () => disposeGroup(root, m.textures),
    };
  }

  // =========================================================================
  // 2. BASE COM RODÍZIOS + 4 CAIXAS M (60 × 100 × 15 cm)
  // =========================================================================
  if (productId === 'base-rodizios') {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 9.2), m.shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.008;
    root.add(shadow);

    // Rolling Dolly Deck (scaled nicely: X = 7.4 [100cm], Z = 4.6 [60cm], height = 1.05 [15cm])
    const deckY = 0.72;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.36, 4.7), m.hdpeMat);
    deck.position.y = deckY;
    deck.castShadow = true;
    deck.receiveShadow = true;
    root.add(deck);

    // Corner L-lip retainers on dolly deck
    for (const [cx, cz] of [
      [-3.68, 2.22],
      [3.68, 2.22],
      [-3.68, -2.22],
      [3.68, -2.22],
    ]) {
      const stop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.28), m.limeMat);
      stop.position.set(cx, deckY + 0.24, cz);
      root.add(stop);
    }

    // 4 Heavy-Duty Industrial Casters (2 front locking with #b9fc12 brake pedals)
    const wheelPositions: Array<[number, number, boolean]> = [
      [-2.95, 1.65, true],
      [2.95, 1.65, true],
      [-2.95, -1.65, false],
      [2.95, -1.65, false],
    ];
    for (const [wx, wz, hasBrake] of wheelPositions) {
      const caster = new THREE.Group();
      caster.position.set(wx, 0, wz);

      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), m.metalMat);
      plate.position.y = 0.54;
      caster.add(plate);

      const fork = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.42), m.metalMat);
      fork.position.y = 0.34;
      caster.add(fork);

      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.18, 16), m.epdmMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.y = 0.25;
      caster.add(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 12), m.limeMat);
      hub.rotation.x = Math.PI / 2;
      hub.position.y = 0.25;
      caster.add(hub);

      if (hasBrake) {
        const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.34), m.limeMat);
        pedal.position.set(0, 0.38, 0.32);
        pedal.rotation.x = 0.35;
        caster.add(pedal);
      }
      root.add(caster);
    }

    // 4 Interlocked Caixa M Units on the dolly (2 columns x 2 stacked high = ~36 kg)
    // Scale Caixa M slightly (3.55 wide x 2.15 tall x 4.2 deep) to sit 2 side-by-side on the 7.6 x 4.7 deck
    const boxW = 3.52;
    const boxH = 2.12;
    const boxD = 4.18;

    let interactiveDoorPivot: THREE.Group | null = null;
    const co2Auras: THREE.Mesh[] = [];

    const stackCoords: Array<[number, number, boolean]> = [
      [-1.82, deckY + 0.18, true], // Front-left bottom box has articulated lateral door!
      [1.82, deckY + 0.18, false],
      [-1.82, deckY + 0.18 + boxH + 0.04, false],
      [1.82, deckY + 0.18 + boxH + 0.04, false],
    ];

    for (const [bx, by, isInteractive] of stackCoords) {
      const boxG = new THREE.Group();
      boxG.position.set(bx, by, 0);

      if (isInteractive) {
        // Hollow shell so opening the lateral door reveals berries right on the dolly
        const back = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH - 0.32, 0.26), m.hdpeMat);
        back.position.set(0, (boxH - 0.32) / 2, -boxD / 2 + 0.13);
        boxG.add(back);

        const bottom = new THREE.Mesh(new THREE.BoxGeometry(boxW, 0.24, boxD), m.hdpeMat);
        bottom.position.set(0, 0.12, 0);
        boxG.add(bottom);

        for (const s of [-1, 1]) {
          const sw = new THREE.Mesh(new THREE.BoxGeometry(0.26, boxH - 0.32, boxD), m.hdpeMat);
          sw.position.set(s * (boxW / 2 - 0.13), (boxH - 0.32) / 2, 0);
          boxG.add(sw);
        }

        const innerBack = new THREE.Mesh(
          new THREE.BoxGeometry(boxW - 0.56, boxH - 0.48, 0.05),
          m.innerLinerMat,
        );
        innerBack.position.set(0, (boxH - 0.32) / 2, -boxD / 2 + 0.29);
        boxG.add(innerBack);

        // Berry trays inside
        for (const [ty, bm] of [
          [0.42, m.berryRedMat],
          [1.06, m.berryBlueMat],
        ] as const) {
          const tray = new THREE.Mesh(new THREE.BoxGeometry(boxW - 0.65, 0.05, boxD - 0.7), m.shelfMat);
          tray.position.set(0, ty, 0);
          boxG.add(tray);
          const clamL = createCompactClamshell(1.1, 0.38, 1.5, bm, m.shelfMat);
          clamL.position.set(-0.68, ty + 0.03, 0.45);
          const clamR = createCompactClamshell(1.1, 0.38, 1.5, m.berryRedMat, m.shelfMat);
          clamR.position.set(0.68, ty + 0.03, 0.45);
          boxG.add(clamL, clamR);
        }

        const aura = new THREE.Mesh(
          new THREE.BoxGeometry(boxW - 0.7, 1.3, boxD - 0.8),
          m.co2AuraMat,
        );
        aura.position.set(0, 0.95, 0);
        boxG.add(aura);
        co2Auras.push(aura);

        // Lateral-opening door hinged on right edge
        const pivot = new THREE.Group();
        pivot.position.set(boxW / 2 - 0.24, (boxH - 0.32) / 2, boxD / 2);
        boxG.add(pivot);

        const door = new THREE.Mesh(new THREE.BoxGeometry(boxW - 0.48, boxH - 0.44, 0.18), m.hdpeMat);
        door.position.set(-(boxW - 0.48) / 2, 0, 0.08);
        pivot.add(door);

        const frontDecal = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 1.32), m.brandMat);
        frontDecal.position.set(-(boxW - 0.48) / 2, 0, 0.176);
        pivot.add(frontDecal);

        const doorIn = new THREE.Mesh(
          new THREE.BoxGeometry(boxW - 0.64, boxH - 0.6, 0.04),
          m.innerLinerMat,
        );
        doorIn.position.set(-(boxW - 0.48) / 2, 0, -0.02);
        pivot.add(doorIn);

        interactiveDoorPivot = pivot;
      } else {
        const body = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH - 0.32, boxD), m.hdpeMat);
        body.position.y = (boxH - 0.32) / 2;
        body.castShadow = true;
        boxG.add(body);

        // Front lateral door panel + FreshLog logo on all remaining stacked boxes
        const frontDoorPanel = new THREE.Mesh(
          new THREE.BoxGeometry(boxW - 0.56, boxH - 0.54, 0.08),
          m.hdpeMat,
        );
        frontDoorPanel.position.set(0, (boxH - 0.32) / 2, boxD / 2 + 0.02);
        boxG.add(frontDoorPanel);

        const frontDecal = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 1.32), m.brandMat);
        frontDecal.position.set(0, (boxH - 0.32) / 2, boxD / 2 + 0.066);
        boxG.add(frontDecal);
      }

      // Lid & EPDM seam
      const seam = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.03, 0.06, boxD + 0.03), m.epdmMat);
      seam.position.y = boxH - 0.32;
      boxG.add(seam);

      const lid = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.06, 0.32, boxD + 0.06), m.hdpeMat);
      lid.position.y = boxH - 0.14;
      lid.castShadow = true;
      boxG.add(lid);

      // Front compression latches (#b9fc12)
      for (const ly of [0.58, 1.28]) {
        const latch = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.12), m.limeMat);
        latch.position.set(-boxW / 2 + 0.26, ly, boxD / 2 + 0.08);
        boxG.add(latch);
      }

      // Side brand decals on BOTH outer-left and outer-right boxes
      if (bx < 0) {
        const decalL = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.3), m.brandMat);
        decalL.position.set(-boxW / 2 - 0.015, 0.9, 0);
        decalL.rotation.y = -Math.PI / 2;
        boxG.add(decalL);
      } else {
        const decalR = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.3), m.brandMat);
        decalR.position.set(boxW / 2 + 0.015, 0.9, 0);
        decalR.rotation.y = Math.PI / 2;
        boxG.add(decalR);
      }

      root.add(boxG);
    }

    // 2 Sturdy U-Shaped Side Retaining & Push Handles (left & right ends cradling the 4 Caixa M boxes)
    const handleHeight = boxH * 2 + 0.58; // Rises slightly above top of 2-high stack for ergonomic pushing & box retention
    const handleTopY = deckY + 0.16 + handleHeight;
    const handlePostZ = 1.68; // Spans the front-to-back side depth without blocking the center FRESHLOG side logos

    for (const side of [-1, 1] as const) {
      const handleX = side * 3.74;
      const handleGroup = new THREE.Group();

      // Reinforced mounting brackets bolted into the dolly deck edge
      for (const pz of [-handlePostZ, handlePostZ]) {
        const mount = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.34), m.epdmMat);
        mount.position.set(handleX - side * 0.04, deckY + 0.24, pz);
        handleGroup.add(mount);

        // Vertical structural steel/HDPE upright tube
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, handleHeight, 14),
          m.hdpeMat,
        );
        post.position.set(handleX, deckY + 0.16 + handleHeight / 2, pz);
        post.castShadow = true;
        handleGroup.add(post);

        // Rounded corner elbow cap joining upright to top lime bar
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.125, 12, 12), m.epdmMat);
        elbow.position.set(handleX, handleTopY, pz);
        handleGroup.add(elbow);
      }

      // Lower & upper side containment rails keeping stacked boxes locked laterally without covering the side logo
      for (const railY of [deckY + 0.42, deckY + boxH + 0.18]) {
        const sideRail = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.065, handlePostZ * 2, 12),
          m.epdmMat,
        );
        sideRail.rotation.x = Math.PI / 2;
        sideRail.position.set(handleX - side * 0.02, railY, 0);
        handleGroup.add(sideRail);
      }

      // Ergonomic High-Visibility Lime (#b9fc12) Top Grip Bar
      const topGripBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, handlePostZ * 2 - 0.16, 16),
        m.limeMat,
      );
      topGripBar.rotation.x = Math.PI / 2;
      topGripBar.position.set(handleX, handleTopY, 0);
      topGripBar.castShadow = true;
      handleGroup.add(topGripBar);

      root.add(handleGroup);
    }

    let doorAngle = 0;

    return {
      root,
      step: (opts, dt, isSw) => {
        const lambda = isSw ? 26 : 10;
        const tgt = opts.frontDoorOpen ? Math.PI * 0.56 : 0;
        doorAngle = THREE.MathUtils.damp(doorAngle, tgt, lambda, dt);
        if (Math.abs(doorAngle - tgt) < 0.012) doorAngle = tgt;
        if (interactiveDoorPivot) {
          interactiveDoorPivot.rotation.y = doorAngle;
        }
        for (const a of co2Auras) a.visible = opts.co2Active;
        return Math.abs(doorAngle - tgt) > 0.005;
      },
      cameras: {
        hero: { pos: [-10.5, 6.8, 12.0], target: [0, 2.5, 0] },
        front: { pos: [-0.8, 3.0, 12.6], target: [-0.4, 2.2, 0] },
        side: { pos: [-12.2, 3.6, 2.4], target: [0, 2.4, 0] },
      },
      dispose: () => disposeGroup(root, m.textures),
    };
  }

  // =========================================================================
  // 3. MEIO PALETE ISOTÉRMICO (~1,32 × 0,62 × 1,75 m — 100 kg / 8 caixas)
  // =========================================================================
  if (productId === 'meio-palete') {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 8.5), m.shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.008;
    root.add(shadow);

    // Tall insulated cabinet: W = 3.2 (0.62–0.75m front face), D = 4.4 (1.32m), H = 6.8 (1.75m)
    const W = 3.4;
    const D = 4.5;
    const H = 6.5;
    const baseH = 0.65;

    // Pallet-jack dark HDPE base with 2 forklift slots
    const baseTop = new THREE.Mesh(new THREE.BoxGeometry(W + 0.16, 0.22, D + 0.16), m.epdmMat);
    baseTop.position.y = baseH - 0.11;
    baseTop.castShadow = true;
    root.add(baseTop);
    for (const bx of [-W / 2 + 0.28, 0, W / 2 - 0.28]) {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(0.46, baseH - 0.18, D + 0.12), m.epdmMat);
      runner.position.set(bx, (baseH - 0.18) / 2, 0);
      root.add(runner);
    }

    // Insulated 60mm PU walls (back, left, right, roof)
    const cabH = H - baseH;
    const midY = baseH + cabH / 2;

    const back = new THREE.Mesh(new THREE.BoxGeometry(W, cabH, 0.34), m.hdpeMat);
    back.position.set(0, midY, -D / 2 + 0.17);
    back.castShadow = true;
    root.add(back);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.08, 0.38, D + 0.08), m.hdpeMat);
    roof.position.set(0, H + 0.1, 0);
    roof.castShadow = true;
    root.add(roof);

    for (const s of [-1, 1]) {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(0.34, cabH, D), m.hdpeMat);
      sw.position.set(s * (W / 2 - 0.17), midY, 0);
      sw.castShadow = true;
      root.add(sw);

      const liner = new THREE.Mesh(new THREE.BoxGeometry(0.06, cabH - 0.3, D - 0.5), m.innerLinerMat);
      liner.position.set(s * (W / 2 - 0.37), midY, 0);
      root.add(liner);

      // Collapsible wall seam line
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, D - 0.2), m.epdmMat);
      seam.position.set(s * (W / 2 + 0.01), baseH + 0.22, 0);
      root.add(seam);
    }

    // Branding decal on left side wall
    const brand = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9), m.brandMat);
    brand.position.set(-W / 2 - 0.02, midY, 0);
    brand.rotation.y = -Math.PI / 2;
    root.add(brand);

    // Side CO2 cylinder injection valve + ESP32 box
    const co2Port = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 14), m.metalMat);
    co2Port.rotation.z = Math.PI / 2;
    co2Port.position.set(W / 2 + 0.08, H - 0.8, 0.9);
    root.add(co2Port);

    const co2Collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 14), m.limeMat);
    co2Collar.rotation.z = Math.PI / 2;
    co2Collar.position.set(W / 2 + 0.02, H - 0.8, 0.9);
    root.add(co2Collar);

    // Flush QR badge mounted flat on top roof panel (never protruding above roofline)
    const qr = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.05, 0.84), m.qrMat);
    qr.position.set(-W / 2 + 0.82, H + 0.31, D / 2 - 0.82);
    root.add(qr);

    // Ceiling ice plates (~15 kg PCM)
    const ceilingIce = new THREE.Mesh(new THREE.BoxGeometry(W - 0.85, 0.34, D - 0.9), m.iceMat);
    ceilingIce.position.set(0, H - 0.32, 0);
    root.add(ceilingIce);

    // 8 Embrapa Berry Crates inside (2 deep x 4 high)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 2; col++) {
        const bm = (row + col) % 2 === 0 ? m.berryRedMat : m.berryBlueMat;
        const crate = createEmbrapaCrate(W - 0.96, 1.02, 1.72, m.crateMat, bm, m.shelfMat);
        crate.position.set(0, baseH + 0.16 + row * 1.24, -0.95 + col * 1.9);
        root.add(crate);
      }
    }

    const co2Aura = new THREE.Mesh(new THREE.BoxGeometry(W - 0.9, cabH - 0.9, D - 0.9), m.co2AuraMat);
    co2Aura.position.set(0, midY - 0.1, 0);
    root.add(co2Aura);

    // Full-height Lateral-Opening Front Door (hinged on right, 3 lime latches on left)
    const frontDoorPivot = new THREE.Group();
    frontDoorPivot.position.set(W / 2 - 0.14, midY, D / 2);
    root.add(frontDoorPivot);

    for (const hy of [-2.0, 0, 2.0]) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12), m.metalMat);
      hinge.position.set(0.08, hy, 0.04);
      frontDoorPivot.add(hinge);
    }

    const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(W - 0.24, cabH - 0.16, 0.26), m.hdpeMat);
    doorSlab.position.set(-(W - 0.24) / 2, 0, 0.12);
    doorSlab.castShadow = true;
    frontDoorPivot.add(doorSlab);

    const doorIn = new THREE.Mesh(
      new THREE.BoxGeometry(W - 0.56, cabH - 0.46, 0.06),
      m.innerLinerMat,
    );
    doorIn.position.set(-(W - 0.24) / 2, 0, -0.02);
    frontDoorPivot.add(doorIn);

    const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 0.12), m.limeMat);
    doorHandle.position.set(-W + 0.62, 0.15, 0.28);
    frontDoorPivot.add(doorHandle);

    for (const ly of [baseH + 1.1, midY, H - 1.1]) {
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.16), m.limeMat);
      latch.position.set(-W / 2 + 0.18, ly, D / 2 + 0.2);
      root.add(latch);
    }

    let doorAngle = 0;

    return {
      root,
      step: (opts, dt, isSw) => {
        const lambda = isSw ? 26 : 10;
        const tgt = opts.frontDoorOpen ? Math.PI * 0.58 : 0;
        doorAngle = THREE.MathUtils.damp(doorAngle, tgt, lambda, dt);
        if (Math.abs(doorAngle - tgt) < 0.012) doorAngle = tgt;
        frontDoorPivot.rotation.y = doorAngle;
        co2Aura.visible = opts.co2Active;
        return Math.abs(doorAngle - tgt) > 0.005;
      },
      cameras: {
        hero: { pos: [-11.2, 6.8, 12.8], target: [0, 2.7, 0] },
        front: { pos: [0.4, 3.6, 13.4], target: [0, 2.7, 0] },
        side: { pos: [-12.4, 3.8, 2.2], target: [0, 2.7, 0] },
      },
      dispose: () => disposeGroup(root, m.textures),
    };
  }

  // =========================================================================
  // 4. CONTÊINER DE PALETE PBR (~1,32 × 1,12 × 1,75 m — 200 kg / 16 caixas)
  // =========================================================================
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 10.0), m.shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.008;
  root.add(shadow);

  const W = 5.4;
  const D = 4.5;
  const H = 6.5;
  const baseH = 0.65;
  const cabH = H - baseH;
  const midY = baseH + cabH / 2;

  // PBR Pallet Base
  const baseTop = new THREE.Mesh(new THREE.BoxGeometry(W + 0.16, 0.22, D + 0.16), m.epdmMat);
  baseTop.position.y = baseH - 0.11;
  baseTop.castShadow = true;
  root.add(baseTop);
  for (const bx of [-W / 2 + 0.34, 0, W / 2 - 0.34]) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.56, baseH - 0.18, D + 0.12), m.epdmMat);
    runner.position.set(bx, (baseH - 0.18) / 2, 0);
    root.add(runner);
  }

  // Insulated 60mm PU walls
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, cabH, 0.34), m.hdpeMat);
  back.position.set(0, midY, -D / 2 + 0.17);
  back.castShadow = true;
  root.add(back);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.08, 0.4, D + 0.08), m.hdpeMat);
  roof.position.set(0, H + 0.12, 0);
  roof.castShadow = true;
  root.add(roof);

  for (const s of [-1, 1]) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.34, cabH, D), m.hdpeMat);
    sw.position.set(s * (W / 2 - 0.17), midY, 0);
    sw.castShadow = true;
    root.add(sw);

    const liner = new THREE.Mesh(new THREE.BoxGeometry(0.06, cabH - 0.3, D - 0.5), m.innerLinerMat);
    liner.position.set(s * (W / 2 - 0.37), midY, 0);
    root.add(liner);
  }

  // Left branding decal
  const brand = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.05), m.brandMat);
  brand.position.set(-W / 2 - 0.02, midY, 0);
  brand.rotation.y = -Math.PI / 2;
  root.add(brand);

  // Side CO2 injection port
  const co2Port = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.24, 14), m.metalMat);
  co2Port.rotation.z = Math.PI / 2;
  co2Port.position.set(W / 2 + 0.09, H - 0.8, 0.9);
  root.add(co2Port);

  // Flush QR badge mounted flat on top roof panel + compact side badge
  const qr = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 0.92), m.qrMat);
  qr.position.set(-W / 2 + 0.95, H + 0.34, D / 2 - 0.85);
  root.add(qr);

  // Wide Ceiling Ice Plate (~21 kg PCM)
  const ceilingIce = new THREE.Mesh(new THREE.BoxGeometry(W - 0.9, 0.36, D - 0.9), m.iceMat);
  ceilingIce.position.set(0, H - 0.32, 0);
  root.add(ceilingIce);

  // 16 Embrapa Berry Crates inside (2 cols x 2 deep x 4 high)
  for (let row = 0; row < 4; row++) {
    for (let cx of [-1.18, 1.18]) {
      for (let cz of [-0.95, 0.95]) {
        const bm = (row + (cx > 0 ? 1 : 0)) % 2 === 0 ? m.berryRedMat : m.berryBlueMat;
        const crate = createEmbrapaCrate(2.14, 1.02, 1.72, m.crateMat, bm, m.shelfMat);
        crate.position.set(cx, baseH + 0.16 + row * 1.24, cz);
        root.add(crate);
      }
    }
  }

  const co2Aura = new THREE.Mesh(new THREE.BoxGeometry(W - 0.9, cabH - 0.9, D - 0.9), m.co2AuraMat);
  co2Aura.position.set(0, midY - 0.1, 0);
  root.add(co2Aura);

  // Double French Lateral Doors (Left swings left, Right swings right!)
  const leafW = (W - 0.36) / 2;

  const leftDoorPivot = new THREE.Group();
  leftDoorPivot.position.set(-W / 2 + 0.14, midY, D / 2);
  root.add(leftDoorPivot);

  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(W / 2 - 0.14, midY, D / 2);
  root.add(rightDoorPivot);

  for (const [pivot, dir] of [
    [leftDoorPivot, 1],
    [rightDoorPivot, -1],
  ] as const) {
    for (const hy of [-2.0, 0, 2.0]) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12), m.metalMat);
      hinge.position.set(-dir * 0.08, hy, 0.04);
      pivot.add(hinge);
    }

    const slab = new THREE.Mesh(new THREE.BoxGeometry(leafW - 0.04, cabH - 0.16, 0.26), m.hdpeMat);
    slab.position.set(dir * (leafW / 2), 0, 0.12);
    slab.castShadow = true;
    pivot.add(slab);

    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(leafW - 0.32, cabH - 0.46, 0.06),
      m.innerLinerMat,
    );
    inner.position.set(dir * (leafW / 2), 0, -0.02);
    pivot.add(inner);

    // Lime vertical locking rod near center seam
    const lockBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 0.14), m.limeMat);
    lockBar.position.set(dir * (leafW - 0.28), 0, 0.28);
    pivot.add(lockBar);
  }

  let doorAngle = 0;

  return {
    root,
    step: (opts, dt, isSw) => {
      const lambda = isSw ? 26 : 10;
      const tgt = opts.frontDoorOpen ? Math.PI * 0.58 : 0;
      doorAngle = THREE.MathUtils.damp(doorAngle, tgt, lambda, dt);
      if (Math.abs(doorAngle - tgt) < 0.012) doorAngle = tgt;
      leftDoorPivot.rotation.y = -doorAngle;
      rightDoorPivot.rotation.y = doorAngle;
      co2Aura.visible = opts.co2Active;
      return Math.abs(doorAngle - tgt) > 0.005;
    },
    cameras: {
      hero: { pos: [-12.0, 7.2, 14.0], target: [0, 2.7, 0] },
      front: { pos: [0.0, 3.6, 14.8], target: [0, 2.7, 0] },
      side: { pos: [-13.6, 3.8, 2.2], target: [0, 2.7, 0] },
    },
    dispose: () => disposeGroup(root, m.textures),
  };
}
