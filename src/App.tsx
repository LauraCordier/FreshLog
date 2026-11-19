import React, { useCallback, useState } from 'react';
import { QrCode } from 'lucide-react';
import {
  normalizeMechanismState,
  type BoxMechanismState,
  type ProductModelId,
} from './utils/coldChainModel';
import { ORIGINAL_ASSETS } from './data/freshBerrysData';
import { ProblemStoryView } from './components/ProblemStoryView';
import { Box3DViewport } from './components/Box3DViewport';
import { ProductLineView } from './components/ProductLineView';
import { RouteAndROIView } from './components/RouteAndROIView';
import { TechnicalSpecsView } from './components/TechnicalSpecsView';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';

type AppTab = 'problem' | 'studio3d' | 'products' | 'route-roi' | 'specs';

const NAV_ITEMS: Array<{ id: AppTab; label: string }> = [
  { id: 'problem', label: 'O Problema' },
  { id: 'studio3d', label: 'Estúdio 3D' },
  { id: 'products', label: 'Linha FreshBerrys' },
  { id: 'route-roi', label: 'Custos & ROI' },
  { id: 'specs', label: 'Engenharia' },
];

const INITIAL_MECHANISM: BoxMechanismState = {
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

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('problem');
  const [selectedProductId, setSelectedProductId] = useState<ProductModelId>('caixa-m');
  const [mechanism, setMechanism] = useState<BoxMechanismState>(INITIAL_MECHANISM);
  const [certOpen, setCertOpen] = useState(false);

  const handleMechanismChange = useCallback((patch: Partial<BoxMechanismState>) => {
    setMechanism((prev) => normalizeMechanismState(prev, patch));
  }, []);

  const handleResetMechanism = useCallback(() => {
    setMechanism(INITIAL_MECHANISM);
  }, []);

  const handleOpen3D = useCallback((productId?: ProductModelId) => {
    if (productId) {
      setSelectedProductId(productId);
      setMechanism({
        ...INITIAL_MECHANISM,
        frontDoorOpen: productId !== 'caixa-m',
      });
    }
    setActiveTab('studio3d');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleOpenExploded3D = useCallback(() => {
    setSelectedProductId('caixa-m');
    setMechanism({
      ...INITIAL_MECHANISM,
      frontDoorOpen: true,
      topLidOpen: false,
      showAirflow: true,
      explodeAmount: 0.65,
    });
    setActiveTab('studio3d');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSelectProductIn3D = useCallback((productId: ProductModelId) => {
    setSelectedProductId(productId);
    setMechanism(INITIAL_MECHANISM);
  }, []);

  const handleNavClick = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F3] text-[#142010]">
      {/* Strict 3-Zone Top Bar Contract: [Transparent FreshLog Logo] — [5 single-line nav links] — [1 primary CTA] */}
      <header className="sticky top-0 z-30 h-16 bg-[#1d4c0b] border-b border-[#143707] px-4 md:px-6 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Transparent FreshLog Logo (no background box) */}
        <button
          type="button"
          onClick={() => handleNavClick('problem')}
          aria-label="FreshLog — Página inicial"
          className="flex items-center shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9fc12]"
        >
          <img
            src={ORIGINAL_ASSETS.logo}
            alt="FreshLog"
            referrerPolicy="no-referrer"
            className="h-9 w-auto object-contain"
          />
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-4 md:gap-7 overflow-x-auto no-scrollbar"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-2 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-[#b9fc12]'
                    : 'text-[#f4fccf]/85 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[17px] h-0.5 bg-[#b9fc12]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setCertOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 md:px-4 py-2 rounded-lg bg-[#b9fc12] text-[#142010] hover:bg-[#a6e60e] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Certificado QR</span>
            <span className="sm:hidden">QR</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'problem' && (
          <ProblemStoryView
            onOpen3D={handleOpen3D}
            onOpenProducts={() => handleNavClick('products')}
            onOpenCertificate={() => setCertOpen(true)}
          />
        )}

        {activeTab === 'studio3d' && (
          <Box3DViewport
            selectedProductId={selectedProductId}
            onSelectProduct={handleSelectProductIn3D}
            mechanism={mechanism}
            onMechanismChange={handleMechanismChange}
            onResetMechanism={handleResetMechanism}
          />
        )}

        {activeTab === 'products' && (
          <ProductLineView
            onOpen3D={handleOpen3D}
            onOpenExploded3D={handleOpenExploded3D}
          />
        )}

        {activeTab === 'route-roi' && (
          <RouteAndROIView onOpenCertificate={() => setCertOpen(true)} />
        )}

        {activeTab === 'specs' && <TechnicalSpecsView />}
      </main>

      {/* Branded Footer with Transparent Logo & Team Credit */}
      {activeTab !== 'studio3d' && (
        <footer className="border-t border-[#143707] bg-[#1d4c0b] px-6 py-7 text-xs text-[#f4fccf]/90">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={ORIGINAL_ASSETS.logo}
                alt="FreshLog"
                referrerPolicy="no-referrer"
                className="h-8 w-auto object-contain shrink-0"
              />
              <span className="text-[#f4fccf]/80">
                Rede de Frio Móvel · Linha FreshBerrys · Temperatura baixa? Tá na caixa!
              </span>
            </div>
            <p className="text-[#b9fc12] font-medium leading-relaxed">
              Desenvolvido por: Laura Cordeiro, Jonathan Medeiros e Luis Trindade para Global
              Solution CitizenTech - FIAP.
            </p>
          </div>
        </footer>
      )}

      {/* Digital Trip Certificate Modal */}
      <DigitalCertificateModal
        open={certOpen}
        co2Enabled={mechanism.co2Active}
        onClose={() => setCertOpen(false)}
      />
    </div>
  );
}
