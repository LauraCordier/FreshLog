import React, { useMemo, useState } from 'react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { generateTripCertificateData } from '../utils/coldChainModel';

interface DigitalCertificateModalProps {
  open: boolean;
  co2Enabled: boolean;
  onClose: () => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  open,
  co2Enabled,
  onClose,
}) => {
  const [route, setRoute] = useState<'sul-de-minas' | 'atibaia'>('sul-de-minas');

  const cert = useMemo(
    () => generateTripCertificateData(route, co2Enabled),
    [route, co2Enabled],
  );

  if (!open) return null;

  // Build SVG path for internal (<5C) vs external temperature
  const chartW = 540;
  const chartH = 165;
  const padL = 38;
  const padR = 18;
  const padT = 16;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const mapX = (idx: number) =>
    padL + (idx / Math.max(1, cert.telemetry.length - 1)) * innerW;
  const mapY = (tempC: number) => {
    const clamped = Math.max(0, Math.min(35, tempC));
    return padT + innerH - (clamped / 35) * innerH;
  };

  const internalPath = cert.telemetry
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i).toFixed(1)} ${mapY(pt.internalTempC).toFixed(1)}`)
    .join(' ');
  const externalPath = cert.telemetry
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i).toFixed(1)} ${mapY(pt.externalTempC).toFixed(1)}`)
    .join(' ');
  const limit5Y = mapY(5);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#dce3d4] rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Forest Header */}
        <div className="bg-[#1d4c0b] text-white px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-[#b9fc12] tabular-nums">
              {cert.certificateId} · {cert.batchCode}
            </p>
            <h2 id="cert-modal-title" className="text-xl font-bold mt-1">
              Certificado Digital da Viagem — FreshBerrys
            </h2>
            <p className="text-xs text-[#f4fccf]/85 mt-1">
              Leitura instantânea via QR Code da tampa · {cert.sensorModel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar certificado digital"
            className="p-2 rounded-lg text-[#f4fccf] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Route Selector + Compliance Confirmation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 p-1 bg-[#eef2e7] rounded-lg self-start">
              <button
                type="button"
                onClick={() => setRoute('sul-de-minas')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  route === 'sul-de-minas'
                    ? 'bg-[#1d4c0b] text-[#b9fc12]'
                    : 'text-[#4b5a45] hover:text-[#142010]'
                }`}
              >
                Sul de Minas → SP
              </button>
              <button
                type="button"
                onClick={() => setRoute('atibaia')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  route === 'atibaia'
                    ? 'bg-[#1d4c0b] text-[#b9fc12]'
                    : 'text-[#4b5a45] hover:text-[#142010]'
                }`}
              >
                Atibaia → SP
              </button>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1d4c0b]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Cadeia fria íntegra (&lt; 5,0 °C durante 100% da rota)</span>
            </div>
          </div>

          {/* Key Telemetry Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3.5">
              <p className="text-xs text-[#4b5a45]">Média interna</p>
              <p className="text-xl font-bold font-mono tabular-nums text-[#1d4c0b] mt-1">
                {cert.avgTempC.toFixed(1)} °C
              </p>
            </div>
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3.5">
              <p className="text-xs text-[#4b5a45]">Máxima registrada</p>
              <p className="text-xl font-bold font-mono tabular-nums text-[#142010] mt-1">
                {cert.maxTempC.toFixed(1)} °C
              </p>
            </div>
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3.5">
              <p className="text-xs text-[#4b5a45]">Duração monitorada</p>
              <p className="text-xl font-bold font-mono tabular-nums text-[#142010] mt-1">
                {cert.durationHours} h
              </p>
            </div>
            <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl p-3.5">
              <p className="text-xs text-[#1d4c0b]">Validade estimada</p>
              <p className="text-sm font-bold text-[#1d4c0b] mt-1.5">
                {cert.shelfLifeEstimateDays}
              </p>
            </div>
          </div>

          {/* SVG Thermal Curve */}
          <div className="bg-[#fafcf7] border border-[#e4eadc] rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
              <span className="font-semibold text-[#142010]">
                Curva Térmica da Viagem (Interna vs. Baú Seco Externo)
              </span>
              <span className="text-[#4b5a45]">
                Verde: Interior FreshBerrys · Laranja: Ambiente externo
              </span>
            </div>

            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-44"
              role="img"
              aria-label="Gráfico térmico demonstrando temperatura interna abaixo de 5 graus durante 12 horas"
            >
              {/* Grid lines */}
              {[0, 5, 15, 25, 35].map((t) => {
                const y = mapY(t);
                return (
                  <g key={t}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke={t === 5 ? '#1d4c0b' : '#dfe6d6'}
                      strokeDasharray={t === 5 ? '5 4' : undefined}
                      strokeWidth={t === 5 ? 1.5 : 1}
                    />
                    <text
                      x={padL - 6}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill={t === 5 ? '#1d4c0b' : '#64735e'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {t}°
                    </text>
                  </g>
                );
              })}

              {/* Label for 5°C ceiling */}
              <text
                x={chartW - padR - 4}
                y={limit5Y - 5}
                textAnchor="end"
                fontSize="10"
                fontWeight="600"
                fill="#1d4c0b"
              >
                Limite 5,0 °C
              </text>

              {/* External Temp Line */}
              <path
                d={externalPath}
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="4 3"
              />

              {/* Internal FreshBerrys Temp Line */}
              <path d={internalPath} fill="none" stroke="#1d4c0b" strokeWidth="3" />

              {cert.telemetry.map((pt, i) => (
                <g key={pt.hour}>
                  <circle
                    cx={mapX(i)}
                    cy={mapY(pt.internalTempC)}
                    r="4"
                    fill="#b9fc12"
                    stroke="#1d4c0b"
                    strokeWidth="2"
                  />
                  <text
                    x={mapX(i)}
                    y={chartH - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#4b5a45"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Route Checkpoints */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#142010]">
              Registro de pontos da rota ({cert.origin} → {cert.destination})
            </p>
            <div className="border border-[#e4eadc] rounded-xl divide-y divide-[#edf1e7] text-xs">
              {cert.telemetry.map((pt) => (
                <div
                  key={pt.hour}
                  className="px-4 py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[#4b5a45] tabular-nums shrink-0">
                      {pt.label}
                    </span>
                    <span className="text-[#142010] truncate">{pt.location}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                    <span className="text-[#1d4c0b] font-semibold">
                      {pt.internalTempC.toFixed(1)} °C
                    </span>
                    <span className="text-[#788473] hidden sm:inline">
                      ext {pt.externalTempC.toFixed(0)} °C
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Sensor Telemetry Proof (LIS3DH + Lid Sensor + Offline Bluetooth) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
              <p className="text-[#4b5a45]">Aberturas em rota</p>
              <p className="font-mono font-bold text-[#1d4c0b] mt-0.5 tabular-nums">
                {cert.lidOpenCount} aberturas (lacre íntegro)
              </p>
            </div>
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
              <p className="text-[#4b5a45]">Vibração (LIS3DH)</p>
              <p className="font-semibold text-[#142010] mt-0.5">{cert.vibrationStatus}</p>
            </div>
            <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
              <p className="text-[#4b5a45]">Sincronização</p>
              <p className="font-medium text-[#142010] mt-0.5">{cert.bluetoothSyncNote}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e6ece0] text-xs text-[#4b5a45]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1d4c0b]" aria-hidden="true" />
              Carga 100% seca (calha + manta absorvente ativa)
            </span>
            <span className="font-mono tabular-nums">{cert.verifiedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
