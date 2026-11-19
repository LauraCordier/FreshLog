export type BerryType = 'mirtilo' | 'morango' | 'misto' | 'framboesa';
export type ProductModelId =
  | 'caixa-m'
  | 'caixa-p'
  | 'base-rodizios'
  | 'meio-palete'
  | 'conteiner-palete';

export interface BoxMechanismState {
  topLidOpen: boolean;
  frontDoorOpen: boolean;
  pullTray: boolean;
  swapIcePacks: boolean;
  co2Active: boolean;
  isStacked: boolean;
  cutawaySide: boolean;
  showAirflow: boolean;
  explodeAmount: number; // 0 to 1
}

export interface BoxKinematicsTargets {
  topLidAngleRad: number;
  frontDoorAngleRad: number;
  trayPullOffset: number;
  icePackLiftY: number;
  co2TabPullOffset: number;
  topLatchAngleRad: number;
  frontLatchAngleRad: number;
  stackedBoxY: number;
  stackedBoxVisible: boolean;
  explodeLidY: number;
  explodeIceY: number;
  explodeDiffuserY: number;
  explodeDoorZ: number;
  explodeTrayTopZ: number;
  explodeTrayBottomZ: number;
  explodePadY: number;
}

export interface BerryDegradationInput {
  tempC: number; // 0 to 30 °C
  roadVibration: boolean; // +50% wear/respiration acceleration
  thermalCyclingSweat: boolean; // "esquenta e esfria" condensation
  co2Atmosphere: boolean; // 10-15% CO2 doubles shelf life when < 5°C & dry
}

export interface BerryDegradationResult {
  respirationMultiplier: number; // 1.0x at 2°C up to ~10.0x at 20°C+
  estimatedShelfLifeDays: number;
  hourlyQualityLossPct: number;
  moldRisk: 'baixo' | 'moderado' | 'critico';
  moldRiskLabel: string;
  headlineInsight: string;
}

export interface ColdChainSpecInput {
  fruitKg: number;
  co2Enabled: boolean;
  ambientTempC: number;
  iceCartridgeKg: number; // default 4 kg (2 x 2 kg)
}

export interface ColdChainMetrics {
  tareWeightKg: number;
  totalLoadedWeightKg: number;
  roadAutonomyHours: number;
  internalTempRangeC: [number, number];
  shelfLifeMinDays: number;
  shelfLifeMaxDays: number;
  condensationRisk: 'zero-contato' | 'controlado';
  twoHandLiftCompliant: boolean;
}

export interface TripROIInput {
  berryType: BerryType;
  fruitKgPerBox: number;
  tripRentalBrl: number; // R$ 5 to R$ 12
  shopDays: number; // 0 to 7 days in patisserie/cafe
  dailyShopFeeBrl: number; // R$ 1 to R$ 2.50
  monthlyTrips: number;
}

export interface TripROIResult {
  fruitPricePerKgBrl: number;
  cargoValueBrl: number;
  totalBoxCostBrl: number;
  spoilageWithoutBoxPct: number;
  spoilageWithBoxPct: number;
  savedFruitKg: number;
  savedValueBrl: number;
  netGainPerTripBrl: number;
  breakEvenGrams: number;
  roiMultiplier: number;
  monthlyNetSavingsBrl: number;
}

export interface TelemetryPoint {
  hour: number;
  label: string;
  internalTempC: number;
  externalTempC: number;
  humidityPct: number;
  location: string;
}

export interface TripCertificate {
  certificateId: string;
  batchCode: string;
  origin: string;
  destination: string;
  productSummary: string;
  weightKg: number;
  co2Atmosphere: boolean;
  minTempC: number;
  maxTempC: number;
  avgTempC: number;
  durationHours: number;
  compliantUnder5C: boolean;
  shelfLifeEstimateDays: string;
  sensorModel: string;
  lidOpenCount: number;
  vibrationStatus: string;
  bluetoothSyncNote: string;
  verifiedAt: string;
  telemetry: TelemetryPoint[];
}

