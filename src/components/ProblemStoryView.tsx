import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Layers,
  QrCode,
  ShieldAlert,
  ThermometerSnowflake,
} from 'lucide-react';
import {
  simulateBerryDegradation,
  type ProductModelId,
} from '../utils/coldChainModel';
import {
  FOUR_PRINCIPLES,
  GENERATED_RENDERS,
  OPERATIONAL_CYCLE_STEPS,
  ORIGINAL_ASSETS,
  PROBLEM_PILLARS,
} from '../data/freshBerrysData';
import { ResilientImage } from './ResilientImage';

interface ProblemStoryViewProps {
  onOpen3D: (productId?: ProductModelId) => void;
  onOpenProducts: () => void;
  onOpenCertificate: () => void;
}

export const ProblemStoryView: React.FC<ProblemStoryViewProps> = ({
  onOpen3D,
  onOpenProducts,
  onOpenCertificate,
}) => {
  const [simTempC, setSimTempC] = useState<number>(20);
  const [roadVibration, setRoadVibration] = useState<boolean>(true);
  const [thermalCyclingSweat, setThermalCyclingSweat] = useState<boolean>(true);
  const [co2Atmosphere, setCo2Atmosphere] = useState<boolean>(false);

  const degradation = useMemo(
    () =>
      simulateBerryDegradation({
        tempC: simTempC,
        roadVibration,
        thermalCyclingSweat,
        co2Atmosphere,
      }),
    [simTempC, roadVibration, thermalCyclingSweat, co2Atmosphere],
  );

  const applyDryVanPreset = () => {
    setSimTempC(20);
    setRoadVibration(true);
    setThermalCyclingSweat(true);
    setCo2Atmosphere(false);
  };

  const applyFreshBerrysPreset = () => {
    setSimTempC(2);
    setRoadVibration(false);
    setThermalCyclingSweat(false);
    setCo2Atmosphere(true);
  };

  const riskAccentClasses =
    degradation.moldRisk === 'baixo'
      ? 'bg-[#f4fccf] text-[#1d4c0b] border-[#c8df82]'
      : degradation.moldRisk === 'moderado'
        ? 'bg-[#fef6dc] text-[#7a4b00] border-[#ebd18a]'
        : 'bg-[#fdecec] text-[#8f1d1d] border-[#efb9b9]';

  return (
    <div className="w-full">
      {/* Immersive Editorial Hero */}
      <section
        aria-labelledby="hero-problem-heading"
        className="bg-[#1d4c0b] text-white border-b border-[#143707]"
      >
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-3">
              <img
                src={ORIGINAL_ASSETS.logo}
                alt="FreshLog — Temperatura baixa? Tá na caixa!"
                referrerPolicy="no-referrer"
                className="h-10 w-auto object-contain"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono font-semibold text-[#b9fc12] tracking-wide uppercase">
                Rede de Frio Móvel · Linha FreshBerrys
              </p>
              <h1
                id="hero-problem-heading"
                className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-white"
              >
                A berry não mofa na loja — ela se perde no caminho.
              </h1>
              <p className="text-base text-[#f4fccf]/90 leading-relaxed max-w-xl">
                Microcâmaras frias portáteis em PEAD + poliuretano que travam a carga abaixo de
                5 °C por 12 h em qualquer van seca — e continuam conservando no balcão da
                confeitaria sem tomada, motor ou caminhão frigorífico.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpen3D('caixa-m')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#b9fc12] text-[#142010] hover:bg-[#a6e60e] text-sm font-bold transition-colors cursor-pointer"
              >
                <Box className="w-4 h-4" aria-hidden="true" />
                <span>Explorar Estúdio 3D</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenProducts}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/20 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Ver 5 Produtos da Linha</span>
              </button>
            </div>
          </div>

          {/* Hero Visual: Consistent Side-Hinged Caixa M Render */}
          <div className="lg:col-span-6">
            <figure className="bg-[#143707] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
              <ResilientImage
                src={GENERATED_RENDERS.caixaMSideHinged}
                alt="FreshBerrys Caixa M com porta frontal de abertura lateral, dobradiças inox à direita e fechos verde-lima à esquerda"
                className="w-full aspect-[16/10] object-cover"
              />
              <figcaption className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#f4fccf]/90 border-t border-white/10">
                <span className="font-semibold text-white">
                  FreshBerrys Caixa M (60 × 50 × 35 cm)
                </span>
                <span className="font-mono tabular-nums text-[#b9fc12]">
                  &lt; 5 °C · 12–14 h · Porta Lateral
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Scientific Proof Metrics Strip */}
        <div className="border-t border-white/15 bg-[#163c08]">
          <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#b9fc12]">70%</p>
              <p className="text-xs text-[#f4fccf]/85 mt-0.5 leading-snug">
                da conservação depende exclusivamente da temperatura (Embrapa / UC)
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#b9fc12]">10×</p>
              <p className="text-xs text-[#f4fccf]/85 mt-0.5 leading-snug">
                mais rápido a fruta respira e envelhece a 20 °C fora do frio
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#b9fc12]">&gt; 30%</p>
              <p className="text-xs text-[#f4fccf]/85 mt-0.5 leading-snug">
                de perdas de berries no Brasil contra menos de 10% nos EUA
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#b9fc12]">10–21 d</p>
              <p className="text-xs text-[#f4fccf]/85 mt-0.5 leading-snug">
                de vida de prateleira travada abaixo de 5 °C, seca e com CO₂
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16">
        {/* Section 1: O Problema que Resolvemos */}
        <section aria-labelledby="problem-narrative-heading" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
                O Problema que Resolvemos
              </p>
              <h2
                id="problem-narrative-heading"
                className="text-3xl font-bold text-[#142010] leading-tight"
              >
                Por que a fruta mofa 24 h depois de chegar na confeitaria?
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4 text-[15px] text-[#2f3d29] leading-relaxed">
              <p>
                Quando uma cumbuca de morango ou mirtilo mofa um dia depois de chegar na
                confeitaria ou no empório, o problema quase nunca aconteceu na loja — ele aconteceu
                no caminho. Pesquisas da Embrapa e da Universidade da Califórnia mostram que{' '}
                <strong className="font-semibold text-[#142010]">
                  70% da conservação das berries depende exclusivamente da temperatura
                </strong>
                : quando a carga sai do frio e viaja ou espera a 20 °C, ela respira e envelhece até{' '}
                <strong className="font-semibold text-[#142010]">10 vezes mais rápido</strong>,
                perdendo metade da vida útil a cada 10 °C de aquecimento.
              </p>
              <p>
                Na prática, três coisas destroem a margem de quem trabalha com berries hoje:
                primeiro, sempre que a carga passa de 5 °C na estrada ou na doca, fungos agressivos
                despertam e liquefazem a fruta; segundo, a vibração do veículo acelera o desgaste
                em mais 50%; e terceiro, o “esquenta e esfria” faz a embalagem suar por dentro,
                criando o ambiente perfeito para o mofo. Como{' '}
                <strong className="font-semibold text-[#142010]">
                  não é permitido aplicar fungicida pós-colheita no Brasil
                </strong>
                , a única forma de dobrar a vida de prateleira de 5–10 para 10–21 dias é manter a
                fruta travada abaixo de 5 °C, sem umidade livre e protegida por atmosfera de CO₂ do
                produtor até o uso final.
              </p>
            </div>
          </div>

          {/* Three Margin Destroyers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEM_PILLARS.map((pillar) => (
              <article
                key={pillar.number}
                className="bg-white border border-[#dce3d4] rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#1d4c0b]">
                      Fator {pillar.number}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#4b5a45] tabular-nums">
                      {pillar.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#142010] leading-snug">{pillar.title}</h3>
                  <p className="text-sm text-[#4b5a45] leading-relaxed">{pillar.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 2: Interactive Respiration & Shelf-Life Simulator */}
        <section
          aria-labelledby="degradation-sim-heading"
          className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
                Simulador Fisiológico · Base Embrapa &amp; Universidade da Califórnia
              </p>
              <h2
                id="degradation-sim-heading"
                className="text-2xl font-bold text-[#142010] mt-1"
              >
                Simule o que acontece com a fruta no caminho
              </h2>
              <p className="text-sm text-[#4b5a45] mt-1">
                Compare uma rota comum em van seca a 20 °C com a proteção contínua da FreshBerrys
                abaixo de 5 °C e atmosfera de CO₂.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={applyDryVanPreset}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#f4f7ef] text-[#142010] hover:bg-[#e7eee0] transition-colors cursor-pointer whitespace-nowrap"
              >
                Cenário Van Seca (20 °C)
              </button>
              <button
                type="button"
                onClick={applyFreshBerrysPreset}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#143707] transition-colors cursor-pointer whitespace-nowrap"
              >
                Cenário FreshBerrys (2 °C + CO₂)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="path-temp-slider" className="font-semibold text-[#142010]">
                    Temperatura da carga na estrada ou na doca
                  </label>
                  <span
                    className="font-mono text-sm font-bold text-[#1d4c0b] tabular-nums"
                    data-testid="sim-temp-readout"
                  >
                    {simTempC} °C
                  </span>
                </div>
                <input
                  id="path-temp-slider"
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={simTempC}
                  onChange={(e) => setSimTempC(Number(e.target.value))}
                  className="fresh-slider w-full"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#64735e] mt-1.5 tabular-nums">
                  <span>0 °C (Ideal)</span>
                  <span>5 °C (Limite mofo)</span>
                  <span>20 °C (10× respiração)</span>
                  <span>30 °C</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#e8eee0]">
                <div className="flex items-center justify-between gap-4 py-1.5">
                  <div>
                    <p className="text-xs font-semibold text-[#142010]">
                      Vibração do veículo na estrada (+50% desgaste)
                    </p>
                    <p className="text-xs text-[#4b5a45]">
                      Microlesões em morango e framboesa em veículos sem amortecimento de carga
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={roadVibration}
                    onClick={() => setRoadVibration((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      roadVibration
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#eef2e7] text-[#4b5a45]'
                    }`}
                  >
                    {roadVibration ? 'Presente' : 'Amortecida'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-1.5 border-t border-[#f0f4eb]">
                  <div>
                    <p className="text-xs font-semibold text-[#142010]">
                      “Esquenta e esfria” (suor dentro da cumbuca)
                    </p>
                    <p className="text-xs text-[#4b5a45]">
                      Condensação sem calha drenante nem manta absorvente cria água livre
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={thermalCyclingSweat}
                    onClick={() => setThermalCyclingSweat((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      thermalCyclingSweat
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#eef2e7] text-[#4b5a45]'
                    }`}
                  >
                    {thermalCyclingSweat ? 'Com suor' : '100% Seca'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-1.5 border-t border-[#f0f4eb]">
                  <div>
                    <p className="text-xs font-semibold text-[#142010]">
                      Atmosfera natural de CO₂ (10–15%)
                    </p>
                    <p className="text-xs text-[#4b5a45]">
                      Sachê ativado por fita (Caixas P/M) ou cilindro (Paletes) sem fungicida
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={co2Atmosphere}
                    onClick={() => setCo2Atmosphere((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      co2Atmosphere
                        ? 'bg-[#b9fc12] text-[#142010]'
                        : 'bg-[#eef2e7] text-[#4b5a45]'
                    }`}
                  >
                    {co2Atmosphere ? 'CO₂ Ativo' : 'Sem CO₂'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Physiological Readout */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4">
                  <p className="text-xs text-[#4b5a45]">Taxa de respiração</p>
                  <p
                    className="text-2xl font-bold font-mono tabular-nums text-[#142010] mt-2"
                    data-testid="sim-respiration"
                  >
                    {degradation.respirationMultiplier.toFixed(1)}×
                  </p>
                  <p className="text-[11px] text-[#4b5a45] mt-1">vs. 2 °C em repouso</p>
                </div>

                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4">
                  <p className="text-xs text-[#4b5a45]">Vida de prateleira</p>
                  <p
                    className="text-2xl font-bold font-mono tabular-nums text-[#1d4c0b] mt-2"
                    data-testid="sim-shelf-life"
                  >
                    {degradation.estimatedShelfLifeDays.toFixed(1)} d
                  </p>
                  <p className="text-[11px] text-[#4b5a45] mt-1">até perda comercial</p>
                </div>

                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-4">
                  <p className="text-xs text-[#4b5a45]">Perda por hora</p>
                  <p
                    className="text-2xl font-bold font-mono tabular-nums text-[#142010] mt-2"
                    data-testid="sim-hourly-loss"
                  >
                    {degradation.hourlyQualityLossPct.toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-[#4b5a45] mt-1">fruta vendável / h</p>
                </div>
              </div>

              <div
                className={`border rounded-xl p-4 space-y-1.5 ${riskAccentClasses}`}
                data-testid="sim-mold-status"
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  {degradation.moldRisk === 'baixo' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>Risco de mofo cinzento: {degradation.moldRiskLabel}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {degradation.headlineInsight}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 4 Core Principles of the Mobile Cold Chain */}
        <section aria-labelledby="principles-heading" className="space-y-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              Como a Solução Funciona
            </p>
            <h2 id="principles-heading" className="text-2xl md:text-3xl font-bold text-[#142010] mt-1">
              Quatro princípios físicos que dispensam motor e tomada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FOUR_PRINCIPLES.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#dce3d4] rounded-2xl p-6 space-y-2.5"
              >
                <span className="font-mono text-xs font-bold text-[#1d4c0b]">
                  Princípio {item.step}
                </span>
                <h3 className="text-base font-bold text-[#142010]">{item.title}</h3>
                <p className="text-sm text-[#4b5a45] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 6-Step Closed-Loop Operational Cycle */}
        <section
          aria-labelledby="cycle-heading"
          className="bg-[#1d4c0b] text-white rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-mono font-semibold text-[#b9fc12] uppercase tracking-wider">
                Ciclo Completo em 6 Etapas
              </p>
              <h2 id="cycle-heading" className="text-2xl font-bold mt-1">
                Da câmara fria da fazenda ao balcão da confeitaria — sem reembalar
              </h2>
            </div>

            <button
              type="button"
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#b9fc12] text-[#142010] hover:bg-[#a6e60e] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              <span>Abrir Exemplo de Certificado QR</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPERATIONAL_CYCLE_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-1.5"
              >
                <p className="text-xs font-mono font-bold text-[#b9fc12]">{item.step}</p>
                <p className="text-xs text-[#f4fccf]/90 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-xs text-[#f4fccf]">
              <ThermometerSnowflake className="w-4 h-4 text-[#b9fc12] shrink-0" aria-hidden="true" />
              <span>
                5 modelos modulares compatíveis com padrão Embrapa e palete PBR — da entrega de moto
                à carreta de 4 toneladas.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenProducts}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b9fc12] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Conhecer os 5 produtos</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
