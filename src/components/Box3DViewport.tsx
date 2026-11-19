import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  DoorOpen,
  Layers,
  PackageOpen,
  RotateCcw,
  Scissors,
  Snowflake,
  Wind,
} from 'lucide-react';
import {
  computeBoxKinematics,
  type BoxMechanismState,
  type ProductModelId,
} from '../utils/coldChainModel';
import {
  createFreshBerrysBox,
  type FreshBerrysAssembly,
} from '../three/createFreshBerrysBox';
import {
  createProductFamily3D,
  type ProductFamily3DHandle,
} from '../three/createProductFamily3D';
import { FRESHLOG_PRODUCTS, GENERATED_RENDERS } from '../data/freshBerrysData';

export type CameraPresetId = 'hero' | 'front' | 'top' | 'stack' | 'side';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAIXA_M_PRESETS: CameraPreset[] = [
  { id: 'hero', label: '3/4 Geral', position: [-8.8, 6.1, 10.6], target: [0, 1.3, 0] },
  { id: 'front', label: 'Porta Lateral', position: [0.2, 2.9, 11.4], target: [0, 1.25, 0.3] },
  { id: 'top', label: 'Tampa & Gelo', position: [-3.8, 9.2, 7.6], target: [0.1, 1.9, -0.1] },
  { id: 'stack', label: 'Empilhamento L', position: [-10.4, 7.4, 11.4], target: [0, 2.8, 0] },
  { id: 'side', label: 'Lateral & Alça', position: [-10.6, 3.2, 2.2], target: [0, 1.3, 0] },
];

interface Box3DViewportProps {
  selectedProductId: ProductModelId;
  onSelectProduct: (id: ProductModelId) => void;
  mechanism: BoxMechanismState;
  onMechanismChange: (patch: Partial<BoxMechanismState>) => void;
  onResetMechanism: () => void;
}