export const BERRY_PROFILES: Record<
  BerryType,
  {
    label: string;
    pricePerKgBrl: number;
    dryVanLossPct: number;
    freshBerrysLossPct: number;
  }
> = {
  framboesa: {
    label: 'Framboesa / Amora (Serra da Mantiqueira)',
    pricePerKgBrl: 48,
    dryVanLossPct: 0.22,
    freshBerrysLossPct: 0.03,
  },
  mirtilo: {
    label: 'Mirtilo Premium',
    pricePerKgBrl: 42,
    dryVanLossPct: 0.19,
    freshBerrysLossPct: 0.02,
  },
  morango: {
    label: 'Morango Premium (Sul de Minas / Atibaia)',
    pricePerKgBrl: 24,
    dryVanLossPct: 0.24,
    freshBerrysLossPct: 0.03,
  },
  misto: {
    label: 'Carga Mista (Morango + Mirtilo)',
    pricePerKgBrl: 33.33,
    dryVanLossPct: 0.21,
    freshBerrysLossPct: 0.025,
  },
};

export const BOX_DIMENSIONS_CM = {
  length: 60,
  depth: 50,
  height: 35,
  wallInsulationMm: 40,
  capacityKg: 9,
  icePacksCount: 2,
  icePackUnitKg: 2,
  tareKg: 6.5, // Aligned with PDF p. 9 (~6,5 kg vazia; ~20 kg cheia com cumbucas)
} as const;

/**
 * Embrapa / UC post-harvest berry physiological degradation model:
 * - 70% of conservation depends on temperature.
 * - At 20 °C berries respire and age ~10x faster than near 0-2 °C, losing ~half shelf life per +10 °C.
 * - Vehicle vibration accelerates wear by +50%.
 * - Above 5 °C or with thermal cycling condensation ("esquenta e esfria"), aggressive gray mold awakens.
 * - Held < 5 °C + dry + optional 10-15% CO2 doubles shelf life from 5-10 to 10-21 days.
 */
export function simulateBerryDegradation(
  input: BerryDegradationInput,
): BerryDegradationResult {
  const temp = Math.max(0, Math.min(30, input.tempC));

  // Calibrated exponential curve: 1.0x at 2°C -> ~10.0x at 20°C
  const baseTempMultiplier = Math.pow(10, Math.max(0, temp - 2) / 18);
  const vibrationFactor = input.roadVibration ? 1.5 : 1.0;
  const respirationMultiplier = Number((baseTempMultiplier * vibrationFactor).toFixed(1));

  // Shelf life baseline: 10 days at 0-2°C dry without CO2; halves every +10°C
  let shelfLife = 10 / Math.pow(2, Math.max(0, temp - 2) / 10);

  if (input.roadVibration) {
    shelfLife = shelfLife / 1.5;
  }

  if (input.thermalCyclingSweat) {
    shelfLife = shelfLife * 0.65;
  }

  // CO2 protection (10-15%) doubles shelf life (10-21 days) only when kept cold (<5°C) & dry
  if (input.co2Atmosphere && temp <= 5 && !input.thermalCyclingSweat) {
    shelfLife = shelfLife * 2.0;
  } else if (input.co2Atmosphere && temp <= 10) {
    shelfLife = shelfLife * 1.25;
  }

  const estimatedShelfLifeDays = Number(Math.max(0.8, Math.min(21, shelfLife)).toFixed(1));

  // Hourly marketable fruit loss (~5%/hour in hot delay conditions per Embrapa / PDF p. 1-3)
  const hourlyQualityLossPct =
    temp <= 5 && !input.thermalCyclingSweat
      ? 0.2
      : Number(
          Math.min(
            9.5,
            ((temp - 4) / 16) * 5.0 * vibrationFactor + (input.thermalCyclingSweat ? 1.5 : 0),
          ).toFixed(1),
        );

  let moldRisk: 'baixo' | 'moderado' | 'critico' = 'baixo';
  let moldRiskLabel = 'Controlado (< 5 °C · carga seca)';
  let headlineInsight =
    'Cadeia fria travada abaixo de 5 °C e sem condensação: fungos dormentes e validade máxima preservada.';

  if (temp > 5 && (input.thermalCyclingSweat || temp >= 14)) {
    moldRisk = 'critico';
    moldRiskLabel = 'Crítico — fungos despertam e liquefazem a fruta';
    headlineInsight =
      'Acima de 5 °C com calor e umidade livre, o mofo cinzento desperta no trajeto e estoura na loja em 24 h.';
  } else if (temp > 5 || input.thermalCyclingSweat) {
    moldRisk = 'moderado';
    moldRiskLabel = 'Elevado — quebra térmica acelera mofo';
    headlineInsight =
      'Variação térmica ou suor na cumbuca cria água livre; sem fungicida pós-colheita permitido no Brasil, a margem evapora.';
  }

  return {
    respirationMultiplier,
    estimatedShelfLifeDays,
    hourlyQualityLossPct,
    moldRisk,
    moldRiskLabel,
    headlineInsight,
  };
}

