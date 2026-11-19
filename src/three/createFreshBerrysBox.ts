import * as THREE from 'three';
import { createBoxTextures } from './proceduralTextures';

export interface FreshBerrysAssembly {
  root: THREE.Group;
  topLidPivot: THREE.Group;
  frontDoorPivot: THREE.Group;
  trayTopGroup: THREE.Group;
  trayBottomGroup: THREE.Group;
  icePackGroup: THREE.Group;
  diffuserGroup: THREE.Group;
  padGroup: THREE.Group;
  co2TabMesh: THREE.Mesh;
  co2AuraMesh: THREE.Mesh;
  topLatches: THREE.Group[];
  frontLatches: THREE.Group[];
  leftOuterWallGroup: THREE.Group;
  airflowGroup: THREE.Group;
  coldArrows: THREE.Group[];
  warmArrows: THREE.Group[];
  stackedBoxGroup: THREE.Group;
  setCutaway: (enabled: boolean) => void;
  dispose: () => void;
}

/**
 * Helper to create a complete beveled L-shaped stacking lug.
 * Each of the 4 corners gets a symmetric, fully closed L-bracket so stacked boxes
 * interlock rigidly in both X and Z inside dry delivery vans.
 */
function createCornerLLugGeometry(armLen = 0.72, armThick = 0.22, height = 0.24): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(armLen, 0);
  shape.lineTo(armLen, armThick);
  shape.lineTo(armThick, armThick);
  shape.lineTo(armThick, armLen);
  shape.lineTo(0, armLen);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/**
 * Creates a clear PET clamshell ("cumbuca") filled with strawberries or blueberries.
 */
function createBerryClamshell(
  kind: 'strawberry' | 'blueberry',
  mats: {
    petMat: THREE.Material;
    strawberryMat: THREE.Material;
    calyxMat: THREE.Material;
    blueberryMat: THREE.Material;
  },
): THREE.Group {
  const g = new THREE.Group();

  // Clear PET container base & rim
  const trayGeo = new THREE.BoxGeometry(1.38, 0.44, 1.62);
  const trayMesh = new THREE.Mesh(trayGeo, mats.petMat);
  trayMesh.position.y = 0.22;
  g.add(trayMesh);

  const rimGeo = new THREE.BoxGeometry(1.46, 0.045, 1.70);
  const rimMesh = new THREE.Mesh(rimGeo, mats.petMat);
  rimMesh.position.y = 0.44;
  g.add(rimMesh);

  if (kind === 'strawberry') {
    const berryGeo = new THREE.ConeGeometry(0.145, 0.28, 10);
    berryGeo.rotateX(Math.PI); // point downward like a real berry
    const calyxGeo = new THREE.CylinderGeometry(0.11, 0.05, 0.04, 6);

    const offsets: Array<[number, number, number, number]> = [
      [-0.42, 0.22, -0.48, 0.2],
      [0.0, 0.24, -0.46, -0.15],
      [0.42, 0.22, -0.44, 0.1],
      [-0.38, 0.25, 0.02, -0.22],
      [0.04, 0.26, 0.0, 0.18],
      [0.42, 0.24, 0.04, -0.12],
      [-0.40, 0.23, 0.48, 0.15],
      [0.02, 0.25, 0.46, -0.18],
      [0.40, 0.23, 0.48, 0.22],
      [-0.18, 0.38, -0.22, 0.3],
      [0.22, 0.38, -0.18, -0.25],
      [-0.16, 0.39, 0.26, -0.28],
      [0.20, 0.38, 0.24, 0.24],
    ];
    for (const [bx, by, bz, tilt] of offsets) {
      const b = new THREE.Mesh(berryGeo, mats.strawberryMat);
      b.position.set(bx, by, bz);
      b.rotation.set(tilt, bx * 2, tilt * 0.7);
      g.add(b);

      const leaf = new THREE.Mesh(calyxGeo, mats.calyxMat);
      leaf.position.set(bx, by + 0.13, bz);
      leaf.rotation.set(tilt, bx * 2, tilt * 0.7);
      g.add(leaf);
    }
  } else {
    const blueGeo = new THREE.SphereGeometry(0.088, 10, 8);
    const dummy = new THREE.Object3D();
    const count = 42;
    const inst = new THREE.InstancedMesh(blueGeo, mats.blueberryMat, count);
    let idx = 0;
    for (let layer = 0; layer < 2; layer++) {
      for (let r = 0; r < 4 && idx < count; r++) {
        for (let c = 0; c < 5 && idx < count; c++) {
          const jitterX = (((idx * 37) % 11) - 5) * 0.015;
          const jitterZ = (((idx * 53) % 11) - 5) * 0.015;
          dummy.position.set(
            -0.48 + c * 0.24 + jitterX,
            0.16 + layer * 0.165 + (r % 2) * 0.02,
            -0.54 + r * 0.36 + jitterZ,
          );
          const s = 0.88 + ((idx * 17) % 5) * 0.06;
          dummy.scale.set(s, s * 0.88, s);
          dummy.updateMatrix();
          inst.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.computeBoundingSphere();
    g.add(inst);
  }

  return g;
}

/**
 * Builds a single over-center compression latch assembly (distinct from carrying handles).
 */
function createCompressionLatch(
  limeMat: THREE.Material,
  darkMat: THREE.Material,
  metalMat: THREE.Material,
): THREE.Group {
  const pivot = new THREE.Group();

  // Hinge pin housing
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 12), metalMat);
  pin.rotation.z = Math.PI / 2;
  pivot.add(pin);

  // Main lime compression paddle
  const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.56, 0.11), limeMat);
  paddle.position.set(0, -0.26, 0.04);
  pivot.add(paddle);

  // Ergonomic thumb grip ridge at bottom of paddle
  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.17), limeMat);
  lip.position.set(0, -0.50, 0.08);
  pivot.add(lip);

  // Central tension bail slot
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.13), darkMat);
  slot.position.set(0, -0.18, 0.04);
  pivot.add(slot);

  return pivot;
}

