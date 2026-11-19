import React, { useMemo, useState } from 'react';
import { MapPin, QrCode, TrendingUp } from 'lucide-react';
import {
  BERRY_PROFILES,
  calculateTripROI,
  type BerryType,
} from '../utils/coldChainModel';
import {
  FREIGHT_COMPARISON_360KG,
  REAL_FIELD_CASES,
  STAKEHOLDER_STAGES,
} from '../data/freshBerrysData';

interface RouteAndROIViewProps {
  onOpenCertificate: () => void;
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const BERRY_BUTTON_LABELS: Record<BerryType, string> = {
  framboesa: 'Framboesa',
  mirtilo: 'Mirtilo',
  morango: 'Morango',
  misto: 'Carga Mista',
};

export const RouteAndROIView: React.FC<RouteAndROIViewProps> = ({ onOpenCertificate }) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(STAKEHOLDER_STAGES[3].id);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(REAL_FIELD_CASES[0].id);
  const [berryType, setBerryType] = useState<BerryType>('mirtilo');
  const [fruitKgPerBox, setFruitKgPerBox] = useState<number>(9);
  const [tripRentalBrl, setTripRentalBrl] = useState<number>(7);
  const [shopDays, setShopDays] = useState<number>(3);
  const [dailyShopFeeBrl, setDailyShopFeeBrl] = useState<number>(1.5);
  const [monthlyTrips, setMonthlyTrips] = useState<number>(20);

  const activeStage =
    STAKEHOLDER_STAGES.find((s) => s.id === selectedStageId) ?? STAKEHOLDER_STAGES[0];
  const activeCase =
    REAL_FIELD_CASES.find((c) => c.id === selectedCaseId) ?? REAL_FIELD_CASES[0];