export function normalizeMechanismState(
  prev: BoxMechanismState,
  patch: Partial<BoxMechanismState>,
): BoxMechanismState {
  const next: BoxMechanismState = {
    ...prev,
    ...patch,
    explodeAmount: Math.max(0, Math.min(1, patch.explodeAmount ?? prev.explodeAmount)),
  };

  if (patch.isStacked === true) {
    next.topLidOpen = false;
    next.swapIcePacks = false;
    next.explodeAmount = 0;
  }

  if (patch.topLidOpen === true || patch.swapIcePacks === true) {
    next.isStacked = false;
    if (patch.swapIcePacks === true) {
      next.topLidOpen = true;
    }
  }

  if (patch.topLidOpen === false) {
    next.swapIcePacks = false;
  }

  if (patch.pullTray === true) {
    next.frontDoorOpen = true;
  }

  if (patch.frontDoorOpen === false) {
    next.pullTray = false;
  }

  if (patch.explodeAmount !== undefined && patch.explodeAmount > 0.02) {
    next.isStacked = false;
  }

  return next;
}

export function computeBoxKinematics(state: BoxMechanismState): BoxKinematicsTargets {
  const ex = Math.max(0, Math.min(1, state.explodeAmount));
  const topOpen = state.topLidOpen && !state.isStacked;
  const frontOpen = state.frontDoorOpen;

  return {
    topLidAngleRad: topOpen ? -Math.PI * 0.44 : 0,
    frontDoorAngleRad: frontOpen ? Math.PI * 0.58 : 0,
    trayPullOffset: state.pullTray && frontOpen ? 1.85 : 0,
    icePackLiftY: state.swapIcePacks && topOpen ? 1.35 : 0,
    co2TabPullOffset: state.co2Active ? 0.28 : 0,
    topLatchAngleRad: topOpen ? 0.85 : 0,
    frontLatchAngleRad: frontOpen ? -0.9 : 0,
    stackedBoxY: state.isStacked ? 3.46 : 6.4,
    stackedBoxVisible: state.isStacked,
    explodeLidY: ex * 1.9,
    explodeIceY: ex * 1.15,
    explodeDiffuserY: ex * 0.55,
    explodeDoorZ: ex * 1.65,
    explodeTrayTopZ: ex * 1.05,
    explodeTrayBottomZ: ex * 0.65,
    explodePadY: ex * -0.65,
  };
}