/**
 * Builds an upward or downward airflow indicator chevron arrow.
 */
function createAirflowArrow(colorHex: number, pointingUp: boolean): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    transparent: true,
    opacity: 0.9,
  });

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.48, 8), mat);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.24, 10), mat);
  if (pointingUp) {
    head.position.y = 0.34;
  } else {
    head.rotation.x = Math.PI;
    head.position.y = -0.34;
  }
  g.add(shaft, head);
  return g;
}

/**
 * Builds a compact second FreshBerrys Caixa M to demonstrate the 4-corner L-lug stacking interlock.
 */
function createStackedTwinBox(
  mats: {
    hdpeMat: THREE.Material;
    limeMat: THREE.Material;
    epdmMat: THREE.Material;
    darkPocketMat: THREE.Material;
    brandMat: THREE.Material;
    qrMat: THREE.Material;
  },
  lugGeo: THREE.ExtrudeGeometry,
): THREE.Group {
  const g = new THREE.Group();

  // Main outer shell (6.0 x 3.5 x 5.0 cm-proportional)
  const body = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.86, 5.0), mats.hdpeMat);
  body.position.y = 1.48;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  // Subtle bottom feet that nest inside the lower box's 4 L-lugs
  const footGeo = new THREE.BoxGeometry(5.52, 0.08, 4.52);
  const foot = new THREE.Mesh(footGeo, mats.hdpeMat);
  foot.position.y = 0.04;
  g.add(foot);

  // Top EPDM seam band
  const seam = new THREE.Mesh(new THREE.BoxGeometry(6.04, 0.08, 5.04), mats.epdmMat);
  seam.position.y = 2.92;
  g.add(seam);

  // Top Lid
  const lid = new THREE.Mesh(new THREE.BoxGeometry(6.08, 0.54, 5.08), mats.hdpeMat);
  lid.position.y = 3.22;
  lid.castShadow = true;
  g.add(lid);

  // All 4 complete L-lugs on the stacked box too
  const corners: Array<[number, number, number]> = [
    [-3.02, 2.52, 0],
    [3.02, 2.52, Math.PI / 2],
    [3.02, -2.52, Math.PI],
    [-3.02, -2.52, -Math.PI / 2],
  ];
  for (const [cx, cz, rotY] of corners) {
    const lug = new THREE.Mesh(lugGeo, mats.hdpeMat);
    lug.position.set(cx, 3.46, cz);
    lug.rotation.y = rotY;
    g.add(lug);
  }

  // Front closed door silhouette + 2 lime latches
  const doorOutline = new THREE.Mesh(new THREE.BoxGeometry(5.04, 2.26, 0.08), mats.epdmMat);
  doorOutline.position.set(0, 1.48, 2.49);
  g.add(doorOutline);
  const doorFace = new THREE.Mesh(new THREE.BoxGeometry(4.86, 2.10, 0.12), mats.hdpeMat);
  doorFace.position.set(0, 1.48, 2.50);
  g.add(doorFace);

  for (const lx of [-1.45, 1.45]) {
    const topLatch = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.14), mats.limeMat);
    topLatch.position.set(lx, 2.86, 2.54);
    g.add(topLatch);
  }
  for (const ly of [0.95, 1.98]) {
    const frontLatch = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.14), mats.limeMat);
    frontLatch.position.set(-2.46, ly, 2.55);
    g.add(frontLatch);
  }

  // Side recessed handle pocket
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 1.32), mats.darkPocketMat);
  pocket.position.set(-2.99, 1.95, 0);
  g.add(pocket);

  // Side branding plate
  const brandPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 2.02), mats.brandMat);
  brandPlane.position.set(-3.015, 1.05, 0);
  brandPlane.rotation.y = -Math.PI / 2;
  g.add(brandPlane);

  // Top QR badge
  const qrBadge = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.04, 0.84), mats.qrMat);
  qrBadge.position.set(1.92, 3.50, -1.45);
  g.add(qrBadge);

  return g;
}