const _camTargetPos = new THREE.Vector3();
const _camLookTarget = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const Box3DViewport: React.FC<Box3DViewportProps> = ({
  selectedProductId,
  onSelectProduct,
  mechanism,
  onMechanismChange,
  onResetMechanism,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [dockExpanded, setDockExpanded] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('hero');
  const [webglFailed, setWebglFailed] = useState(false);

  const activeProduct =
    FRESHLOG_PRODUCTS.find((p) => p.id === selectedProductId) ?? FRESHLOG_PRODUCTS[1];
  const isCaixaM = selectedProductId === 'caixa-m';
  const isCaixaP = selectedProductId === 'caixa-p';
  const isDoubleDoor = selectedProductId === 'conteiner-palete';

  // Persistent scene & assembly refs (avoids recreating WebGLRenderer/PMREM on model switch)
  const mechanismRef = useRef<BoxMechanismState>(mechanism);
  const selectedProductRef = useRef<ProductModelId>(selectedProductId);
  const sceneContextRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    maxAniso: number;
    isSoftwareGl: boolean;
    mountedProductId: ProductModelId | null;
    caixaM: FreshBerrysAssembly | null;
    family: ProductFamily3DHandle | null;
    resetCaixaMCur: () => void;
  } | null>(null);
  const familyCamerasRef = useRef<ProductFamily3DHandle['cameras'] | null>(null);
  const cameraGoalRef = useRef<{
    pos: [number, number, number];
    target: [number, number, number];
    active: boolean;
  }>({
    pos: CAIXA_M_PRESETS[0].position,
    target: CAIXA_M_PRESETS[0].target,
    active: false,
  });
  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    mechanismRef.current = mechanism;
    requestRenderRef.current();
  }, [mechanism]);

  const selectPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    cameraGoalRef.current = {
      pos: preset.position,
      target: preset.target,
      active: true,
    };
    requestRenderRef.current();
  };

  // Helper to mount/swap ONLY the active product geometry inside the persistent scene
  const mountProductModel = (productId: ProductModelId) => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;
    if (ctx.mountedProductId === productId) return;

    if (ctx.caixaM) {
      ctx.scene.remove(ctx.caixaM.root);
      ctx.caixaM.dispose();
      ctx.caixaM = null;
    }
    if (ctx.family) {
      ctx.scene.remove(ctx.family.root);
      ctx.family.dispose();
      ctx.family = null;
    }

    ctx.mountedProductId = productId;

    if (productId === 'caixa-m') {
      ctx.caixaM = createFreshBerrysBox(ctx.maxAniso, ctx.isSoftwareGl);
      ctx.scene.add(ctx.caixaM.root);
      ctx.resetCaixaMCur();
      familyCamerasRef.current = null;

      ctx.camera.position.set(...CAIXA_M_PRESETS[0].position);
      ctx.controls.target.set(...CAIXA_M_PRESETS[0].target);
    } else {
      ctx.family = createProductFamily3D(productId, ctx.maxAniso, ctx.isSoftwareGl);
      ctx.scene.add(ctx.family.root);
      familyCamerasRef.current = ctx.family.cameras;

      ctx.camera.position.set(...ctx.family.cameras.hero.pos);
      ctx.controls.target.set(...ctx.family.cameras.hero.target);
    }

    cameraGoalRef.current.active = false;
    ctx.controls.update();
    setActivePreset('hero');
    requestRenderRef.current();
  };

  // Initialize persistent WebGLRenderer + RoomEnvironment once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      setWebglFailed(true);
    };
    const onContextRestored = () => {
      setWebglFailed(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const bgHex = 0xedf1e7;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.Fog(bgHex, 30, 65);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.2, 150);
    camera.position.set(...CAIXA_M_PRESETS[0].position);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(...CAIXA_M_PRESETS[0].target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.8;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.update();

    const hemiLight = new THREE.HemisphereLight(0xeef6ff, 0xc9d4be, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e8, 1.85);
    keyLight.position.set(8.5, 14, 10.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 36;
      keyLight.shadow.camera.left = -8.5;
      keyLight.shadow.camera.right = 8.5;
      keyLight.shadow.camera.top = 8.5;
      keyLight.shadow.camera.bottom = -8.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd9f2ff, 0.72);
    rimLight.position.set(-9, 6.5, -8.5);
    scene.add(rimLight);

    const studioFloor = new THREE.Mesh(
      new THREE.CircleGeometry(32, 48),
      new THREE.MeshStandardMaterial({
        color: 0xe6ece0,
        roughness: 0.94,
        metalness: 0.0,
      }),
    );
    studioFloor.rotation.x = -Math.PI / 2;
    studioFloor.position.y = 0;
    studioFloor.receiveShadow = true;
    scene.add(studioFloor);

    const cur = {
      topLidAngle: 0,
      frontDoorAngle: 0,
      trayPull: 0,
      iceLift: 0,
      co2Pull: 0,
      topLatch: 0,
      frontLatch: 0,
      stackY: 6.4,
      exLidY: 0,
      exIceY: 0,
      exDiffY: 0,
      exDoorZ: 0,
      exTrayTopZ: 0,
      exTrayBotZ: 0,
      exPadY: 0,
    };

    const resetCaixaMCur = () => {
      cur.topLidAngle = 0;
      cur.frontDoorAngle = 0;
      cur.trayPull = 0;
      cur.iceLift = 0;
      cur.co2Pull = 0;
      cur.topLatch = 0;
      cur.frontLatch = 0;
      cur.stackY = 6.4;
      cur.exLidY = 0;
      cur.exIceY = 0;
      cur.exDiffY = 0;
      cur.exDoorZ = 0;
      cur.exTrayTopZ = 0;
      cur.exTrayBotZ = 0;
      cur.exPadY = 0;
    };

    sceneContextRef.current = {
      scene,
      camera,
      controls,
      maxAniso: renderer.capabilities.getMaxAnisotropy(),
      isSoftwareGl,
      mountedProductId: null,
      caixaM: null,
      family: null,
      resetCaixaMCur,
    };

    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let airflowClock = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, renderDirty ? 10 : 50);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepScene(now: number): boolean {
      const dt = Math.min(0.05, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;

      const mech = mechanismRef.current;
      const ctx = sceneContextRef.current;
      let stillMoving = false;

      if (ctx?.caixaM) {
        const caixaMAssembly = ctx.caixaM;
        const tgt = computeBoxKinematics(mech);
        const lambda = isSoftwareGl ? 24 : 9;

        const dampVal = (current: number, target: number) => {
          const next = THREE.MathUtils.damp(current, target, lambda, dt);
          if (Math.abs(next - target) > 0.006) {
            stillMoving = true;
            return next;
          }
          return target;
        };

        cur.topLidAngle = dampVal(cur.topLidAngle, tgt.topLidAngleRad);
        cur.frontDoorAngle = dampVal(cur.frontDoorAngle, tgt.frontDoorAngleRad);
        cur.trayPull = dampVal(cur.trayPull, tgt.trayPullOffset);
        cur.iceLift = dampVal(cur.iceLift, tgt.icePackLiftY);
        cur.co2Pull = dampVal(cur.co2Pull, tgt.co2TabPullOffset);
        cur.topLatch = dampVal(cur.topLatch, tgt.topLatchAngleRad);
        cur.frontLatch = dampVal(cur.frontLatch, tgt.frontLatchAngleRad);
        cur.stackY = dampVal(cur.stackY, tgt.stackedBoxY);

        cur.exLidY = dampVal(cur.exLidY, tgt.explodeLidY);
        cur.exIceY = dampVal(cur.exIceY, tgt.explodeIceY);
        cur.exDiffY = dampVal(cur.exDiffY, tgt.explodeDiffuserY);
        cur.exDoorZ = dampVal(cur.exDoorZ, tgt.explodeDoorZ);
        cur.exTrayTopZ = dampVal(cur.exTrayTopZ, tgt.explodeTrayTopZ);
        cur.exTrayBotZ = dampVal(cur.exTrayBotZ, tgt.explodeTrayBottomZ);
        cur.exPadY = dampVal(cur.exPadY, tgt.explodePadY);

        caixaMAssembly.topLidPivot.rotation.x = cur.topLidAngle;
        caixaMAssembly.topLidPivot.position.y = 3.0 + cur.exLidY;

        caixaMAssembly.frontDoorPivot.rotation.y = cur.frontDoorAngle;
        caixaMAssembly.frontDoorPivot.position.z = 2.5 + cur.exDoorZ;

        caixaMAssembly.trayTopGroup.position.z = cur.trayPull + cur.exTrayTopZ;
        caixaMAssembly.trayBottomGroup.position.z = cur.trayPull * 0.48 + cur.exTrayBotZ;

        caixaMAssembly.icePackGroup.position.y = cur.iceLift + cur.exIceY;
        caixaMAssembly.diffuserGroup.position.y = cur.exDiffY;
        caixaMAssembly.padGroup.position.y = cur.exPadY;

        caixaMAssembly.co2TabMesh.position.z = 0.72 + cur.co2Pull;
        caixaMAssembly.co2AuraMesh.visible = mech.co2Active;

        for (const latch of caixaMAssembly.topLatches) {
          latch.rotation.x = cur.topLatch;
        }
        for (const latch of caixaMAssembly.frontLatches) {
          latch.rotation.y = cur.frontLatch;
        }

        caixaMAssembly.stackedBoxGroup.position.y = cur.stackY;
        caixaMAssembly.stackedBoxGroup.visible = tgt.stackedBoxVisible || cur.stackY < 6.2;

        caixaMAssembly.setCutaway(mech.cutawaySide);

        const interiorVisible =
          mech.frontDoorOpen || mech.topLidOpen || mech.cutawaySide || mech.explodeAmount > 0.08;
        caixaMAssembly.airflowGroup.visible = mech.showAirflow && interiorVisible;

        if (caixaMAssembly.airflowGroup.visible) {
          airflowClock += dt;
          const phase = (airflowClock * 0.85) % 1;
          caixaMAssembly.coldArrows.forEach((arrow, i) => {
            const p = (phase + i * 0.33) % 1;
            arrow.position.y = 2.02 - p * 1.25;
          });
          caixaMAssembly.warmArrows.forEach((arrow, i) => {
            const p = (phase + i * 0.25) % 1;
            arrow.position.y = 0.78 + p * 1.42;
          });
          if (!isSoftwareGl) {
            stillMoving = true;
          }
        }
      } else if (ctx?.family) {
        const famMoving = ctx.family.step(
          {
            frontDoorOpen: mech.frontDoorOpen,
            topLidOpen: mech.topLidOpen,
            co2Active: mech.co2Active,
          },
          dt,
          isSoftwareGl,
        );
        if (famMoving) stillMoving = true;
      }

      if (cameraGoalRef.current.active) {
        _camTargetPos.set(...cameraGoalRef.current.pos);
        _camLookTarget.set(...cameraGoalRef.current.target);
        const factor = 1 - Math.exp(-(isSoftwareGl ? 16 : 8) * dt);
        camera.position.lerp(_camTargetPos, factor);
        controls.target.lerp(_camLookTarget, factor);
        if (
          camera.position.distanceTo(_camTargetPos) < 0.04 &&
          controls.target.distanceTo(_camLookTarget) < 0.04
        ) {
          camera.position.copy(_camTargetPos);
          controls.target.copy(_camLookTarget);
          cameraGoalRef.current.active = false;
        } else {
          stillMoving = true;
        }
      }

      controls.update();
      return stillMoving;
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        renderDirty = false;
        const keepGoing = stepScene(now);
        renderer.render(scene, camera);
        if (container && sceneContextRef.current?.mountedProductId) {
          container.dataset.renderedProduct = sceneContextRef.current.mountedProductId;
        }

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || keepGoing)) {
            requestRender();
          }
        };
        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    requestRenderRef.current = requestRender;

    // Mount initial selected product right away
    mountProductModel(selectedProductRef.current);

    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      sceneContextRef.current?.caixaM?.dispose();
      sceneContextRef.current?.family?.dispose();
      sceneContextRef.current = null;
      envTex.dispose();
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  // Swap product assembly instantaneously without tearing down WebGLRenderer
  useEffect(() => {
    selectedProductRef.current = selectedProductId;
    if (sceneContextRef.current) {
      mountProductModel(selectedProductId);
    }
  }, [selectedProductId]);

  const handlePresetClick = (preset: CameraPreset) => {
    selectPreset(preset);
    if (isCaixaM) {
      if (preset.id === 'stack' && !mechanism.isStacked) {
        onMechanismChange({ isStacked: true, frontDoorOpen: true, pullTray: true });
      } else if (preset.id === 'top' && !mechanism.topLidOpen) {
        onMechanismChange({ topLidOpen: true, isStacked: false });
      } else if (preset.id === 'front' && !mechanism.frontDoorOpen) {
        onMechanismChange({ frontDoorOpen: true });
      }
    } else if (preset.id === 'front' && !mechanism.frontDoorOpen) {
      onMechanismChange({ frontDoorOpen: true });
    }
  };

  const handleFamilyPreset = (key: 'hero' | 'front' | 'side') => {
    const cams = familyCamerasRef.current;
    if (!cams) return;
    setActivePreset(key);
    cameraGoalRef.current = {
      pos: cams[key].pos,
      target: cams[key].target,
      active: true,
    };
    if (key === 'front' && !mechanism.frontDoorOpen) {
      onMechanismChange({ frontDoorOpen: true });
    }
    requestRenderRef.current();
  };

  const activeStateSummary = isCaixaM
    ? [
        mechanism.isStacked ? 'Empilhamento 4 cantos L ativo' : null,
        mechanism.topLidOpen ? 'Tampa superior aberta' : null,
        mechanism.frontDoorOpen ? 'Porta lateral aberta' : null,
        mechanism.pullTray ? 'Gaveta deslizada' : null,
        mechanism.co2Active ? 'CO₂ ativo (10–21 dias)' : 'Frio padrão (5–10 dias)',
      ]
        .filter(Boolean)
        .join(' · ')
    : [
        activeProduct.externalDimensions,
        mechanism.frontDoorOpen
          ? isDoubleDoor
            ? 'Portas duplas laterais abertas'
            : 'Porta lateral aberta'
          : 'Porta lateral fechada',
        mechanism.co2Active ? 'CO₂ ativo' : 'Frio padrão',
      ].join(' · ');

  return (
    <section
      aria-label={`Estúdio 3D Interativo FreshBerrys — ${activeProduct.name}`}
      className="relative w-full h-[calc(100vh-65px)] min-h-[620px] overflow-hidden bg-[#edf1e7]"
      data-testid="studio-3d-viewport"
      data-product={selectedProductId}
      data-top-lid={mechanism.topLidOpen ? 'open' : 'closed'}
      data-front-door={mechanism.frontDoorOpen ? 'open' : 'closed'}
      data-stacked={mechanism.isStacked ? 'true' : 'false'}
      data-explode={mechanism.explodeAmount.toFixed(2)}
    >
      {/* Isolated WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Graceful Fallback if WebGL fails */}
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#edf1e7] p-8">
          <div className="max-w-xl w-full bg-white border border-[#dce3d4] rounded-2xl p-6 text-center">
            <img
              src={activeProduct.renderSrc || GENERATED_RENDERS.caixaMOpen}
              alt={activeProduct.renderAlt}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg font-semibold text-[#142010]">
              Visualização 3D indisponível neste dispositivo
            </h2>
            <p className="text-sm text-[#4b5a45] mt-1">
              Explore os renders industriais completos na aba Linha FreshBerrys.
            </p>
          </div>
        </div>
      )}

      {/* Top-Left Spec Header */}
      <div className="pointer-events-none absolute top-4 left-5 z-10 max-w-md">
        <p className="text-xs font-medium text-[#4b5a45] tracking-normal">
          Linha FreshBerrys · {activeProduct.externalDimensions} · {activeProduct.roleTag}
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-[#142010] leading-tight mt-0.5">
          {activeProduct.name}
        </h1>
        <p className="text-xs text-[#4b5a45] mt-1 font-mono tabular-nums">
          {activeStateSummary}
        </p>
      </div>

      {/* Top-Right Compact 5-Product Switcher */}
      <div
        role="tablist"
        aria-label="Trocar equipamento no Estúdio 3D"
        className="absolute top-4 right-5 z-10 flex flex-wrap justify-end gap-1.5 bg-white border border-[#cfd9c4] rounded-xl p-1.5 shadow-sm max-w-md"
      >
        {FRESHLOG_PRODUCTS.map((prod) => {
          const selected = prod.id === selectedProductId;
          return (
            <button
              key={prod.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelectProduct(prod.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selected
                  ? 'bg-[#1d4c0b] text-[#b9fc12]'
                  : 'text-[#4b5a45] hover:bg-[#f4f7ef] hover:text-[#142010]'
              }`}
            >
              {prod.shortName}
            </button>
          );
        })}
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
      <div className="pointer-events-none fixed md:absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
        <div
          className="pointer-events-auto w-full max-w-[1020px] transition-transform duration-200 ease-out"
          style={{
            transform: dockExpanded ? 'translateY(0)' : 'translateY(calc(100% - 34px))',
          }}
        >
          {/* Collapse / Expand Handle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setDockExpanded((v) => !v)}
              aria-expanded={dockExpanded}
              aria-label={dockExpanded ? 'Ocultar controles 3D' : 'Mostrar controles 3D'}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl bg-[#1d4c0b] text-[#f4fccf] text-xs font-medium hover:bg-[#133407] transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              {dockExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ocultar Controles</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mostrar Controles 3D</span>
                </>
              )}
            </button>
          </div>

          {/* Main Dock Body */}
          <div className="bg-white border border-[#cfd9c4] rounded-2xl shadow-lg p-3.5 md:p-4">
            {/* Row 1: Mechanical Articulation Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {(isCaixaM || isCaixaP) && (
                <button
                  type="button"
                  onClick={() => onMechanismChange({ topLidOpen: !mechanism.topLidOpen })}
                  aria-pressed={mechanism.topLidOpen}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mechanism.topLidOpen
                      ? 'bg-[#1d4c0b] text-[#b9fc12]'
                      : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                  }`}
                >
                  <PackageOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {mechanism.topLidOpen ? 'Fechar Tampa Superior' : 'Abrir Tampa Superior'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onMechanismChange({ frontDoorOpen: !mechanism.frontDoorOpen })}
                aria-pressed={mechanism.frontDoorOpen}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  mechanism.frontDoorOpen
                    ? 'bg-[#1d4c0b] text-[#b9fc12]'
                    : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {mechanism.frontDoorOpen
                    ? isDoubleDoor
                      ? 'Fechar Portas Duplas'
                      : 'Fechar Porta Lateral'
                    : isDoubleDoor
                      ? 'Abrir Portas Duplas'
                      : 'Abrir Porta Lateral'}
                </span>
              </button>

              {isCaixaM && (
                <>
                  <button
                    type="button"
                    onClick={() => onMechanismChange({ pullTray: !mechanism.pullTray })}
                    aria-pressed={mechanism.pullTray}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mechanism.pullTray
                        ? 'bg-[#b9fc12] text-[#142010]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    <span>{mechanism.pullTray ? 'Recolher Gaveta' : 'Puxar Gaveta de Frutas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onMechanismChange({ swapIcePacks: !mechanism.swapIcePacks })}
                    aria-pressed={mechanism.swapIcePacks}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mechanism.swapIcePacks
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Trocar Cartuchos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onMechanismChange({ isStacked: !mechanism.isStacked })}
                    aria-pressed={mechanism.isStacked}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mechanism.isStacked
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Empilhar 2ª Caixa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onMechanismChange({ cutawaySide: !mechanism.cutawaySide })}
                    aria-pressed={mechanism.cutawaySide}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mechanism.cutawaySide
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Corte Lateral</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onMechanismChange({ showAirflow: !mechanism.showAirflow })}
                    aria-pressed={mechanism.showAirflow}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mechanism.showAirflow
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Fluxo Térmico</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => onMechanismChange({ co2Active: !mechanism.co2Active })}
                aria-pressed={mechanism.co2Active}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  mechanism.co2Active
                    ? 'bg-[#f4fccf] text-[#1d4c0b] border border-[#1d4c0b]/30'
                    : 'bg-[#f4f7ef] text-[#4b5a45] hover:bg-[#e8efe0]'
                }`}
              >
                <span>CO₂: {mechanism.co2Active ? 'Ativo' : 'Opcional'}</span>
              </button>
            </div>

            {/* Hairline Divider */}
            <div className="my-3 border-t border-[#e4eadc]" />

            {/* Row 2: Exploded View Slider (Caixa M) or Spec Summary + Camera Presets + Reset */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {isCaixaM ? (
                <div className="flex items-center gap-2.5 shrink-0">
                  <label
                    htmlFor="explode-slider"
                    className="text-xs font-semibold text-[#142010] whitespace-nowrap"
                  >
                    Vista Explodida
                  </label>
                  <input
                    id="explode-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(mechanism.explodeAmount * 100)}
                    onChange={(e) =>
                      onMechanismChange({ explodeAmount: Number(e.target.value) / 100 })
                    }
                    className="fresh-slider w-24 md:w-32"
                  />
                  <span className="text-xs font-mono tabular-nums text-[#4b5a45] w-8 text-right">
                    {Math.round(mechanism.explodeAmount * 100)}%
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#4b5a45] truncate">
                  <strong className="text-[#142010]">{activeProduct.fruitCapacity}</strong> ·{' '}
                  {activeProduct.iceAndAutonomy}
                </p>
              )}

              {/* Camera Angle Presets */}
              <div className="flex items-center gap-1 flex-wrap md:flex-nowrap justify-end">
                <span className="text-xs text-[#4b5a45] mr-1 hidden lg:inline whitespace-nowrap">
                  Câmera:
                </span>

                {isCaixaM ? (
                  CAIXA_M_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        activePreset === preset.id
                          ? 'bg-[#1d4c0b] text-white'
                          : 'text-[#4b5a45] hover:bg-[#f4f7ef] hover:text-[#142010]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))
                ) : (
                  <>
                    {(
                      [
                        ['hero', '3/4 Geral'],
                        ['front', isDoubleDoor ? 'Portas Duplas' : 'Porta Lateral'],
                        ['side', 'Vista Lateral'],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleFamilyPreset(id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          activePreset === id
                            ? 'bg-[#1d4c0b] text-white'
                            : 'text-[#4b5a45] hover:bg-[#f4f7ef] hover:text-[#142010]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onResetMechanism();
                    if (isCaixaM) {
                      selectPreset(CAIXA_M_PRESETS[0]);
                    } else {
                      handleFamilyPreset('hero');
                    }
                  }}
                  aria-label="Resetar visualização 3D"
                  className="ml-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#4b5a45] hover:text-[#142010] hover:bg-[#f4f7ef] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Resetar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