export function calculateColdChainMetrics(input: ColdChainSpecInput): ColdChainMetrics {
  const clampedFruit = Math.max(1, Math.min(15, input.fruitKg));
  const clampedIce = Math.max(2, Math.min(6, input.iceCartridgeKg));
  const clampedAmbient = Math.max(10, Math.min(42, input.ambientTempC));

  const tareWeightKg = BOX_DIMENSIONS_CM.tareKg;
  const totalLoadedWeightKg = Number((tareWeightKg + clampedIce + clampedFruit).toFixed(1));

  // PDF p. 9 & 13: ~12-14 h at 30°C with 4 kg (2x2kg) PCM ice; +20% at 25°C, -15% at 35°C
  const deltaT = Math.max(8, clampedAmbient - 3);
  const referenceDeltaT = 27; // 30°C ambient - 3°C interior
  const autonomyRaw = 13 * (clampedIce / 4) * (referenceDeltaT / deltaT);
  const roadAutonomyHours = Number(Math.max(6, Math.min(24, autonomyRaw)).toFixed(1));

  const shelfLifeMinDays = input.co2Enabled ? 10 : 5;
  const shelfLifeMaxDays = input.co2Enabled ? 21 : 10;

  return {
    tareWeightKg,
    totalLoadedWeightKg,
    roadAutonomyHours,
    internalTempRangeC: [1.5, 4.4],
    shelfLifeMinDays,
    shelfLifeMaxDays,
    condensationRisk: 'zero-contato',
    twoHandLiftCompliant: totalLoadedWeightKg <= 23,
  };
}

export function calculateTripROI(input: TripROIInput): TripROIResult {
  const profile = BERRY_PROFILES[input.berryType];
  const kg = Math.max(1, Math.min(12, input.fruitKgPerBox));
  const tripFee = Math.max(3, Math.min(15, input.tripRentalBrl));
  const shopDays = Math.max(0, Math.min(10, input.shopDays));
  const dailyFee = Math.max(0.5, Math.min(5, input.dailyShopFeeBrl));
  const trips = Math.max(1, Math.min(500, input.monthlyTrips));

  const cargoValueBrl = Number((kg * profile.pricePerKgBrl).toFixed(2));
  const totalBoxCostBrl = Number((tripFee + shopDays * dailyFee).toFixed(2));

  const shopSpoilageBonus = shopDays * 0.015;
  const spoilageWithout = Math.min(0.42, profile.dryVanLossPct + shopSpoilageBonus);
  const spoilageWith = profile.freshBerrysLossPct;

  const savedFruitKg = Number((kg * (spoilageWithout - spoilageWith)).toFixed(2));
  const savedValueBrl = Number((savedFruitKg * profile.pricePerKgBrl).toFixed(2));
  const netGainPerTripBrl = Number((savedValueBrl - totalBoxCostBrl).toFixed(2));
  const breakEvenGrams = Math.round((totalBoxCostBrl / profile.pricePerKgBrl) * 1000);
  const roiMultiplier =
    totalBoxCostBrl > 0 ? Number((savedValueBrl / totalBoxCostBrl).toFixed(1)) : 0;
  const monthlyNetSavingsBrl = Number((netGainPerTripBrl * trips).toFixed(2));

  return {
    fruitPricePerKgBrl: profile.pricePerKgBrl,
    cargoValueBrl,
    totalBoxCostBrl,
    spoilageWithoutBoxPct: Math.round(spoilageWithout * 100),
    spoilageWithBoxPct: Math.round(spoilageWith * 100),
    savedFruitKg,
    savedValueBrl,
    netGainPerTripBrl,
    breakEvenGrams,
    roiMultiplier,
    monthlyNetSavingsBrl,
  };
}

