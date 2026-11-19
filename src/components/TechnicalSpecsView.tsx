import React, { useMemo, useState } from 'react';
import { Cpu } from 'lucide-react';
import { calculateColdChainMetrics } from '../utils/coldChainModel';
import {
  FRESHLOG_PRODUCTS,
  IOT_SENSOR_STACK,
  ORIGINAL_ASSETS,
  TECHNICAL_SPECS,
} from '../data/freshBerrysData';
import { ResilientImage } from './ResilientImage';

const THERMAL_MODELS = FRESHLOG_PRODUCTS.filter((p) => p.id !== 'base-rodizios');

export const TechnicalSpecsView: React.FC = () => {
  const [ambientTempC, setAmbientTempC] = useState(30);
  const [fruitKg, setFruitKg] = useState(9);
  const [co2Enabled, setCo2Enabled] = useState(true);

  const metrics = useMemo(
    () =>
      calculateColdChainMetrics({
        fruitKg,
        co2Enabled,
        ambientTempC,
        iceCartridgeKg: 4,
      }),
    [fruitKg, co2Enabled, ambientTempC],
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-12">
      {/* Header + Brand Identity Anchor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
            Engenharia Térmica &amp; Eletrônica · FreshLog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#142010] mt-1">
            Balanço Térmico, Convecção e IoT
          </h1>
          <p className="text-sm text-[#4b5a45] mt-2 leading-relaxed">
            Dimensionamento térmico em parede sanduíche PU + PEAD (k = 0,023 W/m·K), controle de
            atmosfera de CO₂ sem fungicidas e registrador ESP32-C3 offline com descarga via
            Bluetooth e QR Code.
          </p>
        </div>

        <div className="bg-[#1d4c0b] rounded-xl px-5 py-3.5 shrink-0 flex items-center justify-center">
          <img
            src={ORIGINAL_ASSETS.logo}
            alt="Logo oficial FreshLog — Temperatura baixa? Tá na caixa!"
            referrerPolicy="no-referrer"
            className="h-14 w-auto object-contain"
          />
        </div>
      </div>

      {/* Interactive Thermal & Ergonomic Simulator Strip */}
      <section
        aria-labelledby="thermal-sim-heading"
        className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-5 space-y-5">
          <div>
            <h2 id="thermal-sim-heading" className="text-lg font-bold text-[#142010]">
              Simulador de Autonomia — Caixa M
            </h2>
            <p className="text-xs text-[#4b5a45] mt-1">
              Ajuste temperatura externa da estrada (base 30 °C), carga útil e uso do sachê de CO₂.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="spec-ambient" className="font-semibold text-[#142010]">
                Temperatura externa (baú seco)
              </label>
              <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                {ambientTempC} °C
              </span>
            </div>
            <input
              id="spec-ambient"
              type="range"
              min={16}
              max={40}
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="fresh-slider w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="spec-fruit" className="font-semibold text-[#142010]">
                Carga de frutas (cumbucas)
              </label>
              <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                {fruitKg} kg
              </span>
            </div>
            <input
              id="spec-fruit"
              type="range"
              min={3}
              max={10}
              value={fruitKg}
              onChange={(e) => setFruitKg(Number(e.target.value))}
              className="fresh-slider w-full"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#e8eee0]">
            <div>
              <p className="text-xs font-semibold text-[#142010]">Sachê protetor de CO₂ (10–15%)</p>
              <p className="text-xs text-[#4b5a45]">Ativado por fita · válvula de alívio em ~20%</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={co2Enabled}
              onClick={() => setCo2Enabled((v) => !v)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                co2Enabled
                  ? 'bg-[#b9fc12] text-[#142010]'
                  : 'bg-[#eef2e7] text-[#4b5a45]'
              }`}
            >
              {co2Enabled ? 'Ativo' : 'Desativado'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 items-stretch">
          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4 flex flex-col justify-between">
            <p className="text-xs text-[#4b5a45]">Autonomia &lt; 5 °C</p>
            <p
              className="text-2xl font-bold font-mono tabular-nums text-[#1d4c0b] mt-3"
              data-testid="spec-autonomy-hours"
            >
              {metrics.roadAutonomyHours} h
            </p>
            <p className="text-xs text-[#4b5a45] mt-1">Com 2 × 2 kg PCM</p>
          </div>

          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4 flex flex-col justify-between">
            <p className="text-xs text-[#4b5a45]">Validade estimada</p>
            <p
              className="text-2xl font-bold font-mono tabular-nums text-[#1d4c0b] mt-3"
              data-testid="spec-shelf-life"
            >
              {metrics.shelfLifeMinDays}–{metrics.shelfLifeMaxDays} d
            </p>
            <p className="text-xs text-[#4b5a45] mt-1">
              {co2Enabled ? 'Atmosfera CO₂ ativa' : 'Apenas frio passivo'}
            </p>
          </div>

          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4 flex flex-col justify-between">
            <p className="text-xs text-[#4b5a45]">Peso bruto carregado</p>
            <p className="text-2xl font-bold font-mono tabular-nums text-[#142010] mt-3">
              {metrics.totalLoadedWeightKg} kg
            </p>
            <p className="text-xs text-[#4b5a45] mt-1">
              Tara {metrics.tareWeightKg} kg + 4 kg gelo
            </p>
          </div>

          <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl p-4 flex flex-col justify-between">
            <p className="text-xs text-[#1d4c0b]">Ergonomia NR-17</p>
            <p className="text-lg font-bold text-[#1d4c0b] mt-3">
              {metrics.twoHandLiftCompliant ? 'Conforme' : 'Atenção'}
            </p>
            <p className="text-xs text-[#2d4a1e] mt-1">Alças laterais embutidas</p>
          </div>
        </div>
      </section>

      {/* Thermal Balance Comparison Across Thermal Models (Q = UA * ΔT * t) */}
      <section
        aria-labelledby="thermal-balance-heading"
        className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-[#e6ece0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="thermal-balance-heading" className="text-lg font-bold text-[#142010]">
              Balanço Térmico por Modelo (Q = UA · ΔT · t · Exterior 30 °C / Interior 3 °C)
            </h2>
            <p className="text-xs text-[#4b5a45] mt-0.5">
              Quanto maior o volume, menor a entrada de calor por quilo de fruta (efeito escala).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e6ece0] bg-[#f8faf5] text-xs font-semibold text-[#4b5a45]">
                <th className="py-3.5 px-5">Modelo Térmico</th>
                <th className="py-3.5 px-5">Área externa</th>
                <th className="py-3.5 px-5">Entrada de calor</th>
                <th className="py-3.5 px-5">Eficiência (W/kg)</th>
                <th className="py-3.5 px-5">Gelo &amp; Autonomia</th>
                <th className="py-3.5 px-5">Aplicação de CO₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2e8] text-xs md:text-sm">
              {THERMAL_MODELS.map((item) => (
                <tr key={item.id} className="hover:bg-[#fafcf7]">
                  <td className="py-3.5 px-5 font-semibold text-[#142010] whitespace-nowrap">
                    {item.shortName}
                  </td>
                  <td className="py-3.5 px-5 font-mono tabular-nums text-[#3c4a36]">
                    {item.surfaceAreaM2}
                  </td>
                  <td className="py-3.5 px-5 font-mono tabular-nums text-[#3c4a36]">
                    {item.heatIngressW}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold tabular-nums text-[#1d4c0b]">
                    {item.heatPerKg}
                  </td>
                  <td className="py-3.5 px-5 text-[#2f3d29]">{item.iceAndAutonomy}</td>
                  <td className="py-3.5 px-5 text-[#4b5a45]">{item.co2Method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Schematic Cross-Section + IoT Telemetry Stack */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Official Thermal Flow Schematic */}
        <div className="lg:col-span-6 bg-white border border-[#dce3d4] rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              Corte Transversal · Convecção Natural
            </p>
            <h2 className="text-lg font-bold text-[#142010] mt-1">
              Circulação passiva sem congelar a fruta
            </h2>
            <p className="text-xs text-[#4b5a45] mt-1 leading-relaxed">
              O ar frio desce dos cartuchos pela placa difusora (vão de ~15 mm evitando congelamento
              do morango a −0,8 °C), a umidade escorre pelas laterais até a calha com manta
              absorvente e o ar aquecido sobe pelos canais de retorno.
            </p>
          </div>
          <div className="bg-[#f4fccf]/45 border border-[#dce6b3] rounded-xl p-3 overflow-hidden">
            <ResilientImage
              src={ORIGINAL_ASSETS.schematic}
              alt="Esquema técnico de convecção térmica da FreshBerrys: cartuchos no topo, placa difusora, canais de retorno e manta absorvente"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
        </div>

        {/* ESP32-C3 / SHT40 / LIS3DH Hardware Stack */}
        <div className="lg:col-span-6 bg-white border border-[#dce3d4] rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              <Cpu className="w-4 h-4" aria-hidden="true" />
              <span>Arquitetura Eletrônica &amp; Telemetria Offline</span>
            </div>
            <h2 className="text-lg font-bold text-[#142010] mt-1">
              Registrador ESP32-C3 com descarga via Bluetooth &amp; QR
            </h2>
            <p className="text-xs text-[#4b5a45] mt-1 leading-relaxed">
              Funciona 100% sem sinal de celular durante a viagem na serra. Ao chegar no destino, o
              celular se aproxima a ~10 m, baixa a curva térmica e emite o Certificado Digital da
              Viagem.
            </p>
          </div>

          <div className="divide-y divide-[#eef2e8] border border-[#e4eadc] rounded-xl overflow-hidden">
            {IOT_SENSOR_STACK.map((sensor) => (
              <div
                key={sensor.part}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-[#fafcf7]"
              >
                <span className="font-mono text-xs font-bold text-[#1d4c0b] shrink-0">
                  {sensor.part}
                </span>
                <span className="text-xs text-[#3c4a36] sm:text-right">{sensor.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specification Table */}
      <section
        aria-labelledby="spec-table-heading"
        className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-[#e6ece0]">
          <h2 id="spec-table-heading" className="text-lg font-bold text-[#142010]">
            Memorial Descritivo de Engenharia
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e6ece0] bg-[#f8faf5] text-xs font-semibold text-[#4b5a45]">
                <th className="py-3.5 px-6">Subsistema</th>
                <th className="py-3.5 px-6">Componente</th>
                <th className="py-3.5 px-6">Especificação</th>
                <th className="py-3.5 px-6">Justificativa operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2e8] text-sm">
              {TECHNICAL_SPECS.map((row) => (
                <tr key={row.category} className="hover:bg-[#fafcf7] transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#142010] whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="py-4 px-6 text-[#3c4a36]">{row.parameter}</td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-[#1d4c0b] tabular-nums whitespace-nowrap">
                    {row.value}
                  </td>
                  <td className="py-4 px-6 text-[#4b5a45] leading-relaxed">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