export function createFreshBerrysBox(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): FreshBerrysAssembly {
  const root = new THREE.Group();
  const textures = createBoxTextures(maxAnisotropy);

  // Calibrated PBR Material Library (ACES-balanced for exact #1d4c0b & #b9fc12 appearance)
  const hdpeMat = new THREE.MeshStandardMaterial({
    color: 0x184208,
    roughness: 0.62,
    metalness: 0.04,
    bumpMap: textures.hdpeBumpMap,
    bumpScale: 0.015,
  });

  const hdpeCutawayMat = hdpeMat.clone();
  hdpeCutawayMat.transparent = false;
  hdpeCutawayMat.opacity = 1;

  const puCoreMat = new THREE.MeshStandardMaterial({
    color: 0xe7e1c4,
    roughness: 0.86,
    metalness: 0.0,
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
    roughness: 0.92,
    metalness: 0.02,
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
    transmission: isSoftwareGl ? 0 : 0.45,
    transparent: true,
    opacity: isSoftwareGl ? 0.78 : 0.92,
    clearcoat: 0.8,
  });

  const petMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f7fb,
    roughness: 0.12,
    metalness: 0.0,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });

  const shelfMat = new THREE.MeshStandardMaterial({
    color: 0xdce4d7,
    roughness: 0.38,
    metalness: 0.35,
  });

  const diffuserMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.diffuserMap,
    roughness: 0.42,
    metalness: 0.08,
  });

  const padMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.absorbentPadMap,
    roughness: 0.94,
    metalness: 0.0,
  });

  const brandMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.brandSideMap,
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

  const strawberryMat = new THREE.MeshStandardMaterial({
    color: 0xd6242a,
    roughness: 0.26,
    metalness: 0.02,
  });

  const calyxMat = new THREE.MeshStandardMaterial({
    color: 0x2f7d1c,
    roughness: 0.65,
    metalness: 0.0,
  });

  const blueberryMat = new THREE.MeshStandardMaterial({
    color: 0x293b6b,
    roughness: 0.48,
    metalness: 0.04,
  });

  const co2AuraMat = new THREE.MeshBasicMaterial({
    color: 0xb9fc12,
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // Dimensions: Length X = 6.0 (60cm), Depth Z = 5.0 (50cm), Total Height Y = 3.5 (35cm)
  // Wall thickness = 0.40 (40mm PU + PEAD sandwich)
  // Body height = 2.95, Top lid height = 0.55

  // ---------------------------------------------------------------------------
  // 1. STUDIO CONTACT SHADOW PLANE (grounded at y = 0.005)
  // ---------------------------------------------------------------------------
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 9.2),
    new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.008;
  root.add(shadowPlane);

  // ---------------------------------------------------------------------------
  // 2. MAIN INSULATED BODY CHASSIS (60 x 50 x 29.5 cm lower body)
  // ---------------------------------------------------------------------------
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Bottom interlocking base rim (nests neatly into lower box's 4 L-lugs)
  const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(5.52, 0.10, 4.52), hdpeMat);
  baseFoot.position.y = 0.05;
  baseFoot.castShadow = true;
  baseFoot.receiveShadow = true;
  bodyGroup.add(baseFoot);

  // Floor slab (outer HDPE + PU + inner liner)
  const floorOuter = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.34, 5.0), hdpeMat);
  floorOuter.position.y = 0.25;
  floorOuter.castShadow = true;
  floorOuter.receiveShadow = true;
  bodyGroup.add(floorOuter);

  const floorInner = new THREE.Mesh(new THREE.BoxGeometry(5.16, 0.05, 4.16), innerLinerMat);
  floorInner.position.y = 0.43;
  floorInner.receiveShadow = true;
  bodyGroup.add(floorInner);

  // Back wall (-Z)
  const backOuter = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.58, 0.36), hdpeMat);
  backOuter.position.set(0, 1.66, -2.32);
  backOuter.castShadow = true;
  backOuter.receiveShadow = true;
  bodyGroup.add(backOuter);

  const backInner = new THREE.Mesh(new THREE.BoxGeometry(5.16, 2.48, 0.06), innerLinerMat);
  backInner.position.set(0, 1.66, -2.11);
  bodyGroup.add(backInner);

  // Right wall (+X)
  const rightOuter = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.58, 4.64), hdpeMat);
  rightOuter.position.set(2.82, 1.66, 0.0);
  rightOuter.castShadow = true;
  rightOuter.receiveShadow = true;
  bodyGroup.add(rightOuter);

  const rightInner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.48, 4.18), innerLinerMat);
  rightInner.position.set(2.61, 1.66, 0.0);
  bodyGroup.add(rightInner);

  // Left wall (-X) — wrapped in leftOuterWallGroup so Cutaway mode reveals return channels & 40mm PU wall!
  const leftOuterWallGroup = new THREE.Group();
  bodyGroup.add(leftOuterWallGroup);

  const leftOuter = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.58, 4.64), hdpeCutawayMat);
  leftOuter.position.set(-2.82, 1.66, 0.0);
  leftOuter.castShadow = true;
  leftOuter.receiveShadow = true;
  leftOuterWallGroup.add(leftOuter);

  const leftInner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.48, 4.18), innerLinerMat);
  leftInner.position.set(-2.61, 1.66, 0.0);
  bodyGroup.add(leftInner);

  // Side Wall Air-Return Channels (vertical molded channels on BOTH left & right interior walls)
  for (const side of [-1, 1]) {
    for (const zOff of [-1.2, 0.0, 1.2]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.15, 0.14), innerLinerMat);
      rib.position.set(side * 2.54, 1.54, zOff);
      bodyGroup.add(rib);
    }
    // Recessed channel backing strip
    const channelBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.1, 3.6),
      new THREE.MeshStandardMaterial({ color: 0xe3ecc2, roughness: 0.55 }),
    );
    channelBackdrop.position.set(side * 2.58, 1.54, 0);
    bodyGroup.add(channelBackdrop);
  }

  // Front Structural Jamb Frame (Left, Right, Bottom & Top Header around Front Access Door opening)
  // Shows authentic 40 mm PU insulation sandwich + continuous black EPDM door seal!
  const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.58, 0.36), hdpeMat);
  leftJamb.position.set(-2.79, 1.66, 2.32);
  bodyGroup.add(leftJamb);

  const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.58, 0.36), hdpeMat);
  rightJamb.position.set(2.79, 1.66, 2.32);
  bodyGroup.add(rightJamb);

  // Visible 40mm PU thermal core lip around front opening
  const frontLipTop = new THREE.Mesh(new THREE.BoxGeometry(5.32, 0.14, 0.24), puCoreMat);
  frontLipTop.position.set(0, 2.88, 2.34);
  bodyGroup.add(frontLipTop);

  const frontLipBottom = new THREE.Mesh(new THREE.BoxGeometry(5.32, 0.14, 0.24), puCoreMat);
  frontLipBottom.position.set(0, 0.44, 2.34);
  bodyGroup.add(frontLipBottom);

  const frontLipLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.48, 0.24), puCoreMat);
  frontLipLeft.position.set(-2.59, 1.66, 2.34);
  bodyGroup.add(frontLipLeft);

  const frontLipRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.48, 0.24), puCoreMat);
  frontLipRight.position.set(2.59, 1.66, 2.34);
  bodyGroup.add(frontLipRight);

  // Continuous black EPDM Gasket Ring on the front door frame
  const epdmFrontTop = new THREE.Mesh(new THREE.BoxGeometry(5.22, 0.06, 0.06), epdmMat);
  epdmFrontTop.position.set(0, 2.86, 2.47);
  const epdmFrontBot = new THREE.Mesh(new THREE.BoxGeometry(5.22, 0.06, 0.06), epdmMat);
  epdmFrontBot.position.set(0, 0.46, 2.47);
  const epdmFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.44, 0.06), epdmMat);
  epdmFrontLeft.position.set(-2.58, 1.66, 2.47);
  const epdmFrontRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.44, 0.06), epdmMat);
  epdmFrontRight.position.set(2.58, 1.66, 2.47);
  bodyGroup.add(epdmFrontTop, epdmFrontBot, epdmFrontLeft, epdmFrontRight);

  // Top Perimeter PU Core Rim (tucked slightly inward so ONLY sleek black EPDM shows when closed)
  const topRimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 4.72), puCoreMat);
  topRimLeft.position.set(-2.72, 2.93, 0);
  const topRimRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 4.72), puCoreMat);
  topRimRight.position.set(2.72, 2.93, 0);
  const topRimBack = new THREE.Mesh(new THREE.BoxGeometry(5.68, 0.06, 0.24), puCoreMat);
  topRimBack.position.set(0, 2.93, -2.24);
  const topRimFront = new THREE.Mesh(new THREE.BoxGeometry(5.68, 0.06, 0.20), puCoreMat);
  topRimFront.position.set(0, 2.93, 2.24);
  bodyGroup.add(topRimLeft, topRimRight, topRimBack, topRimFront);

  // Continuous Black EPDM Compression Seal visible as a crisp dark shadow line when closed
  const topEpdmOuter = new THREE.Mesh(new THREE.BoxGeometry(6.02, 0.08, 5.02), epdmMat);
  topEpdmOuter.position.set(0, 2.97, 0);
  // Carve interior visually by using 4 perimeter strips at exact outer body footprint
  topEpdmOuter.visible = false;
  const topEpdmL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 5.02), epdmMat);
  topEpdmL.position.set(-2.94, 2.97, 0);
  const topEpdmR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 5.02), epdmMat);
  topEpdmR.position.set(2.94, 2.97, 0);
  const topEpdmB = new THREE.Mesh(new THREE.BoxGeometry(6.02, 0.08, 0.14), epdmMat);
  topEpdmB.position.set(0, 2.97, -2.44);
  const topEpdmF = new THREE.Mesh(new THREE.BoxGeometry(6.02, 0.08, 0.14), epdmMat);
  topEpdmF.position.set(0, 2.97, 2.44);
  bodyGroup.add(topEpdmL, topEpdmR, topEpdmB, topEpdmF);

  // ---------------------------------------------------------------------------
  // 3. SEPARATE RECESSED ERGONOMIC SIDE CARRYING HANDLES (Left & Right)
  // Completely independent from the compression latches!
  // ---------------------------------------------------------------------------
  const buildSideHandle = (side: -1 | 1, target: THREE.Group) => {
    const hGroup = new THREE.Group();
    // Recessed shadow pocket molded into side wall
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 1.48), darkPocketMat);
    pocket.position.set(side * 2.96, 2.30, 0);
    hGroup.add(pocket);

    // Molded bevel surround
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.62), hdpeMat);
    frameTop.position.set(side * 3.01, 2.53, 0);
    const frameBot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.62), hdpeMat);
    frameBot.position.set(side * 3.01, 2.07, 0);
    hGroup.add(frameTop, frameBot);

    // Ergonomic rubberized dark grip bar inside recess (gloved-hand friendly)
    const gripBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.32, 12), epdmMat);
    gripBar.rotation.x = Math.PI / 2;
    gripBar.position.set(side * 2.99, 2.40, 0);
    hGroup.add(gripBar);

    target.add(hGroup);
  };
  buildSideHandle(-1, leftOuterWallGroup);
  buildSideHandle(1, bodyGroup);

  // FreshLog Official Branding Decal on Left Side Panel (cleanly below recessed handle)
  const brandDecal = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 1.62), brandMat);
  brandDecal.position.set(-3.008, 1.08, 0);
  brandDecal.rotation.y = -Math.PI / 2;
  leftOuterWallGroup.add(brandDecal);

  // ---------------------------------------------------------------------------
  // 4. BOTTOM CONDENSATION GUTTER + REMOVABLE ABSORBENT PAD (Manta Absorvente)
  // ---------------------------------------------------------------------------
  // Perimeter drainage gutter channel along left & right base edges
  for (const side of [-1, 1]) {
    const gutter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 4.10), darkPocketMat);
    gutter.position.set(side * 2.42, 0.47, 0);
    bodyGroup.add(gutter);
  }

  const padGroup = new THREE.Group();
  bodyGroup.add(padGroup);

  const absorbentPad = new THREE.Mesh(new THREE.BoxGeometry(4.64, 0.09, 3.88), padMat);
  absorbentPad.position.set(0, 0.50, 0);
  absorbentPad.receiveShadow = true;
  padGroup.add(absorbentPad);

  // Subtle lime pull-tab on front edge of absorbent pad for hygienic replacement
  const padTab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.14), limeMat);
  padTab.position.set(0, 0.55, 1.94);
  padGroup.add(padTab);

  // ---------------------------------------------------------------------------
  // 5. SLIDING PERFORATED BERRY TRAYS (Gavetas Deslizantes de Cumbucas)
  // ---------------------------------------------------------------------------
  const buildBerryTray = (yLevel: number, pattern: Array<'strawberry' | 'blueberry'>) => {
    const tGroup = new THREE.Group();
    tGroup.position.set(0, yLevel, 0);

    // Molded perforated aluminum/HDPE tray base
    const plate = new THREE.Mesh(new THREE.BoxGeometry(4.84, 0.06, 3.84), shelfMat);
    plate.castShadow = true;
    plate.receiveShadow = true;
    tGroup.add(plate);

    // Front finger-pull lip (ergonomic tray extraction in bakeries/cafes)
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(4.84, 0.14, 0.07), shelfMat);
    frontRail.position.set(0, 0.05, 1.92);
    tGroup.add(frontRail);

    const pullHandle = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.09), limeMat);
    pullHandle.position.set(0, 0.06, 1.97);
    tGroup.add(pullHandle);

    // 2 rows x 3 cols = 6 clamshells per tray (~9 kg total across 2 layers)
    const cols = [-1.54, 0.0, 1.54];
    const rows = [-0.92, 0.92];
    let pIdx = 0;
    for (const rz of rows) {
      for (const cx of cols) {
        const kind = pattern[pIdx % pattern.length];
        const clamshell = createBerryClamshell(kind, {
          petMat,
          strawberryMat,
          calyxMat,
          blueberryMat,
        });
        clamshell.position.set(cx, 0.03, rz);
        tGroup.add(clamshell);
        pIdx++;
      }
    }

    return tGroup;
  };

  // Side tray support rails mounted on inner walls
  for (const ry of [0.76, 1.52]) {
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 3.85), shelfMat);
      rail.position.set(side * 2.48, ry - 0.04, 0);
      bodyGroup.add(rail);
    }
  }

  const trayBottomGroup = buildBerryTray(0.76, [
    'strawberry',
    'blueberry',
    'strawberry',
    'strawberry',
    'blueberry',
    'strawberry',
  ]);
  const trayTopGroup = buildBerryTray(1.52, [
    'blueberry',
    'strawberry',
    'blueberry',
    'strawberry',
    'blueberry',
    'strawberry',
  ]);
  bodyGroup.add(trayBottomGroup, trayTopGroup);

  // ---------------------------------------------------------------------------
  // 6. UPPER THERMAL PLENUM: Diffuser Plate + 2x2kg Ice Cartridges + CO2 Sachet + ESP32
  // ---------------------------------------------------------------------------
  const diffuserGroup = new THREE.Group();
  bodyGroup.add(diffuserGroup);

  const diffuserPlate = new THREE.Mesh(new THREE.BoxGeometry(4.96, 0.08, 4.02), diffuserMat);
  diffuserPlate.position.set(0, 2.24, 0);
  diffuserGroup.add(diffuserPlate);

  // Ice Cartridges (2 x 2 kg PCM blocks resting cleanly above diffuser)
  const icePackGroup = new THREE.Group();
  bodyGroup.add(icePackGroup);

  for (const ix of [-1.24, 1.02]) {
    const pack = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.46, 3.42), iceMat);
    block.position.set(ix, 2.54, -0.05);
    pack.add(block);

    // Molded stiffening ribs + finger-lift recess on top of each ice cartridge
    const rib = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.05, 0.24), iceMat);
    rib.position.set(ix, 2.79, -0.05);
    pack.add(rib);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 12), shelfMat);
    cap.position.set(ix + 0.65, 2.79, 1.25);
    pack.add(cap);

    icePackGroup.add(pack);
  }

  // Right-side Plenum Bay: ESP32 Sensor Housing + CO2 Protective Sachet + Pull-Tab + Relief Valve
  const espHousing = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.68), darkPocketMat);
  espHousing.position.set(2.34, 2.58, -1.25);
  bodyGroup.add(espHousing);

  const co2Sachet = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.84), innerLinerMat);
  co2Sachet.position.set(2.36, 2.56, 0.25);
  bodyGroup.add(co2Sachet);

  // Lime pull-tab ribbon ("puxar a fita do sachê protetor")
  const co2TabMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.52), limeMat);
  co2TabMesh.position.set(2.36, 2.74, 0.72);
  bodyGroup.add(co2TabMesh);

  // Pressure / CO2 relief valve
  const reliefValve = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.09, 14), metalMat);
  reliefValve.rotation.z = Math.PI / 2;
  reliefValve.position.set(2.52, 2.62, 1.15);
  bodyGroup.add(reliefValve);

  // Subtle CO2 protective atmosphere shimmer inside fruit chamber
  const co2AuraMesh = new THREE.Mesh(new THREE.BoxGeometry(4.82, 1.56, 3.82), co2AuraMat);
  co2AuraMesh.position.set(0, 1.38, 0);
  bodyGroup.add(co2AuraMesh);

  // ---------------------------------------------------------------------------
  // 7. HINGED INSULATED FRONT ACCESS DOOR (Porta Frontal Térmica com Vedação EPDM)
  // Swings open to the right on vertical stainless hinges — works even when stacked!
  // ---------------------------------------------------------------------------
  const frontDoorPivot = new THREE.Group();
  frontDoorPivot.position.set(2.60, 1.66, 2.50); // right vertical hinge axis
  root.add(frontDoorPivot);

  // Door hinges on right edge
  for (const hy of [-0.75, 0.75]) {
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.36, 12), metalMat);
    hinge.position.set(0.04, hy, 0.02);
    frontDoorPivot.add(hinge);
  }

  // Insulated 40mm door slab (extends left from hinge at x = 0 to x = -5.20)
  const doorOuter = new THREE.Mesh(new THREE.BoxGeometry(5.24, 2.46, 0.28), hdpeMat);
  doorOuter.position.set(-2.60, 0, 0.12);
  doorOuter.castShadow = true;
  doorOuter.receiveShadow = true;
  frontDoorPivot.add(doorOuter);

  // Molded recessed styling panel on front door exterior
  const doorRecessFrame = new THREE.Mesh(new THREE.BoxGeometry(4.52, 1.88, 0.06), darkPocketMat);
  doorRecessFrame.position.set(-2.60, 0, 0.25);
  frontDoorPivot.add(doorRecessFrame);

  const doorCenterPanel = new THREE.Mesh(new THREE.BoxGeometry(4.32, 1.68, 0.08), hdpeMat);
  doorCenterPanel.position.set(-2.60, 0, 0.26);
  frontDoorPivot.add(doorCenterPanel);

  // Ergonomic recessed front door pull handle on the left edge
  const doorHandlePocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.86, 0.10), darkPocketMat);
  doorHandlePocket.position.set(-4.52, 0, 0.27);
  frontDoorPivot.add(doorHandlePocket);

  const doorHandleAccent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 0.09), limeMat);
  doorHandleAccent.position.set(-4.60, 0, 0.29);
  frontDoorPivot.add(doorHandleAccent);

  // Hygienic food-safe inner door liner (#f4fccf) + EPDM gasket lip
  const doorInnerLiner = new THREE.Mesh(new THREE.BoxGeometry(4.92, 2.16, 0.08), innerLinerMat);
  doorInnerLiner.position.set(-2.60, 0, -0.02);
  frontDoorPivot.add(doorInnerLiner);

  const doorInnerGasket = new THREE.Mesh(new THREE.BoxGeometry(5.04, 2.28, 0.05), epdmMat);
  doorInnerGasket.position.set(-2.60, 0, -0.03);
  frontDoorPivot.add(doorInnerGasket);

  // 2 Front-Door Compression Latches (#b9fc12) mounted cleanly on the left jamb clamping inward over the front door
  const frontLatches: THREE.Group[] = [];
  for (const ly of [2.16, 1.14]) {
    const latch = createCompressionLatch(limeMat, darkPocketMat, metalMat);
    // Rotate +90 deg around Z so paddle extends inward (+X) over the closed front door edge
    latch.rotation.z = Math.PI / 2;
    latch.position.set(-2.78, ly, 2.66);
    bodyGroup.add(latch);
    frontLatches.push(latch);
  }

  // ---------------------------------------------------------------------------
  // 8. HINGED TOP THERMAL LID (Tampa Superior Articulada)
  // WITH 4/4 COMPLETE SYMMETRIC L-SHAPED STACKING LUGS!
  // ---------------------------------------------------------------------------
  const topLidPivot = new THREE.Group();
  topLidPivot.position.set(0, 3.00, -2.50); // Rear hinge axis
  root.add(topLidPivot);

  // Rear Heavy-Duty Stainless-Pin Hinges
  for (const hx of [-1.85, 1.85]) {
    const rearHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.56, 12), metalMat);
    rearHinge.rotation.z = Math.PI / 2;
    rearHinge.position.set(hx, 0.02, -0.04);
    topLidPivot.add(rearHinge);
  }

  // Main Insulated Lid Shell (extends forward from z = 0 to z = +5.0)
  const lidShell = new THREE.Mesh(new THREE.BoxGeometry(6.08, 0.50, 5.08), hdpeMat);
  lidShell.position.set(0, 0.27, 2.50);
  lidShell.castShadow = true;
  lidShell.receiveShadow = true;
  topLidPivot.add(lidShell);

  // Lid underside hygienic liner + black EPDM gasket ring
  const lidInner = new THREE.Mesh(new THREE.BoxGeometry(5.48, 0.06, 4.48), innerLinerMat);
  lidInner.position.set(0, 0.02, 2.50);
  topLidPivot.add(lidInner);

  const lidEpdm = new THREE.Mesh(new THREE.BoxGeometry(5.76, 0.05, 4.76), epdmMat);
  lidEpdm.position.set(0, 0.01, 2.50);
  topLidPivot.add(lidEpdm);

  // 4/4 COMPLETE SYMMETRIC L-SHAPED INTERLOCKING STACKING LUGS (All 4 corners flush with outer lid perimeter!)
  const lugGeo = createCornerLLugGeometry(0.76, 0.22, 0.20);
  const lidCornerSpecs: Array<[number, number, number]> = [
    [-3.01, 5.01, 0], // Front-Left (complete L!)
    [3.01, 5.01, Math.PI / 2], // Front-Right (complete L!)
    [3.01, -0.01, Math.PI], // Back-Right (complete L!)
    [-3.01, -0.01, -Math.PI / 2], // Back-Left (complete L!)
  ];
  for (const [cx, cz, rotY] of lidCornerSpecs) {
    const lug = new THREE.Mesh(lugGeo, hdpeMat);
    lug.position.set(cx, 0.51, cz);
    lug.rotation.y = rotY;
    lug.castShadow = true;
    topLidPivot.add(lug);
  }

  // Flush Recessed Foldable Top Carry Handle (center of lid — doesn't block stacking!)
  const topHandleWell = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.10, 0.72), darkPocketMat);
  topHandleWell.position.set(0, 0.51, 2.50);
  topLidPivot.add(topHandleWell);

  const topHandleGrip = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.12, 0.24), limeMat);
  topHandleGrip.position.set(0, 0.54, 2.50);
  topLidPivot.add(topHandleGrip);

  // Flush Recessed IoT Sensor + QR Code Module (Top-Right corner, safely inside stacking perimeter)
  const qrFrame = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.08, 1.06), darkPocketMat);
  qrFrame.position.set(1.94, 0.53, 1.24);
  topLidPivot.add(qrFrame);

  const qrPlate = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.06, 0.94), qrMat);
  qrPlate.position.set(1.94, 0.55, 1.24);
  topLidPivot.add(qrPlate);

  // 2 Separate Top-Lid Compression Latches (#b9fc12) on the Front Upper Rim (clamping lid to body)
  const topLatches: THREE.Group[] = [];
  for (const lx of [-1.45, 1.45]) {
    const latch = createCompressionLatch(limeMat, darkPocketMat, metalMat);
    latch.position.set(lx, 0.22, 5.08);
    topLidPivot.add(latch);
    topLatches.push(latch);
  }

  // ---------------------------------------------------------------------------
  // 9. ANIMATED THERMAL CONVECTION AIRFLOW & DRAINAGE ARROWS
  // ---------------------------------------------------------------------------
  const airflowGroup = new THREE.Group();
  bodyGroup.add(airflowGroup);

  const coldArrows: THREE.Group[] = [];
  for (const [ax, az] of [
    [-1.15, 0.25],
    [0.0, -0.25],
    [1.15, 0.25],
  ]) {
    const arrow = createAirflowArrow(0x38bdf8, false);
    arrow.position.set(ax, 1.75, az);
    airflowGroup.add(arrow);
    coldArrows.push(arrow);
  }

  const warmArrows: THREE.Group[] = [];
  for (const [ax, az] of [
    [-2.48, -0.5],
    [-2.48, 0.7],
    [2.48, -0.5],
    [2.48, 0.7],
  ]) {
    const arrow = createAirflowArrow(0xf97316, true);
    arrow.position.set(ax, 1.2, az);
    airflowGroup.add(arrow);
    warmArrows.push(arrow);
  }

  // ---------------------------------------------------------------------------
  // 10. OPTIONAL 2ND INTERLOCKING STACKED BOX (Stacking Proof)
  // ---------------------------------------------------------------------------
  const stackedBoxGroup = createStackedTwinBox(
    {
      hdpeMat,
      limeMat,
      epdmMat,
      darkPocketMat,
      brandMat,
      qrMat,
    },
    lugGeo,
  );
  stackedBoxGroup.position.set(0, 6.4, 0);
  stackedBoxGroup.visible = false;
  root.add(stackedBoxGroup);

  const setCutaway = (enabled: boolean) => {
    hdpeCutawayMat.transparent = enabled;
    hdpeCutawayMat.opacity = enabled ? 0.16 : 1.0;
    hdpeCutawayMat.depthWrite = !enabled;
    hdpeCutawayMat.needsUpdate = true;
    brandDecal.visible = !enabled;
  };

  const dispose = () => {
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
  };

  return {
    root,
    topLidPivot,
    frontDoorPivot,
    trayTopGroup,
    trayBottomGroup,
    icePackGroup,
    diffuserGroup,
    padGroup,
    co2TabMesh,
    co2AuraMesh,
    topLatches,
    frontLatches,
    leftOuterWallGroup,
    airflowGroup,
    coldArrows,
    warmArrows,
    stackedBoxGroup,
    setCutaway,
    dispose,
  };
}