export function generateTripCertificateData(
  route: 'sul-de-minas' | 'atibaia',
  co2Enabled: boolean,
): TripCertificate {
  const isMinas = route === 'sul-de-minas';
  const telemetry: TelemetryPoint[] = isMinas
    ? [
        { hour: 0, label: '04:00', internalTempC: 2.0, externalTempC: 17.5, humidityPct: 78, location: 'Pouso Alegre (MG) — Câmara Fria Fazenda' },
        { hour: 2, label: '06:00', internalTempC: 2.3, externalTempC: 19.2, humidityPct: 79, location: 'BR-381 Fernão Dias — Baú Seco' },
        { hour: 4, label: '08:00', internalTempC: 2.6, externalTempC: 24.0, humidityPct: 80, location: 'Extrema (MG) — Troca de Docas' },
        { hour: 6, label: '10:00', internalTempC: 2.9, externalTempC: 28.4, humidityPct: 81, location: 'Atibaia (SP) — Distribuição Regional' },
        { hour: 8, label: '12:00', internalTempC: 3.3, externalTempC: 31.2, humidityPct: 81, location: 'Marginal Tietê — Trânsito Urbano' },
        { hour: 10, label: '14:00', internalTempC: 3.6, externalTempC: 30.1, humidityPct: 82, location: 'Pinheiros (SP) — Entrega Confeitaria' },
        { hour: 12, label: '16:00', internalTempC: 3.9, externalTempC: 27.6, humidityPct: 82, location: 'Em uso no balcão (Porta frontal lateral)' },
      ]
    : [
        { hour: 0, label: '05:30', internalTempC: 1.9, externalTempC: 18.0, humidityPct: 77, location: 'Atibaia (SP) — Sítio Produtor' },
        { hour: 2, label: '07:30', internalTempC: 2.2, externalTempC: 21.8, humidityPct: 78, location: 'Rod. Fernão Dias — Van Seca' },
        { hour: 4, label: '09:30', internalTempC: 2.5, externalTempC: 26.5, humidityPct: 79, location: 'CEAGESP / Doca Distribuidor' },
        { hour: 6, label: '11:30', internalTempC: 2.8, externalTempC: 29.8, humidityPct: 80, location: 'Rota Jardins — Entrega Empório' },
        { hour: 8, label: '13:30', internalTempC: 3.1, externalTempC: 31.0, humidityPct: 80, location: 'Vila Madalena — Cafeteria' },
        { hour: 10, label: '15:30', internalTempC: 3.4, externalTempC: 28.5, humidityPct: 81, location: 'Armazenamento em loja sem câmara' },
        { hour: 12, label: '17:30', internalTempC: 3.7, externalTempC: 25.9, humidityPct: 81, location: 'Pronto para troca de cartuchos PCM' },
      ];

  const temps = telemetry.map((t) => t.internalTempC);
  const minTempC = Math.min(...temps);
  const maxTempC = Math.max(...temps);
  const avgTempC = Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1));

  return {
    certificateId: isMinas ? 'FL-FB26-MG841' : 'FL-FB26-AT309',
    batchCode: isMinas ? 'LOTE-SM-09KG-A2' : 'LOTE-AT-09KG-B7',
    origin: isMinas ? 'Pouso Alegre, Sul de Minas (MG)' : 'Atibaia, Cinturão Verde (SP)',
    destination: isMinas ? 'Pinheiros, São Paulo (SP)' : 'Vila Madalena, São Paulo (SP)',
    productSummary: 'Framboesa + Mirtilo + Morango Premium (Cumbucas PET)',
    weightKg: 9,
    co2Atmosphere: co2Enabled,
    minTempC,
    maxTempC,
    avgTempC,
    durationHours: 12,
    compliantUnder5C: maxTempC < 5.0,
    shelfLifeEstimateDays: co2Enabled ? '10–21 dias (CO₂ 10–15% ativo)' : '5–10 dias (frio padrão)',
    sensorModel: 'ESP32-C3 + SHT40 + LIS3DH (Leitura a cada 5 min)',
    lidOpenCount: 0,
    vibrationStatus: 'Controlada · 0,38 g (sem impactos críticos)',
    bluetoothSyncNote: 'Gravado offline na estrada · descarregado via Bluetooth (~10 m)',
    verifiedAt: '19/11/2026 · 16:04 BRT',
    telemetry,
  };
}