  const roi = useMemo(
    () =>
      calculateTripROI({
        berryType,
        fruitKgPerBox,
        tripRentalBrl,
        shopDays,
        dailyShopFeeBrl,
        monthlyTrips,
      }),
    [berryType, fruitKgPerBox, tripRentalBrl, shopDays, dailyShopFeeBrl, monthlyTrips],
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-16">
      {/* Section 1: 4 Stakeholders in One Closed-Loop Route */}
      <section aria-labelledby="route-audience-heading" className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
            Público do “meio do caminho” · Sul de Minas, Mantiqueira &amp; Atibaia
          </p>
          <h1
            id="route-audience-heading"
            className="text-3xl md:text-4xl font-bold text-[#142010] mt-1 leading-tight"
          >
            Quatro elos ganham na mesma rota sem reembalar a fruta
          </h1>
          <p className="text-base text-[#4b5a45] mt-2 leading-relaxed">
            Do produtor com 10 a 300 kg até a confeitaria sem câmara fria: entenda quanto se
            economiza no frete, quanto se evita de descarte e como o raio de venda fresca mais que
            dobra.
          </p>
        </div>

        {/* Stage Selector Buttons */}
        <div
          role="tablist"
          aria-label="Selecionar etapa da cadeia fria"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {STAKEHOLDER_STAGES.map((stage) => {
            const active = stage.id === activeStage.id;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedStageId(stage.id)}
                className={`text-left p-5 rounded-2xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1d4c0b] border-[#1d4c0b] text-white'
                    : 'bg-white border-[#dce3d4] text-[#142010] hover:border-[#1d4c0b]/50'
                }`}
              >
                <p
                  className={`text-xs font-mono tabular-nums ${
                    active ? 'text-[#b9fc12]' : 'text-[#4b5a45]'
                  }`}
                >
                  Etapa {stage.step}
                </p>
                <p className="text-base font-bold mt-1">{stage.role}</p>
                <p
                  className={`text-xs mt-1.5 leading-snug ${
                    active ? 'text-[#f4fccf]/85' : 'text-[#4b5a45]'
                  }`}
                >
                  {stage.locationContext}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stakeholder Detail Panel */}
        <div
          className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
          data-testid="stakeholder-detail-panel"
        >
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-mono font-semibold text-[#1d4c0b]">
              Etapa {activeStage.step} · {activeStage.locationContext}
            </p>
            <h2 className="text-2xl font-bold text-[#142010]">{activeStage.role}</h2>
            <p className="text-sm font-semibold text-[#1d4c0b] bg-[#f4fccf] px-4 py-3 rounded-xl">
              {activeStage.headlineMetric}
            </p>
            <div className="pt-2">
              <p className="text-xs font-semibold text-[#4b5a45]">
                Recurso da linha usado nesta etapa
              </p>
              <p className="text-sm text-[#142010] font-medium mt-1">
                {activeStage.designFeatureUsed}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 border-t lg:border-t-0 lg:border-l border-[#e6ece0] pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#4b5a45]">Cenário anterior (Isopor / Baú Seco)</h3>
              <p className="text-sm text-[#3c4a36] leading-relaxed">{activeStage.painBefore}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#1d4c0b]">Com a Rede FreshBerrys</h3>
              <p className="text-sm text-[#142010] leading-relaxed">{activeStage.freshBerrysGain}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Freight Cost Comparison Table (360 kg · 150 km from PDF) */}
      <section aria-labelledby="freight-table-heading" className="space-y-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
            Comparativo Real de Frete · Carga de 360 kg · Rota de 150 km
          </p>
          <h2 id="freight-table-heading" className="text-2xl font-bold text-[#142010] mt-1">
            40% a 80% mais barato por quilo que o caminhão frigorífico dedicado
          </h2>
          <p className="text-sm text-[#4b5a45] mt-1.5 leading-relaxed">
            Referência baseada no piso ANTT (frigorífico 2 eixos) versus van ou caminhão baú seco
            combinado com os equipamentos FreshBerrys com registro de temperatura por QR Code.
          </p>
        </div>

        <div className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6ece0] bg-[#f8faf5] text-xs font-semibold text-[#4b5a45]">
                  <th className="py-3.5 px-5">Modalidade (360 kg · 150 km)</th>
                  <th className="py-3.5 px-5">Frete</th>
                  <th className="py-3.5 px-5">Custo do frio</th>
                  <th className="py-3.5 px-5">Total estimado</th>
                  <th className="py-3.5 px-5">Custo / kg</th>
                  <th className="py-3.5 px-5">Frio comprovado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2e8] text-xs md:text-sm">
                {FREIGHT_COMPARISON_360KG.map((row) => (
                  <tr
                    key={row.option}
                    className={row.highlight ? 'bg-[#f4fccf]/55 font-medium' : 'hover:bg-[#fafcf7]'}
                  >
                    <td className="py-3.5 px-5 font-semibold text-[#142010]">{row.option}</td>
                    <td className="py-3.5 px-5 font-mono tabular-nums text-[#3c4a36]">
                      {row.freight}
                    </td>
                    <td className="py-3.5 px-5 font-mono tabular-nums text-[#3c4a36]">
                      {row.coldCost}
                    </td>
                    <td className="py-3.5 px-5 font-mono tabular-nums text-[#142010] font-semibold">
                      {row.total}
                    </td>
                    <td
                      className={`py-3.5 px-5 font-mono tabular-nums font-bold ${
                        row.highlight ? 'text-[#1d4c0b]' : 'text-[#4b5a45]'
                      }`}
                    >
                      {row.perKg}
                    </td>
                    <td className="py-3.5 px-5 text-[#2f3d29]">{row.provenCold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3: Market Expansion Radius (~300 km -> ~700 km) */}
      <section
        aria-labelledby="expansion-heading"
        className="bg-[#1d4c0b] text-white rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#b9fc12] uppercase">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            <span>Expansão Geográfica de Venda Fresca</span>
          </div>
          <h2 id="expansion-heading" className="text-2xl md:text-3xl font-bold leading-tight">
            De ~300 km no isopor para até ~700 km em 12 h abaixo de 5 °C
          </h2>
          <p className="text-sm text-[#f4fccf]/90 leading-relaxed">
            Quem produz no Sul de Minas ou na Serra da Mantiqueira deixa de depender só de São
            Paulo e Campinas para vender fruta fresca premium também no Rio de Janeiro, Belo
            Horizonte e Curitiba — evitando liquidar excedente congelado por R$ 10–15/kg.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-1">
            <p className="text-xs text-[#f4fccf]/80">Produtor (1 ha framboesa)</p>
            <p className="text-xl font-bold font-mono tabular-nums text-[#b9fc12]">
              +R$ 24–63 mil
            </p>
            <p className="text-[11px] text-[#f4fccf]/80 leading-snug">
              líquidos/ano (perda evitada + novos mercados)
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-1">
            <p className="text-xs text-[#f4fccf]/80">Distribuidor (50 t/ano)</p>
            <p className="text-xl font-bold font-mono tabular-nums text-[#b9fc12]">
              +R$ 52–132 mil
            </p>
            <p className="text-[11px] text-[#f4fccf]/80 leading-snug">
              líquidos/ano · payback em 0,7–1,7 ano
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-1">
            <p className="text-xs text-[#f4fccf]/80">Confeitaria / Empório</p>
            <p className="text-xl font-bold font-mono tabular-nums text-[#b9fc12]">
              4–6 meses
            </p>
            <p className="text-[11px] text-[#f4fccf]/80 leading-snug">
              retorno total cortando perdas de 15% para 5%
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: 5 Real Field Cases from the Study */}
      <section aria-labelledby="cases-heading" className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
            Estudos de Campo Reais · Cadeia de Berries no Brasil
          </p>
          <h2 id="cases-heading" className="text-2xl font-bold text-[#142010] mt-1">
            Cinco operações reais e o equipamento certo para cada uma
          </h2>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Selecionar caso real">
          {REAL_FIELD_CASES.map((c) => {
            const selected = c.id === activeCase.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[#1d4c0b] text-[#b9fc12] border-[#1d4c0b]'
                    : 'bg-white text-[#142010] border-[#dce3d4] hover:border-[#1d4c0b]/50'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#e8eee0]">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1d4c0b]">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{activeCase.region}</span>
              </p>
              <h3 className="text-xl font-bold text-[#142010] mt-1">{activeCase.title}</h3>
            </div>
            <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl px-4 py-2.5 shrink-0">
              <p className="text-[11px] text-[#4b5a45]">Equipamento recomendado</p>
              <p className="text-xs font-bold text-[#1d4c0b] mt-0.5">
                {activeCase.recommendedModels}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#4b5a45]">Rotina atual</p>
              <p className="text-xs text-[#2f3d29] leading-relaxed">{activeCase.situation}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#4b5a45]">O que estraga hoje</p>
              <p className="text-xs text-[#2f3d29] leading-relaxed">{activeCase.whatGoesWrong}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#4b5a45]">Por que não usa frigorífico</p>
              <p className="text-xs text-[#2f3d29] leading-relaxed">{activeCase.whyNoReefer}</p>
            </div>
            <div className="space-y-1.5 bg-[#f6f8f3] rounded-xl p-3.5 border border-[#e4eadc]">
              <p className="text-xs font-bold text-[#1d4c0b]">Impacto financeiro</p>
              <p className="text-xs text-[#142010] leading-relaxed font-medium">
                {activeCase.financialImpact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Interactive Payback & ROI Calculator */}
      <section aria-labelledby="roi-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              Simulador Econômico · Ciclo Fechado Caixa M
            </p>
            <h2 id="roi-heading" className="text-2xl md:text-3xl font-bold text-[#142010] mt-1">
              Quanto a caixa precisa salvar para se pagar sozinha?
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#133407] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
            <span>Ver Certificado Digital da Viagem</span>
          </button>
        </div>

        <div className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Fruit Type Selector (All 4 berry profiles) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#142010] block">
                Tipo de carga na Caixa M
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(BERRY_PROFILES) as BerryType[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBerryType(key)}
                    aria-pressed={berryType === key}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center ${
                      berryType === key
                        ? 'bg-[#1d4c0b] text-[#b9fc12]'
                        : 'bg-[#f4f7ef] text-[#142010] hover:bg-[#e8efe0]'
                    }`}
                  >
                    {BERRY_BUTTON_LABELS[key]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#4b5a45] font-mono tabular-nums">
                Valor médio de referência: {formatBRL(roi.fruitPricePerKgBrl)}/kg
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="roi-kg" className="font-semibold text-[#142010]">
                    Peso de fruta por caixa
                  </label>
                  <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                    {fruitKgPerBox} kg ({formatBRL(roi.cargoValueBrl)}/caixa)
                  </span>
                </div>
                <input
                  id="roi-kg"
                  type="range"
                  min={4}
                  max={10}
                  step={1}
                  value={fruitKgPerBox}
                  onChange={(e) => setFruitKgPerBox(Number(e.target.value))}
                  className="fresh-slider w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="roi-trip" className="font-semibold text-[#142010]">
                    Tarifa FreshBerrys por viagem (sem/com CO₂)
                  </label>
                  <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                    {formatBRL(tripRentalBrl)}
                  </span>
                </div>
                <input
                  id="roi-trip"
                  type="range"
                  min={5}
                  max={12}
                  step={0.5}
                  value={tripRentalBrl}
                  onChange={(e) => setTripRentalBrl(Number(e.target.value))}
                  className="fresh-slider w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="roi-days" className="font-semibold text-[#142010]">
                      Dias na confeitaria/empório
                    </label>
                    <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                      {shopDays} {shopDays === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                  <input
                    id="roi-days"
                    type="range"
                    min={0}
                    max={7}
                    step={1}
                    value={shopDays}
                    onChange={(e) => setShopDays(Number(e.target.value))}
                    className="fresh-slider w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="roi-daily" className="font-semibold text-[#142010]">
                      Diária na loja (troca gelo)
                    </label>
                    <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                      {formatBRL(dailyShopFeeBrl)}/dia
                    </span>
                  </div>
                  <input
                    id="roi-daily"
                    type="range"
                    min={1}
                    max={2.5}
                    step={0.5}
                    value={dailyShopFeeBrl}
                    onChange={(e) => setDailyShopFeeBrl(Number(e.target.value))}
                    className="fresh-slider w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="roi-monthly" className="font-semibold text-[#142010]">
                    Volume mensal de caixas na rota
                  </label>
                  <span className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                    {monthlyTrips} caixas/mês
                  </span>
                </div>
                <input
                  id="roi-monthly"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={monthlyTrips}
                  onChange={(e) => setMonthlyTrips(Number(e.target.value))}
                  className="fresh-slider w-full"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 bg-[#1d4c0b] text-white rounded-2xl p-6 md:p-7 space-y-6">
            <div>
              <p className="text-xs text-[#f4fccf]/80">Ponto de equilíbrio (Payback da caixa)</p>
              <p
                className="text-4xl font-bold font-mono tabular-nums text-[#b9fc12] mt-1"
                data-testid="roi-breakeven-grams"
              >
                {roi.breakEvenGrams} g
              </p>
              <p className="text-sm text-[#f4fccf] mt-1.5 leading-relaxed">
                Salvando apenas <strong className="font-semibold">{roi.breakEvenGrams} gramas</strong>{' '}
                de {BERRY_PROFILES[berryType].label.toLowerCase()} do descarte, o custo total de{' '}
                {formatBRL(roi.totalBoxCostBrl)} já se pagou integralmente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
              <div>
                <p className="text-xs text-[#f4fccf]/75">Perda evitada por caixa</p>
                <p className="text-xl font-bold font-mono tabular-nums mt-0.5">
                  {roi.savedFruitKg.toFixed(2)} kg
                </p>
                <p className="text-xs text-[#f4fccf]/75 mt-0.5 tabular-nums">
                  {roi.spoilageWithoutBoxPct}% → {roi.spoilageWithBoxPct}% descarte
                </p>
              </div>

              <div>
                <p className="text-xs text-[#f4fccf]/75">Ganho líquido / viagem</p>
                <p className="text-xl font-bold font-mono tabular-nums text-[#b9fc12] mt-0.5">
                  {formatBRL(roi.netGainPerTripBrl)}
                </p>
                <p className="text-xs text-[#f4fccf]/75 mt-0.5 tabular-nums">
                  Retorno de {roi.roiMultiplier}× sobre o aluguel
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-baseline justify-between gap-4">
              <span className="text-xs text-[#f4fccf]/85">
                Economia líquida estimada ({monthlyTrips} caixas/mês)
              </span>
              <span
                className="text-2xl font-bold font-mono tabular-nums text-[#b9fc12]"
                data-testid="roi-monthly-savings"
              >
                {formatBRL(roi.monthlyNetSavingsBrl)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
