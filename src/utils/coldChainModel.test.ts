import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateColdChainMetrics,
  calculateTripROI,
  computeBoxKinematics,
  generateTripCertificateData,
  normalizeMechanismState,
  simulateBerryDegradation,
  type BoxMechanismState,
} from './coldChainModel';
import {
  CAIXA_M_MANUAL_COMPONENTS,
  CAIXA_M_MANUAL_GUIDES,
  FRESHLOG_PRODUCTS,
  FREIGHT_COMPARISON_360KG,
} from '../data/freshBerrysData';

const BASE_STATE: BoxMechanismState = {
  topLidOpen: false,
  frontDoorOpen: false,
  pullTray: false,
  swapIcePacks: false,
  co2Active: true,
  isStacked: false,
  cutawaySide: false,
  showAirflow: true,
  explodeAmount: 0,
};

test('pulling berry tray automatically opens side-hinged front insulated door', () => {
  const next = normalizeMechanismState(BASE_STATE, { pullTray: true });
  assert.equal(next.frontDoorOpen, true);
  assert.equal(next.pullTray, true);

  const kin = computeBoxKinematics(next);
  assert.ok(kin.frontDoorAngleRad > 1.0, 'side-hinged front door should swing open');
  assert.ok(kin.trayPullOffset > 1.0, 'berry tray should glide forward');
});

test('stacking a 2nd box locks top lid closed while side-hinged front door stays operable', () => {
  const openedBoth = normalizeMechanismState(BASE_STATE, {
    topLidOpen: true,
    frontDoorOpen: true,
    pullTray: true,
  });
  const stacked = normalizeMechanismState(openedBoth, { isStacked: true });

  assert.equal(stacked.isStacked, true);
  assert.equal(stacked.topLidOpen, false, 'top lid must close when stacked');
  assert.equal(stacked.frontDoorOpen, true, 'front door remains open while stacked');
  assert.equal(stacked.pullTray, true, 'tray remains accessible while stacked');

  const kin = computeBoxKinematics(stacked);
  assert.equal(kin.topLidAngleRad, 0);
  assert.ok(kin.frontDoorAngleRad > 1.0);
  assert.equal(kin.stackedBoxVisible, true);
});

test('Embrapa/UC berry degradation model reflects 10x respiration at 20C and +50% vibration', () => {
  const coldDryCo2 = simulateBerryDegradation({
    tempC: 2,
    roadVibration: false,
    thermalCyclingSweat: false,
    co2Atmosphere: true,
  });
  const hot20CNoVib = simulateBerryDegradation({
    tempC: 20,
    roadVibration: false,
    thermalCyclingSweat: false,
    co2Atmosphere: false,
  });
  const hot20CWithVib = simulateBerryDegradation({
    tempC: 20,
    roadVibration: true,
    thermalCyclingSweat: true,
    co2Atmosphere: false,
  });

  assert.equal(coldDryCo2.respirationMultiplier, 1);
  assert.ok(coldDryCo2.estimatedShelfLifeDays >= 18, 'Cold + dry + CO2 should reach ~20 days');
  assert.equal(coldDryCo2.moldRisk, 'baixo');

  assert.equal(hot20CNoVib.respirationMultiplier, 10);
  assert.equal(hot20CWithVib.respirationMultiplier, 15);
  assert.equal(hot20CWithVib.moldRisk, 'critico');
  assert.ok(hot20CWithVib.estimatedShelfLifeDays <= 2.5);
});

test('5-product catalog includes all requested PDF products and strictly excludes Capa térmica de palete', () => {
  assert.equal(FRESHLOG_PRODUCTS.length, 5);
  const ids = FRESHLOG_PRODUCTS.map((p) => p.id);
  assert.deepEqual(ids, [
    'caixa-p',
    'caixa-m',
    'base-rodizios',
    'meio-palete',
    'conteiner-palete',
  ]);
  const serialized = JSON.stringify(FRESHLOG_PRODUCTS).toLowerCase();
  assert.equal(serialized.includes('capa térmica'), false, 'Capa térmica must be excluded');
  assert.equal(serialized.includes('capa de palete'), false, 'Capa de palete must be excluded');
  assert.equal(FREIGHT_COMPARISON_360KG.length, 5);
});

test('cold chain metrics and ROI validate PDF numbers and <5C digital certificate', () => {
  const withCo2 = calculateColdChainMetrics({
    fruitKg: 9,
    co2Enabled: true,
    ambientTempC: 30,
    iceCartridgeKg: 4,
  });
  assert.equal(withCo2.roadAutonomyHours, 13);
  assert.equal(withCo2.shelfLifeMinDays, 10);
  assert.equal(withCo2.shelfLifeMaxDays, 21);

  const roi = calculateTripROI({
    berryType: 'mirtilo',
    fruitKgPerBox: 9,
    tripRentalBrl: 7,
    shopDays: 0,
    dailyShopFeeBrl: 1.5,
    monthlyTrips: 20,
  });
  assert.ok(roi.breakEvenGrams <= 250);

  const cert = generateTripCertificateData('sul-de-minas', true);
  assert.equal(cert.compliantUnder5C, true);
  assert.ok(cert.maxTempC < 5.0);
  assert.equal(cert.lidOpenCount, 0);
});

test('Caixa M manual exposes all 12 unique numbered components and Base com Rodízios uses 2 handles', () => {
  assert.equal(CAIXA_M_MANUAL_COMPONENTS.length, 12);
  const codes = CAIXA_M_MANUAL_COMPONENTS.map((c) => c.code);
  assert.deepEqual(codes, ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);

  const openPins = CAIXA_M_MANUAL_COMPONENTS.filter((c) => c.view === 'open');
  const closedPins = CAIXA_M_MANUAL_COMPONENTS.filter((c) => c.view === 'closed');
  assert.ok(openPins.length >= 4 && closedPins.length >= 4);

  for (const comp of CAIXA_M_MANUAL_COMPONENTS) {
    assert.ok(comp.xPct > 5 && comp.xPct < 95, `xPct in bounds for ${comp.code}`);
    assert.ok(comp.yPct > 5 && comp.yPct < 95, `yPct in bounds for ${comp.code}`);
  }
  assert.equal(CAIXA_M_MANUAL_GUIDES.length, 4);

  const dolly = FRESHLOG_PRODUCTS.find((p) => p.id === 'base-rodizios');
  assert.ok(dolly);
  assert.ok(dolly.doorDesign.toLowerCase().includes('2 alças'));
  assert.equal(dolly.doorDesign.toLowerCase().includes('catraca'), false);
});

