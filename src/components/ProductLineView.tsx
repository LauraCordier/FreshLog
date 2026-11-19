import React, { useState } from 'react';
import { ArrowRight, BookOpen, Box, Check, DoorOpen, HeartHandshake, Truck } from 'lucide-react';
import type { ProductModelId } from '../utils/coldChainModel';
import {
  FRESHLOG_PRODUCTS,
  GENERATED_RENDERS,
  HUMANITARIAN_DESIGN_PILLARS,
  type ProductFamilyItem,
} from '../data/freshBerrysData';
import { ResilientImage } from './ResilientImage';
import { CaixaMManualSection } from './CaixaMManualSection';

interface ProductLineViewProps {
  onOpen3D: (productId: ProductModelId) => void;
  onOpenExploded3D: () => void;
}

export const ProductLineView: React.FC<ProductLineViewProps> = ({
  onOpen3D,
  onOpenExploded3D,
}) => {
  const [selectedId, setSelectedId] = useState<ProductModelId>('caixa-m');

  const activeProduct: ProductFamilyItem =
    FRESHLOG_PRODUCTS.find((p) => p.id === selectedId) ?? FRESHLOG_PRODUCTS[1];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-16">
      {/* Header */}
      <section aria-labelledby="products-family-heading" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              Linha FreshBerrys · Padrão Modular Embrapa &amp; Palete PBR
            </p>
            <h1
              id="products-family-heading"
              className="text-3xl md:text-4xl font-bold text-[#142010] mt-1 leading-tight"
            >
              Cinco soluções modulares do campo até o balcão
            </h1>
            <p className="text-sm md:text-base text-[#4b5a45] mt-2 leading-relaxed">
              Todos os modelos compartilham a mesma base dimensional (Embrapa 50×30 / 60×50 cm e
              palete PBR 120×100 cm), porta frontal de abertura lateral e monitoramento offline por
              QR Code — sem nunca reembalar a fruta.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpen3D(activeProduct.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1d4c0b] text-[#b9fc12] hover:bg-[#133407] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Box className="w-4 h-4" aria-hidden="true" />
            <span>Inspecionar {activeProduct.shortName} em 3D</span>
          </button>
        </div>

        {/* Interactive 5-Product Selector Bar */}
        <div
          role="tablist"
          aria-label="Selecionar modelo da linha FreshBerrys"
          className="flex flex-wrap gap-2 pt-2"
        >
          {FRESHLOG_PRODUCTS.map((product) => {
            const active = product.id === activeProduct.id;
            return (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedId(product.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1d4c0b] text-[#b9fc12] border-[#1d4c0b]'
                    : 'bg-white text-[#142010] border-[#dce3d4] hover:border-[#1d4c0b]/50'
                }`}
              >
                {product.shortName}
              </button>
            );
          })}
        </div>

        {/* Selected Product Spotlight Card */}
        <div
          className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          data-testid="product-spotlight"
        >
          <div className="lg:col-span-6 bg-[#eef2e7] flex flex-col justify-between">
            <ResilientImage
              src={activeProduct.renderSrc}
              alt={activeProduct.renderAlt}
              className="w-full h-full min-h-[290px] max-h-[420px] object-cover"
            />
          </div>

          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono font-semibold text-[#1d4c0b]">
                  {activeProduct.roleTag}
                </p>
                <h2 className="text-2xl font-bold text-[#142010] mt-1">{activeProduct.name}</h2>
                <p className="text-sm text-[#4b5a45] mt-1.5 leading-relaxed">
                  {activeProduct.idealFor}
                </p>
              </div>

              {/* Compact Key Spec Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
                  <p className="text-[11px] text-[#4b5a45]">Dimensões externas</p>
                  <p className="text-sm font-bold font-mono tabular-nums text-[#142010] mt-0.5">
                    {activeProduct.externalDimensions}
                  </p>
                </div>
                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
                  <p className="text-[11px] text-[#4b5a45]">Capacidade de frutas</p>
                  <p className="text-xs font-semibold text-[#142010] mt-0.5 leading-snug">
                    {activeProduct.fruitCapacity}
                  </p>
                </div>
                <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-3">
                  <p className="text-[11px] text-[#4b5a45]">Gelo e autonomia</p>
                  <p className="text-xs font-semibold text-[#1d4c0b] mt-0.5 leading-snug">
                    {activeProduct.iceAndAutonomy}
                  </p>
                </div>
                <div className="bg-[#f4fccf] border border-[#dce6b3] rounded-xl p-3">
                  <p className="text-[11px] text-[#1d4c0b]">Uso parceiro · Compra</p>
                  <p className="text-xs font-bold font-mono tabular-nums text-[#1d4c0b] mt-0.5">
                    {activeProduct.partnerRentalBrl}
                  </p>
                  <p className="text-[11px] font-mono tabular-nums text-[#3c4a36]">
                    Compra: {activeProduct.purchasePriceBrl}
                  </p>
                </div>
              </div>

              {/* Engineering Highlights */}
              <ul className="space-y-2 pt-1">
                {activeProduct.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2 text-xs text-[#2f3d29] leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-[#1d4c0b] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#e8eee0] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#4b5a45]">
                <span className="font-semibold text-[#142010]">Acesso:</span>{' '}
                {activeProduct.doorDesign}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeProduct.id === 'caixa-m' && (
                  <a
                    href="#manual-caixa-m"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f4f7ef] border border-[#dce3d4] text-[#1d4c0b] hover:border-[#1d4c0b] text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Manual da Caixa M</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onOpen3D(activeProduct.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#b9fc12] text-[#142010] hover:bg-[#a6e60e] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Ver {activeProduct.shortName} em 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete 5-Product Visual Catalog Grid */}
      <section aria-labelledby="catalog-grid-heading" className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
            Catálogo Completo da Família
          </p>
          <h2 id="catalog-grid-heading" className="text-2xl font-bold text-[#142010] mt-1">
            Todos os 5 modelos da linha FreshBerrys
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRESHLOG_PRODUCTS.map((product) => {
            const isSelected = product.id === activeProduct.id;
            return (
              <article
                key={product.id}
                className={`bg-white rounded-2xl overflow-hidden border flex flex-col justify-between transition-colors ${
                  isSelected ? 'border-[#1d4c0b] ring-1 ring-[#1d4c0b]/20' : 'border-[#dce3d4]'
                }`}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(product.id)}
                    className="w-full block text-left cursor-pointer group"
                  >
                    <div className="aspect-[4/3] bg-[#edf1e7] overflow-hidden">
                      <ResilientImage
                        src={product.renderSrc}
                        alt={product.renderAlt}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  </button>

                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-[11px] font-mono font-semibold text-[#1d4c0b]">
                        {product.roleTag}
                      </p>
                      <h3 className="text-base font-bold text-[#142010] mt-0.5">{product.name}</h3>
                    </div>

                    <dl className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#eef2e8]">
                      <div>
                        <dt className="text-[#4b5a45]">Dimensão</dt>
                        <dd className="font-mono font-semibold text-[#142010] tabular-nums">
                          {product.externalDimensions}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#4b5a45]">Calor / kg</dt>
                        <dd className="font-mono font-semibold text-[#1d4c0b] tabular-nums">
                          {product.heatPerKg}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#4b5a45]">Aluguel / uso</dt>
                        <dd className="font-mono font-semibold text-[#142010] tabular-nums">
                          {product.partnerRentalBrl}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#4b5a45]">Vida útil</dt>
                        <dd className="font-mono font-semibold text-[#142010] tabular-nums">
                          {product.usefulLife}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(product.id)}
                    className="text-xs font-semibold text-[#4b5a45] hover:text-[#142010] cursor-pointer"
                  >
                    Detalhes técnicos
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpen3D(product.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f7ef] hover:bg-[#1d4c0b] text-[#1d4c0b] hover:text-[#b9fc12] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Abrir em 3D</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Caixa M Architectural Consistency Gallery (Lateral-Opening Door Everywhere) */}
      <section aria-labelledby="caixa-m-architecture-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
              Arquitetura de Dupla Abertura Lateral · Caixa M
            </p>
            <h2
              id="caixa-m-architecture-heading"
              className="text-2xl font-bold text-[#142010] mt-1"
            >
              Porta frontal lateral operável mesmo com caixas empilhadas
            </h2>
            <p className="text-sm text-[#4b5a45] mt-1.5 leading-relaxed">
              Diferente de caixas com tampa de encaixe solta, a porta frontal da Caixa M gira
              lateralmente sobre dobradiças em inox à direita e trava com dois fechos de compressão
              #b9fc12 à esquerda — fácil de operar com uma só mão no balcão da confeitaria.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1d4c0b]">
            <DoorOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Abertura lateral consistente em renders e 3D</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <figure className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden">
            <ResilientImage
              src={GENERATED_RENDERS.caixaMSideHinged}
              alt="Caixa M fechada mostrando dobradiças inox à direita, 2 fechos de compressão verde-lima à esquerda e 4 cantos em L"
              className="w-full aspect-[4/3] object-cover"
            />
            <figcaption className="p-4 space-y-1">
              <p className="text-sm font-bold text-[#142010]">1. Fechamento hermético em rota</p>
              <p className="text-xs text-[#4b5a45] leading-relaxed">
                Dobradiças verticais à direita, dois fechos laterais à esquerda, 4 encaixes em L
                completos no topo e alças laterais NR-17 embutidas.
              </p>
            </figcaption>
          </figure>

          <figure className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden">
            <ResilientImage
              src={GENERATED_RENDERS.caixaMOpen}
              alt="Caixa M com porta frontal lateral aberta e tampa superior levantada expondo cartuchos de gelo e gavetas de berries"
              className="w-full aspect-[4/3] object-cover"
            />
            <figcaption className="p-4 space-y-1">
              <p className="text-sm font-bold text-[#142010]">2. Dupla abertura independente</p>
              <p className="text-xs text-[#4b5a45] leading-relaxed">
                Tampa superior exclusiva para troca rápida dos 2 cartuchos de 2 kg e sachê CO₂;
                porta frontal lateral para carregar e retirar cumbucas sem tirar o gelo.
              </p>
            </figcaption>
          </figure>

          <figure className="bg-white border border-[#dce3d4] rounded-2xl overflow-hidden">
            <ResilientImage
              src={GENERATED_RENDERS.caixaMStackedContext}
              alt="Duas Caixas M empilhadas no balcão de confeitaria com a porta frontal da caixa inferior aberta lateralmente"
              className="w-full aspect-[4/3] object-cover"
            />
            <figcaption className="p-4 space-y-1">
              <p className="text-sm font-bold text-[#142010]">3. Microcâmara empilhada na loja</p>
              <p className="text-xs text-[#4b5a45] leading-relaxed">
                Mesmo com outra Caixa M travada em cima, a porta lateral abre suavemente e a gaveta
                desliza sem desmontar a pilha (e economiza 25–30% de frio).
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Interactive Caixa M Product Manual (All 12 Components) */}
      <CaixaMManualSection onOpenExploded3D={onOpenExploded3D} />

      {/* Dedicated Accessibility & Humanitarian Design Section */}
      <section
        aria-labelledby="humanitarian-design-heading"
        className="bg-[#1d4c0b] text-white rounded-2xl p-6 md:p-10 space-y-8"
        data-testid="humanitarian-design-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#b9fc12] uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              <span>Design Acessível &amp; Humanitário · Centrado no Público-Alvo</span>
            </div>
            <h2
              id="humanitarian-design-heading"
              className="text-2xl md:text-3xl font-bold leading-tight text-white"
            >
              Pensado para a dignidade, saúde física e autonomia de quem trabalha com o alimento
            </h2>
            <p className="text-sm text-[#f4fccf]/90 leading-relaxed max-w-3xl">
              Cada detalhe estrutural das caixas FreshBerrys — do peso ergonômico às cores de alto
              contraste e à abertura lateral com uma só mão — nasceu da realidade de famílias
              produtoras do Sul de Minas e de Atibaia, motoristas de van seca e confeiteiros que
              operam de madrugada sem câmara fria nem empilhadeira.
            </p>
          </div>
          <div className="lg:col-span-4 bg-white/10 border border-white/15 rounded-xl p-4 space-y-1">
            <p className="text-xs font-mono text-[#b9fc12] font-bold">Impacto humano direto</p>
            <p className="text-xs text-[#f4fccf]/90 leading-relaxed">
              Tecnologia cidadã que protege a renda de pequenos produtores, previne lesões físicas
              no manuseio diário e evita que alimento fresco e sem fungicidas vire lixo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HUMANITARIAN_DESIGN_PILLARS.map((pillar) => (
            <article
              key={pillar.number}
              className="bg-white/10 border border-white/15 rounded-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-[#b9fc12]">Pilar {pillar.number}</span>
                  <span className="text-[#f4fccf]/80">{pillar.audienceNeed}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{pillar.title}</h3>
                <p className="text-xs md:text-sm text-[#f4fccf]/90 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <p className="pt-3 border-t border-white/15 text-xs font-semibold text-[#b9fc12]">
                {pillar.practicalBenefit}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Seamless Chain Integration Strip */}
      <section
        aria-labelledby="chain-flow-heading"
        className="bg-white border border-[#dce3d4] rounded-2xl p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1d4c0b] uppercase tracking-wider">
          <Truck className="w-4 h-4" aria-hidden="true" />
          <span>Integração na Cadeia · Zero Reembalagem</span>
        </div>
        <h2 id="chain-flow-heading" className="text-2xl font-bold text-[#142010]">
          Como os 5 equipamentos se conectam na mesma operação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-5 space-y-2">
            <p className="text-xs font-mono font-bold text-[#1d4c0b]">
              01 · Trecho Longo (200 kg a 4 t)
            </p>
            <h3 className="text-base font-bold text-[#142010]">
              Contêiner de Palete &amp; Meio Palete
            </h3>
            <p className="text-xs text-[#4b5a45] leading-relaxed">
              Recebem 8 ou 16 caixas Embrapa direto da câmara da fazenda, viajam em caminhão seco
              com CO₂ por cilindro a R$ 0,08–0,15/kg e dobram as paredes no retorno.
            </p>
          </div>

          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-5 space-y-2">
            <p className="text-xs font-mono font-bold text-[#1d4c0b]">
              02 · Distribuição &amp; Ponto de Venda
            </p>
            <h3 className="text-base font-bold text-[#142010]">
              Caixa M + Base com Rodízios
            </h3>
            <p className="text-xs text-[#4b5a45] leading-relaxed">
              4 Caixas M (~36 kg) rolam juntas da van até a cozinha ou empório sem empilhadeira.
              No balcão, ficam empilhadas servindo cumbucas pela porta frontal lateral.
            </p>
          </div>

          <div className="bg-[#f6f8f3] border border-[#e4eadc] rounded-xl p-5 space-y-2">
            <p className="text-xs font-mono font-bold text-[#1d4c0b]">
              03 · Última Milha &amp; Pequeno Estoque
            </p>
            <h3 className="text-base font-bold text-[#142010]">Caixa P (Entrega Final)</h3>
            <p className="text-xs text-[#4b5a45] leading-relaxed">
              Leva ~3 kg de berries em baú de moto, bicicleta ou carro por ~11 h abaixo de 5 °C,
              com a mesma porta lateral e o mesmo certificado digital QR.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
