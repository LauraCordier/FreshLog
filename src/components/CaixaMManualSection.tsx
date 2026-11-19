import React, { useState } from 'react';
import { BookOpen, Box, CheckCircle2, Eye, Layers, Wrench } from 'lucide-react';
import {
  CAIXA_M_MANUAL_COMPONENTS,
  CAIXA_M_MANUAL_GUIDES,
  GENERATED_RENDERS,
  type CaixaMManualComponent,
  type CaixaMManualView,
} from '../data/freshBerrysData';
import { ResilientImage } from './ResilientImage';

interface CaixaMManualSectionProps {
  onOpenExploded3D: () => void;
}

export const CaixaMManualSection: React.FC<CaixaMManualSectionProps> = ({
  onOpenExploded3D,
}) => {
  const [activeView, setActiveView] = useState<CaixaMManualView>('open');
  const [selectedCode, setSelectedCode] = useState<string>('05');

  const selectedComponent: CaixaMManualComponent =
    CAIXA_M_MANUAL_COMPONENTS.find((c) => c.code === selectedCode) ??
    CAIXA_M_MANUAL_COMPONENTS[0];

  const pinsForActiveView = CAIXA_M_MANUAL_COMPONENTS.filter((c) => c.view === activeView);

  const handleSelectComponent = (component: CaixaMManualComponent) => {
    setSelectedCode(component.code);
    if (component.view !== activeView) {
      setActiveView(component.view);
    }
  };

  const handleSwitchView = (nextView: CaixaMManualView) => {
    setActiveView(nextView);
    if (selectedComponent.view !== nextView) {
      const firstInView = CAIXA_M_MANUAL_COMPONENTS.find((c) => c.view === nextView);
      if (firstInView) {
        setSelectedCode(firstInView.code);
      }
    }
  };

  const currentImageSrc =
    activeView === 'open' ? GENERATED_RENDERS.caixaMOpen : GENERATED_RENDERS.caixaMSideHinged;

  const currentImageAlt =
    activeView === 'open'
      ? 'Diagrama interno interativo da FreshBerrys Caixa M com tampa superior e porta frontal lateral abertas'
      : 'Diagrama externo interativo da FreshBerrys Caixa M fechada com encaixes em L, módulo QR, dobradiças inox e fechos verde-lima';

  return (
    <section
      id="manual-caixa-m"
      aria-labelledby="caixa-m-manual-heading"
      data-testid="caixa-m-manual-section"
      className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 space-y-8"
    >
      {/* Manual Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#e8eee0]">
        <div className="max-w-3xl space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1d4c0b] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Manual Técnico do Produto · FreshBerrys Caixa M (60 × 50 × 35 cm)</span>
          </div>
          <h2
            id="caixa-m-manual-heading"
            className="text-2xl md:text-3xl font-bold text-[#142010] leading-tight"
          >
            Guia completo de cada componente da Caixa M
          </h2>
          <p className="text-sm text-[#4b5a45] leading-relaxed">
            Clique nos marcadores numerados (<span className="font-mono font-semibold">01</span> a{' '}
            <span className="font-mono font-semibold">12</span>) sobre a foto ou na lista abaixo
            para inspecionar função, especificação de engenharia e boas práticas de uso de cada
            peça.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenExploded3D}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#133407] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start lg:self-auto"
        >
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span>Abrir Vista Explodida em 3D</span>
        </button>
      </div>

      {/* Interactive Annotated Blueprint + Selected Component Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Annotated Visual Diagram with View Switcher */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              role="tablist"
              aria-label="Alternar vista do manual da Caixa M"
              className="inline-flex rounded-xl bg-[#f1f5eb] p-1 border border-[#dce3d4]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'open'}
                onClick={() => handleSwitchView('open')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeView === 'open'
                    ? 'bg-[#1d4c0b] text-[#b9fc12]'
                    : 'text-[#3c4a36] hover:text-[#142010]'
                }`}
              >
                Vista Interna · Dupla Abertura (5 peças)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'closed'}
                onClick={() => handleSwitchView('closed')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeView === 'closed'
                    ? 'bg-[#1d4c0b] text-[#b9fc12]'
                    : 'text-[#3c4a36] hover:text-[#142010]'
                }`}
              >
                Vista Externa · Fechada (7 peças)
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4b5a45]">
              <Eye className="w-3.5 h-3.5 text-[#1d4c0b]" aria-hidden="true" />
              <span>Toque nos números para inspecionar</span>
            </span>
          </div>

          {/* Uncropped 1:1 Coordinate Container so hotspot pins never drift */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border border-[#dce3d4] bg-[#f2f4ef]"
            data-testid="caixa-m-manual-diagram"
          >
            <ResilientImage
              src={currentImageSrc}
              alt={currentImageAlt}
              className="w-full h-auto block select-none"
            />

            {pinsForActiveView.map((comp) => {
              const isSelected = comp.code === selectedComponent.code;
              return (
                <button
                  key={comp.code}
                  type="button"
                  onClick={() => handleSelectComponent(comp)}
                  aria-label={`Componente ${comp.code}: ${comp.name}`}
                  aria-pressed={isSelected}
                  style={{ left: `${comp.xPct}%`, top: `${comp.yPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-mono text-xs font-extrabold flex items-center justify-center border-2 transition-transform cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4c0b] ${
                    isSelected
                      ? 'bg-[#b9fc12] text-[#142010] border-[#1d4c0b] scale-125 z-20 ring-4 ring-[#1d4c0b]/30'
                      : 'bg-[#1d4c0b] text-[#b9fc12] border-white hover:scale-110 z-10'
                  }`}
                >
                  {comp.code}
                </button>
              );
            })}
          </div>

          {/* Compact Legend Strip under active view */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pinsForActiveView.map((comp) => {
              const isSelected = comp.code === selectedComponent.code;
              return (
                <button
                  key={comp.code}
                  type="button"
                  onClick={() => handleSelectComponent(comp)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1d4c0b] text-[#b9fc12] border-[#1d4c0b]'
                      : 'bg-[#f6f8f3] text-[#2f3d29] border-[#dce3d4] hover:border-[#1d4c0b]/50'
                  }`}
                >
                  <span className="font-mono font-bold">{comp.code}</span>
                  <span>{comp.name.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Component Specification Inspector */}
        <div
          className="lg:col-span-5 bg-[#f6f8f3] border border-[#dce3d4] rounded-2xl p-6 space-y-5"
          data-testid="caixa-m-manual-detail"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-[#1d4c0b] uppercase tracking-wider">
                Componente {selectedComponent.code} · {selectedComponent.subsystem}
              </p>
              <h3 className="text-xl font-bold text-[#142010] leading-snug">
                {selectedComponent.name}
              </h3>
            </div>
            <span className="w-10 h-10 rounded-xl bg-[#1d4c0b] text-[#b9fc12] font-mono text-sm font-extrabold flex items-center justify-center shrink-0">
              {selectedComponent.code}
            </span>
          </div>

          <div className="bg-white border border-[#e4eadc] rounded-xl p-3.5 space-y-1">
            <p className="text-[11px] font-semibold text-[#4b5a45] uppercase tracking-wider">
              Especificação &amp; Material
            </p>
            <p className="text-xs font-mono font-semibold text-[#142010] leading-relaxed">
              {selectedComponent.materialOrSpec}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#142010]">Função no sistema</p>
            <p className="text-sm text-[#3c4a36] leading-relaxed">
              {selectedComponent.functionText}
            </p>
          </div>

          <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1d4c0b]">
              <Wrench className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Recomendação de uso &amp; manutenção</span>
            </div>
            <p className="text-xs text-[#24381a] leading-relaxed">{selectedComponent.careTip}</p>
          </div>

          {/* Quick Previous / Next Component Navigation */}
          <div className="pt-2 border-t border-[#e2e9d8] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const idx = CAIXA_M_MANUAL_COMPONENTS.findIndex(
                  (c) => c.code === selectedComponent.code,
                );
                const prevIdx =
                  (idx - 1 + CAIXA_M_MANUAL_COMPONENTS.length) % CAIXA_M_MANUAL_COMPONENTS.length;
                handleSelectComponent(CAIXA_M_MANUAL_COMPONENTS[prevIdx]);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#dce3d4] hover:border-[#1d4c0b] text-xs font-semibold text-[#142010] cursor-pointer"
            >
              ← Anterior
            </button>
            <span className="text-xs font-mono tabular-nums text-[#4b5a45]">
              {selectedComponent.code} / 12
            </span>
            <button
              type="button"
              onClick={() => {
                const idx = CAIXA_M_MANUAL_COMPONENTS.findIndex(
                  (c) => c.code === selectedComponent.code,
                );
                const nextIdx = (idx + 1) % CAIXA_M_MANUAL_COMPONENTS.length;
                handleSelectComponent(CAIXA_M_MANUAL_COMPONENTS[nextIdx]);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#133407] text-xs font-semibold cursor-pointer"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>

      {/* Complete 12-Component Master Reference Index */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#142010]">
            Índice completo de componentes da Caixa M (12 peças)
          </h3>
          <span className="text-xs text-[#4b5a45]">
            Clique em qualquer item para focar no diagrama acima
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAIXA_M_MANUAL_COMPONENTS.map((comp) => {
            const isSelected = comp.code === selectedComponent.code;
            return (
              <button
                key={comp.code}
                type="button"
                onClick={() => handleSelectComponent(comp)}
                className={`text-left rounded-xl p-3.5 border transition-colors cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#1d4c0b] text-white border-[#1d4c0b]'
                    : 'bg-[#f8faf5] text-[#142010] border-[#e2e9d8] hover:border-[#1d4c0b]/50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#b9fc12] text-[#142010]' : 'bg-[#1d4c0b] text-[#b9fc12]'
                  }`}
                >
                  {comp.code}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p
                    className={`text-xs font-bold leading-snug ${
                      isSelected ? 'text-white' : 'text-[#142010]'
                    }`}
                  >
                    {comp.name}
                  </p>
                  <p
                    className={`text-[11px] leading-snug ${
                      isSelected ? 'text-[#f4fccf]/85' : 'text-[#4b5a45]'
                    }`}
                  >
                    {comp.subsystem} · {comp.view === 'open' ? 'Vista interna' : 'Vista externa'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Step Quick Operational & Maintenance Guide */}
      <div className="pt-6 border-t border-[#e8eee0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-mono font-bold text-[#1d4c0b] uppercase tracking-wider">
              Procedimento Operacional Padrão
            </p>
            <h3 className="text-lg font-bold text-[#142010]">
              Guia rápido de operação, troca de gelo e higienização
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4c0b]">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Vida útil estimada: ~450 usos ou 5 anos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAIXA_M_MANUAL_GUIDES.map((guide) => (
            <article
              key={guide.step}
              className="bg-[#f6f8f3] border border-[#e2e9d8] rounded-xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-[#1d4c0b]">Passo {guide.step}</span>
                  <span className="text-[11px] text-[#4b5a45]">{guide.timing}</span>
                </div>
                <h4 className="text-sm font-bold text-[#142010]">{guide.title}</h4>
                <p className="text-xs text-[#4b5a45] leading-relaxed">{guide.instructions}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#1d4c0b] leading-relaxed">
            <strong className="font-bold">Quer ver cada camada separada em 360°?</strong> Abra a
            Caixa M no modo <strong>Vista Explodida</strong> do Estúdio 3D para inspecionar tampa,
            cartuchos PCM, sachê CO₂, placa difusora, gavetas e manta absorvente em movimento.
          </p>
          <button
            type="button"
            onClick={onOpenExploded3D}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#133407] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Box className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ver Caixa M Explodida</span>
          </button>
        </div>
      </div>
    </section>
  );
};
