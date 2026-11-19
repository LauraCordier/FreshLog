import type { ProductModelId } from '../utils/coldChainModel';

export interface ProductFamilyItem {
  id: ProductModelId;
  name: string;
  shortName: string;
  roleTag: string;
  externalDimensions: string;
  internalDimensions: string;
  emptyWeight: string;
  fruitCapacity: string;
  iceAndAutonomy: string;
  heatIngressW: string;
  heatPerKg: string;
  surfaceAreaM2: string;
  movement: string;
  purchasePriceBrl: string;
  partnerRentalBrl: string;
  dailyStorageBrl: string;
  usefulLife: string;
  co2Method: string;
  doorDesign: string;
  idealFor: string;
  highlights: string[];
  renderSrc: string;
  renderAlt: string;
}

export interface ProblemPillar {
  number: string;
  title: string;
  metric: string;
  description: string;
}

export interface FieldCaseStudy {
  id: string;
  title: string;
  region: string;
  situation: string;
  whatGoesWrong: string;
  whyNoReefer: string;
  financialImpact: string;
  recommendedModels: string;
}

export interface FreightComparisonRow {
  option: string;
  freight: string;
  invoiceTaxes: string;
  coldCost: string;
  total: string;
  perKg: string;
  provenCold: string;
  highlight?: boolean;
}

export interface StakeholderStage {
  id: 'produtor' | 'transportadora' | 'distribuidor' | 'confeitaria';
  step: string;
  role: string;
  locationContext: string;
  painBefore: string;
  freshBerrysGain: string;
  designFeatureUsed: string;
  headlineMetric: string;
}

export interface IoTSensorComponent {
  part: string;
  role: string;
}

export interface TechnicalSpecRow {
  category: string;
  parameter: string;
  value: string;
  rationale: string;
}

export const GENERATED_RENDERS = {
  caixaMSideHinged: '/src/assets/images/freshberrys_caixa_m_sidehinged_1795099976940.jpg',
  caixaMOpen: '/src/assets/images/freshberrys_caixa_m_open_v2_1795102258260.jpg',
  caixaMStackedContext: '/src/assets/images/freshberrys_caixa_m_stacked_v2_1795102258334.jpg',
  caixaP: '/src/assets/images/freshberrys_caixa_p_render_1795099975912.jpg',
  baseRodizios: '/src/assets/images/freshberrys_base_rodizios_v3_1795103293740.jpg',
  meioPalete: '/src/assets/images/freshberrys_meio_palete_render_1795099976281.jpg',
  conteinerPalete: '/src/assets/images/freshberrys_conteiner_palete_render_1795099974645.jpg',
} as const;

export const ORIGINAL_ASSETS = {
  schematic: '/assets/aistudio/image_e4da8f79.png',
  logo: '/assets/aistudio/freshlog_logo_trimmed.png',
} as const;

/**
 * Complete FreshBerrys 5-Product Family from the official FreshLog document
 * (Capa térmica de palete intentionally excluded per product scope).
 */
export const FRESHLOG_PRODUCTS: ProductFamilyItem[] = [
  {
    id: 'caixa-p',
    name: 'Caixa P — Entrega Final',
    shortName: 'Caixa P',
    roleTag: 'Última milha · Moto & Balcão',
    externalDimensions: '50 × 30 × 35 cm',
    internalDimensions: '~41 × 21 × 23,5 cm (~20 L)',
    emptyWeight: '~3,5 kg vazia (~6–10 kg cheia)',
    fruitCapacity: '~3 kg em cumbucas (4/camada × 3) ou 6–7 kg granel',
    iceAndAutonomy: '2 cartuchos de ~1 kg na tampa · ~11 h < 5 °C a 30 °C',
    heatIngressW: '~17 W',
    heatPerKg: '~5,7 W/kg',
    surfaceAreaM2: '~0,86 m²',
    movement: 'Mão (alça superior), baú de moto ou cesto de bicicleta',
    purchasePriceBrl: 'R$ 300–450',
    partnerRentalBrl: 'R$ 6–9 / uso',
    dailyStorageBrl: 'R$ 1,50–2,00 / dia',
    usefulLife: '~450 usos ou 5 anos',
    co2Method: 'Sachê emissor ativado por fita + válvula de alívio',
    doorDesign: 'Porta frontal com abertura lateral + tampa superior vedada em EPDM',
    idealFor: 'Entrega final urbana, envio de amostras e pequeno estoque frio em confeitarias e cafeterias.',
    highlights: [
      'Base 50 × 30 cm do padrão Embrapa — encaixa no mesmo palete e carrinho da família',
      'Alça superior dobrável de alta visibilidade (#b9fc12) e 4 cantos em L',
      'Mesmo ciclo de convecção natural, placa difusora e manta absorvente da Caixa M',
    ],
    renderSrc: GENERATED_RENDERS.caixaP,
    renderAlt: 'Render industrial da Caixa P FreshBerrys com porta lateral aberta exibindo framboesas e mirtilos',
  },
  {
    id: 'caixa-m',
    name: 'Caixa M — Modelo Principal',
    shortName: 'Caixa M',
    roleTag: 'Distribuição · Estoque em Loja',
    externalDimensions: '60 × 50 × 35 cm',
    internalDimensions: '~51 × 41 × 23,5 cm (~49 L)',
    emptyWeight: '~6,5 kg vazia (~20 kg cheia)',
    fruitCapacity: '~8–9 kg em cumbucas (3–4 camadas) ou até ~15 kg granel',
    iceAndAutonomy: '2 cartuchos de ~2 kg na tampa · ~12–14 h a 30 °C (~16–18 h empilhada)',
    heatIngressW: '~27 W',
    heatPerKg: '~3,0 W/kg',
    surfaceAreaM2: '~1,37 m²',
    movement: 'Alças laterais embutidas NR-17 · pilhas de até 5 · 4 por camada no PBR',
    purchasePriceBrl: 'R$ 550–800',
    partnerRentalBrl: 'R$ 5–8 (sem CO₂) · R$ 8–12 (com CO₂)',
    dailyStorageBrl: 'R$ 1,50–2,50 / dia',
    usefulLife: '~450 usos ou 5 anos',
    co2Method: 'Sachê emissor na tampa ativado por fita + válvula de alívio',
    doorDesign: 'Porta frontal articulada lateral (dobradiças inox à direita, 2 fechos #b9fc12 à esquerda) + tampa superior articulada',
    idealFor: 'Produtor → comprador, distribuição para lojas e microcâmara de balcão em confeitarias e empórios sem câmara fria.',
    highlights: [
      'Abertura frontal lateral operável mesmo empilhada — retira cumbucas sem desmontar a pilha',
      '4 encaixes de empilhamento em L completos que reduzem perda térmica em 25–30% quando empilhadas',
      'Custo de uso entre R$ 0,49 e R$ 1,22/kg com CO₂; gera ~R$ 4–16 mil líquidos ao longo da vida útil',
    ],
    renderSrc: GENERATED_RENDERS.caixaMSideHinged,
    renderAlt: 'Render industrial da Caixa M FreshBerrys fechada com dobradiças laterais inox e fechos de compressão',
  },
  {
    id: 'base-rodizios',
    name: 'Base com Rodízios — Meio Palete',
    shortName: 'Base Rodízios',
    roleTag: 'Movimentação · Sem Empilhadeira',
    externalDimensions: '60 × 100 × 15 cm',
    internalDimensions: 'Plataforma meio palete PBR (2 × 2 Caixas M)',
    emptyWeight: '~11 kg vazia (~80 kg com 4 Caixas M)',
    fruitCapacity: '~36 kg de berries (4 Caixas M)',
    iceAndAutonomy: 'Igual à Caixa M (~16–18 h empilhada)',
    heatIngressW: 'Plataforma passiva',
    heatPerKg: 'Reduz perdas na pilha',
    surfaceAreaM2: '0,60 m² de piso',
    movement: 'Empurrada por 2 alças laterais ergonômicas (#b9fc12) · 4 rodízios (2 com trava de pé)',
    purchasePriceBrl: 'R$ 350–500',
    partnerRentalBrl: 'R$ 2–3 / uso',
    dailyStorageBrl: 'Incluída na rota',
    usefulLife: '~5 anos',
    co2Method: 'Operado individualmente em cada Caixa M',
    doorDesign: '2 alças laterais em arco de contenção para segurar as caixas + batentes em L no deck',
    idealFor: 'Feiras, CEAGESP, empórios, restaurantes e operações sem empilhadeira ou doca nivelada.',
    highlights: [
      '2 alças laterais rígidas com pega #b9fc12 que abraçam e seguram a pilha de 4 Caixas M em curvas e rampas',
      'Descarrega ~36 kg de berries de uma só vez do veículo direto até a cozinha ou balcão sem esforço lombar',
      'Rodízios de poliuretano silenciosos com travas de pé verde-lima e acesso livre às portas frontais laterais',
    ],
    renderSrc: GENERATED_RENDERS.baseRodizios,
    renderAlt: 'Render industrial da Base com Rodízios FreshLog com 2 alças laterais segurando 4 Caixas M identificadas com a logo FreshLog',
  },
  {
    id: 'meio-palete',
    name: 'Meio Palete Isotérmico',
    shortName: 'Meio Palete',
    roleTag: 'Produtor Médio · Van Teto Alto',
    externalDimensions: '~1,32 × 0,62 × 1,75 m',
    internalDimensions: '1,20 × 0,50 × 1,55 m',
    emptyWeight: '~50–70 kg vazio',
    fruitCapacity: '~100 kg (8 caixas Embrapa 60 × 50 de ~12,5 kg)',
    iceAndAutonomy: 'Paredes 60 mm PU · ~15 kg placas de gelo no teto · ~12 h a 30 °C',
    heatIngressW: '~117 W',
    heatPerKg: '~1,2 W/kg',
    surfaceAreaM2: '~8,4 m²',
    movement: 'Paleteira ou carrinho de meio palete · paredes dobráveis no retorno',
    purchasePriceBrl: 'R$ 3.000–4.500',
    partnerRentalBrl: 'R$ 20–30 / uso',
    dailyStorageBrl: 'R$ 6–9 / dia',
    usefulLife: '~1.000 usos ou 8 anos',
    co2Method: 'Injeção por cilindro externo ao fechar + sensores no topo e base',
    doorDesign: 'Porta frontal única de altura total com abertura lateral, vedação EPDM e 3 fechos #b9fc12',
    idealFor: 'Produtor médio com van de teto alto ou caminhão leve em rotas diretas de 100 a 200 kg com poucas paradas.',
    highlights: [
      'Recebe as caixas Embrapa vazadas que o produtor já utiliza — zero reembalagem',
      '2,5× menos entrada de calor por kg que a Caixa M (~1,2 W/kg); ventilador 12 V opcional',
      'Custo de frio cai para ~R$ 0,10–0,15/kg com paredes dobráveis para frete de retorno compacto',
    ],
    renderSrc: GENERATED_RENDERS.meioPalete,
    renderAlt: 'Render industrial do Meio Palete Isotérmico FreshLog aberto exibindo 8 caixas Embrapa e placa de gelo no teto',
  },
  {
    id: 'conteiner-palete',
    name: 'Contêiner de Palete PBR',
    shortName: 'Contêiner',
    roleTag: 'Trecho Longo · 200 kg a 4 t',
    externalDimensions: '~1,32 × 1,12 × 1,75 m',
    internalDimensions: '1,20 × 1,00 × 1,55 m',
    emptyWeight: '~100–150 kg vazio',
    fruitCapacity: '~200 kg (16 caixas Embrapa 60 × 50 de ~12,5 kg)',
    iceAndAutonomy: 'Paredes 60 mm PU · ~21 kg placas de gelo no teto · ~12 h a 30 °C',
    heatIngressW: '~162 W',
    heatPerKg: '~0,8 W/kg',
    surfaceAreaM2: '~11,5 m²',
    movement: 'Paleteira ou empilhadeira · paredes dobráveis · até 20 unidades (~4 t) por carreta',
    purchasePriceBrl: 'R$ 6.000–8.500',
    partnerRentalBrl: 'R$ 30–40 / uso',
    dailyStorageBrl: 'R$ 9–14 / dia',
    usefulLife: '~1.000 usos ou 10 anos',
    co2Method: 'Injeção de CO₂ por cilindro ao fechar (princípio Tectrol usado nos EUA)',
    doorDesign: 'Porta frontal dupla com abertura lateral em folha dupla, vedação EPDM e travas verticais #b9fc12',
    idealFor: 'Trecho longo de distribuidores, cooperativas e grupos de produtores levando 200 kg a ~4 t até CEAGESP ou CD.',
    highlights: [
      'Máxima eficiência térmica da linha: apenas ~0,8 W/kg e ~10% do peso da carga em gelo para 12 h',
      'Custo de frio de apenas ~R$ 0,08–0,10/kg — substitui frete frigorífico dedicado em até 80% de economia',
      'Telemetria com sensores no topo e na base + módulo celular opcional para rastreio à distância',
    ],
    renderSrc: GENERATED_RENDERS.conteinerPalete,
    renderAlt: 'Render industrial do Contêiner de Palete FreshLog com porta dupla aberta mostrando 16 caixas de berries',
  },
];

export const PROBLEM_PILLARS: ProblemPillar[] = [
  {
    number: '01',
    title: 'Acima de 5 °C, fungos agressivos despertam',
    metric: 'Até 10× mais rápido a 20 °C',
    description:
      'Segundo Embrapa e Universidade da Califórnia, 70% da conservação depende da temperatura. A cada +10 °C a fruta perde metade da vida útil; fora do frio, cada hora de atraso reduz ~5% da fruta comercializável e 7 h no calor cortam metade da carga de morango.',
  },
  {
    number: '02',
    title: 'Vibração do veículo acelera o desgaste',
    metric: '+50% de desgaste mecânico',
    description:
      'A trepidação contínua em estradas e calçamentos urbanos causa microlesões invisíveis na casca fina de morangos, framboesas e mirtilos, abrindo portas para colapso de polpa e vazamento de suco antes mesmo de chegar ao cliente.',
  },
  {
    number: '03',
    title: '“Esquenta e esfria” gera suor e mofo sem volta',
    metric: '0 fungicidas pós-colheita no Brasil',
    description:
      'Quando a fruta fria encontra ar quente na doca ou na geladeira doméstica, a cumbuca sua por dentro e cria água livre. Como a legislação brasileira proíbe fungicida pós-colheita, só frio contínuo < 5 °C + carga 100% seca + CO₂ dobra a validade de 5–10 para 10–21 dias.',
  },
];

export const REAL_FIELD_CASES: FieldCaseStudy[] = [
  {
    id: 'framboesa-mantiqueira',
    title: 'Produtor de Framboesa e Amora (~1 ha)',
    region: 'Serra da Mantiqueira → São Paulo (250–300 km)',
    situation: 'Colhe 20–30 kg/dia e entrega 2–3× por semana de carro ou van em isopor com gelo.',
    whatGoesWrong:
      'A framboesa dura apenas 1–3 dias; o isopor amassa as cumbucas de baixo, o gelo derretido molha a fruta e o mofo cinzento aparece na loja.',
    whyNoReefer: 'Volume pequeno por entrega — um frete frigorífico dedicado custaria mais do que a própria fruta.',
    financialImpact:
      'Em 6 t/ano (R$ 35–60/kg), cada 5% perdido custa R$ 10–18 mil. Com a Caixa M: ~R$ 3–13 mil/ano em perda evitada + ~R$ 21–50 mil expandindo raio para 12 h.',
    recommendedModels: 'Caixa M + Caixa P',
  },
  {
    id: 'morango-sul-minas',
    title: 'Produtor Familiar de Morango',
    region: 'Sul de Minas / Pouso Alegre (~9.500 produtores)',
    situation: '97% da produção vem da agricultura familiar; despacha para atravessador ou CEASA em caminhão seco.',
    whatGoesWrong:
      'Colheita de manhã + 3–4 h de estrada + espera de madrugada na CEAGESP sem frio: no verão, cada hora sem resfriar tira ~5% da carga vendável.',
    whyNoReefer: 'Carga fracionada em frigorífico sai 4,5× a 6× mais cara que o baú seco.',
    financialImpact:
      'Sem onde guardar, precisa liquidar no dia mesmo com preço baixo; na venda consignada, a perda volta toda para o produtor.',
    recommendedModels: 'Caixa M + Meio Palete (venda direta / premium)',
  },
  {
    id: 'morango-premium',
    title: 'Produtor de Morango Premium (Hidropônico / Orgânico)',
    region: 'Atibaia e Cinturão Verde → Empórios & Restaurantes',
    situation: 'Faz rota direta com várias paradas em empórios e confeitarias exigentes.',
    whatGoesWrong:
      'Abrir a porta do baú a cada parada aquece toda a carga; o isopor quebra em poucas viagens e o comprador exige prova de frio.',
    whyNoReefer: 'Em 360 kg a 150 km, frigorífico dedicado custa R$ 1.450–1.950 contra ~R$ 320 no baú seco.',
    financialImpact:
      'Com fruta acima de R$ 22/kg ou prêmio de 5% pela certificação QR, o investimento retorna em 0,5 a 1,6 ano.',
    recommendedModels: 'Caixa M + Base com Rodízios',
  },
  {
    id: 'importadas-chile',
    title: 'Distribuidor de Berries Importadas (Cereja & Mirtilo)',
    region: 'Aeroporto / Porto → Última milha metropolitana',
    situation: 'Recebe cereja e mirtilo do Chile já resfriados e redistribui para empórios e restaurantes.',
    whatGoesWrong:
      'A cadeia fria rompe justamente na última milha em vans secas; fruta gelada em ar quente condensa água e acelera a podridão.',
    whyNoReefer: 'Entregas pulverizadas de 10 a 200 kg tornam a frota refrigerada ociosa e cara.',
    financialImpact:
      'Reduz ~3 pontos de perda (~1,5 t / ~R$ 60 mil/ano) gerando ~R$ 12–32 mil líquidos/ano + ~R$ 40–100 mil em novas cidades; retorno em 0,7–1,7 ano.',
    recommendedModels: 'Contêiner de Palete + Caixa M + Caixa P',
  },
  {
    id: 'confeitaria-sem-camara',
    title: 'Confeitaria, Cafeteria ou Empório sem Câmara Fria',
    region: 'Ponto de venda urbano · 5 a 50 kg/semana',
    situation: 'Compra berries 1–2× por semana e armazena em geladeira doméstica lotada ou balcão.',
    whatGoesWrong:
      'Abre-e-fecha constante, umidade alta e troca de odores fazem a fruta murchar ou mofar (~22% de perda média em estabelecimentos).',
    whyNoReefer: 'Instalar câmara fria fixa em loja pequena é caro e inviável fisicamente.',
    financialImpact:
      'A Caixa M atua como microcâmara de balcão por R$ 1,50–2,50/dia, cortando perdas de 15% para 5% (~R$ 3,5–3,8 mil/ano) com payback em 4–6 meses.',
    recommendedModels: 'Caixa M (porta frontal empilhada) + Caixa P',
  },
];

export const FREIGHT_COMPARISON_360KG: FreightComparisonRow[] = [
  {
    option: 'Frigorífico dedicado (2 eixos · ANTT)',
    freight: '~R$ 1.450–1.950',
    invoiceTaxes: 'R$ 40–200',
    coldCost: 'Incluído',
    total: 'R$ 1.490–2.150',
    perKg: 'R$ 4,14–5,97',
    provenCold: 'Depende da transportadora',
  },
  {
    option: 'Baú seco sem frio (com perdas)',
    freight: '~R$ 320',
    invoiceTaxes: 'R$ 40–200',
    coldCost: '—',
    total: 'R$ 360–520 + perdas',
    perKg: 'R$ 1,00–1,44 + perdas',
    provenCold: 'Não',
  },
  {
    option: 'Baú seco + 40 Caixas M FreshBerrys',
    freight: '~R$ 320',
    invoiceTaxes: 'R$ 40–200',
    coldCost: 'R$ 180–390',
    total: 'R$ 540–910',
    perKg: 'R$ 1,50–2,53',
    provenCold: 'Sim, por caixa (QR)',
    highlight: true,
  },
  {
    option: 'Baú seco + 4 Meios Paletes Isotérmicos',
    freight: '~R$ 320',
    invoiceTaxes: 'R$ 40–200',
    coldCost: 'R$ 40–60',
    total: 'R$ 400–580',
    perKg: 'R$ 1,11–1,61',
    provenCold: 'Sim, por palete (QR)',
    highlight: true,
  },
  {
    option: 'Baú seco + 2 Contêineres de Palete',
    freight: '~R$ 320',
    invoiceTaxes: 'R$ 40–200',
    coldCost: 'R$ 30–42',
    total: 'R$ 390–562',
    perKg: 'R$ 1,08–1,56',
    provenCold: 'Sim, por palete (QR)',
    highlight: true,
  },
];

export const FOUR_PRINCIPLES = [
  {
    step: '01',
    title: 'A fruta entra pré-resfriada (0–2 °C)',
    detail:
      'A rede de frio móvel guarda o frio gerado na câmara da fazenda e no freezer do usuário — ela mantém abaixo de 5 °C, não substitui o pré-resfriamento inicial.',
  },
  {
    step: '02',
    title: 'O frio fica em cima e circula sozinho',
    detail:
      'Cartuchos PCM (a −18 °C) no topo resfriam o ar denso que desce suavemente pela placa difusora (vão de ~15 mm evitando congelamento a −0,8 °C), enquanto o ar morno retorna pelos canais laterais.',
  },
  {
    step: '03',
    title: 'Tudo vedado com EPDM e CO₂ opcional',
    detail:
      'Vedações perimetrais na tampa superior e na porta frontal lateral retêm 10–15% de CO₂ (sachê por fita nas caixas P/M; cilindro nos paletes) com válvula de alívio travada em ~20%.',
  },
  {
    step: '04',
    title: 'Tudo medido com Certificado QR offline',
    detail:
      'O registrador ESP32-C3 grava temperatura, umidade, impactos e aberturas sem precisar de sinal de celular na estrada e entrega o certificado via Bluetooth/QR na chegada.',
  },
];

export const OPERATIONAL_CYCLE_STEPS = [
  { step: '1. Preparo', detail: 'Higienizar com sanitizante clorado, congelar cartuchos a −18 °C (12–24 h antes), trocar manta absorvente e encaixar o sachê de CO₂.' },
  { step: '2. Embarque', detail: 'Acomodar cumbucas pré-resfriadas (0–2 °C) pela porta frontal lateral, puxar a fita de CO₂, fechar os fechos e ler o QR Code.' },
  { step: '3. Viagem', detail: 'Transportar em qualquer carro, van ou caminhão seco (pilhas de até 5 Caixas M travadas pelos 4 cantos em L).' },
  { step: '4. Espera', detail: 'Se a doca ou armazenagem passar de ~12 h, abrir apenas a tampa superior e trocar os cartuchos reserva sem tocar nas frutas.' },
  { step: '5. Entrega & Loja', detail: 'Comprador aponta o celular para o QR Code, recebe o Certificado < 5 °C e usa a porta frontal lateral no dia a dia da loja.' },
  { step: '6. Retorno', detail: 'Caixas retornam na viagem seguinte (ou ficam em jogo fixo no cliente); meios paletes e contêineres dobram as paredes no retorno.' },
];

export const IOT_SENSOR_STACK: IoTSensorComponent[] = [
  { part: 'ESP32-C3', role: 'Controle, memória offline na estrada e Bluetooth (dorme entre leituras)' },
  { part: 'SHT40', role: 'Temperatura e umidade relativa do ar interno a cada 5–10 min' },
  { part: 'Sonda NTC (opcional)', role: 'Temperatura direta da polpa da fruta nas viagens de validação' },
  { part: 'LIS3DH', role: 'Acelerômetro de impactos e trepidação do veículo durante a rota' },
  { part: 'Sensor de tampa', role: 'Registra cada abertura da tampa superior ou porta frontal lateral' },
  { part: 'Bateria 18650', role: 'Meses de autonomia entre recargas; opção de módulo celular nos paletes' },
];

export const STAKEHOLDER_STAGES: StakeholderStage[] = [
  {
    id: 'produtor',
    step: '01',
    role: 'Produtor Rural',
    locationContext: 'Sul de Minas, Serra da Mantiqueira e Atibaia · 10 a 300 kg',
    painBefore:
      'Já possui câmara fria na fazenda, mas o lote pequeno não paga frigorífico dedicado — acaba perdendo margem no isopor ou vendendo excedente congelado por R$ 10–15/kg.',
    freshBerrysGain:
      'Envia fruta fresca a até ~700 km (12 h) abaixo de 5 °C em van seca, alcançando RJ, BH e Curitiba e gerando ~R$ 21–50 mil/ano extras em expansão de mercado (1 ha framboesa).',
    designFeatureUsed: 'Porta frontal lateral com gavetas + Tampa de troca rápida + Fita CO₂',
    headlineMetric: 'Raio de venda fresca salta de ~300 km para ~700 km',
  },
  {
    id: 'transportadora',
    step: '02',
    role: 'Transportadora de Carga Seca',
    locationContext: 'Vans comuns e caminhões leves em carga fracionada',
    painBefore:
      'Ficava fora do frete refrigerado de alto valor ou enfrentava custo de caminhão frigorífico 4,5× a 6× maior em cargas fracionadas de 360 kg.',
    freshBerrysGain:
      'Oferece frete frio certificado por caixa (R$ 1,50–2,53/kg vs R$ 4,14–5,97/kg do frigorífico) usando vans secas existentes e empilhamento travado nos 4 cantos em L.',
    designFeatureUsed: '4 encaixes em L antideslizantes + Base com Rodízios + Alças NR-17',
    headlineMetric: '40% a 80% mais barato por kg que frigorífico dedicado',
  },
  {
    id: 'distribuidor',
    step: '03',
    role: 'Distribuidor & Doca',
    locationContext: 'CEAGESP, entrepostos e última milha de importadas',
    painBefore:
      'Quebrava a cadeia fria na espera da doca e na última milha de cerejas e mirtilos importados, acumulando reclamações e descarte de fruta de R$ 40–80/kg.',
    freshBerrysGain:
      'Integra Contêineres no trecho longo com Caixas M e P na última milha sem reembalar, entregando Certificado Digital QR e gerando ~R$ 52–132 mil/ano combinados.',
    designFeatureUsed: 'Contêiner + Caixa M/P compatíveis PBR + Registrador ESP32-C3/QR',
    headlineMetric: 'Retorno do investimento em 0,7 a 1,7 ano (~R$ 60 mil/ano salvos)',
  },
  {
    id: 'confeitaria',
    step: '04',
    role: 'Confeitaria, Cafeteria & Empório',
    locationContext: 'Estabelecimentos sem câmara fria dedicada',
    painBefore:
      'Perdia até ~22% das berries na geladeira comum cheia de abre-e-fecha, umidade condensada e odores, além de gerar lixo com isopor.',
    freshBerrysGain:
      'Mantém a Caixa M ou P no balcão por R$ 1,50–2,50/dia, abrindo a porta frontal lateral mesmo empilhada e trocando os cartuchos pelo topo.',
    designFeatureUsed: 'Porta frontal lateral operável empilhada + Manta absorvente inferior',
    headlineMetric: 'Payback em 4–6 meses · Validade dobra para 10–21 dias',
  },
];

export const TECHNICAL_SPECS: TechnicalSpecRow[] = [
  {
    category: 'Padrão Modular',
    parameter: 'Compatibilidade Embrapa / Palete PBR',
    value: 'Bases 50×30, 60×50, 100×60 e 120×100 cm',
    rationale: 'A fruta sai do campo no padrão Embrapa e chega ao balcão sem nunca ser reembalada.',
  },
  {
    category: 'Isolamento Térmico',
    parameter: 'Parede sanduíche PU + PEAD',
    value: '40 mm (Caixas P/M) · 60 mm (Paletes) · k = 0,023 W/m·K',
    rationale: 'Isola ~3× melhor que isopor descartável e empilha sem esmagar cumbucas.',
  },
  {
    category: 'Acesso Duplo',
    parameter: 'Porta frontal lateral + Tampa superior',
    value: 'Dobradiças inox à direita + Fechos #b9fc12 à esquerda',
    rationale: 'Porta lateral permite retirar berries mesmo com caixas empilhadas; tampa superior serve exclusivamente para troca de gelo e sachê CO₂.',
  },
  {
    category: 'Proteção Anti-Congelamento',
    parameter: 'Placa difusora perfurada + vão aéreo',
    value: 'Separação de ~15 mm (gelo −18 °C vs morango −0,8 °C)',
    rationale: 'Garante que o ar frio desça de forma homogênea sem nunca congelar a camada superior.',
  },
  {
    category: 'Controle de Umidade',
    parameter: 'Canais de retorno + Calha + Manta',
    value: 'Escoamento lateral com manta absorvente removível',
    rationale: 'Impede acúmulo de água livre nas cumbucas, eliminando o gatilho do mofo cinzento.',
  },
  {
    category: 'Atmosfera Modificada',
    parameter: 'CO₂ controlado a 10–15%',
    value: 'Sachê por fita (P/M) · Cilindro (Paletes) · Válvula ~20%',
    rationale: 'Dobra a vida útil de 5–10 para 10–21 dias sem fungicidas; válvula evita sabor estranho acima de 20%.',
  },
];

export interface HumanitarianDesignPillar {
  number: string;
  audienceNeed: string;
  title: string;
  description: string;
  practicalBenefit: string;
}

export const HUMANITARIAN_DESIGN_PILLARS: HumanitarianDesignPillar[] = [
  {
    number: '01',
    audienceNeed: 'Agricultura familiar · 97% no Sul de Minas',
    title: 'Democratização do frio para quem não tem caminhão frigorífico',
    description:
      'Pequenos produtores de morango, framboesa e mirtilo raramente têm capital para investir em frota refrigerada ou volume mínimo para pagar frete frigorífico dedicado. A linha FreshBerrys leva tecnologia de conservação profissional a lotes de 3 kg a 200 kg em qualquer carro ou van seca, protegendo a renda de famílias produtoras.',
    practicalBenefit: 'Evita venda emergencial a preço baixo e amplia o raio de comercialização de ~300 km para ~700 km.',
  },
  {
    number: '02',
    audienceNeed: 'Saúde física & Ergonomia NR-17',
    title: 'Alívio lombar, pega segura e movimentação sem empilhadeira',
    description:
      'As alças laterais embutidas são independentes dos fechos e projetadas para mãos úmidas ou com luvas, respeitando o limite ergonômico (~20 kg na Caixa M e ~6–10 kg na Caixa P). Já a Base com Rodízios com travas de pé permite empurrar 4 Caixas M (~36 kg) diretamente da van até a cozinha ou feira sem esforço repetitivo nas costas.',
    practicalBenefit: 'Reduz lesões por levantamento de carga em operações familiares, docas urbanas e confeitarias.',
  },
  {
    number: '03',
    audienceNeed: 'Acessibilidade operacional & Visual',
    title: 'Abertura lateral leve com uma mão e alto contraste tátil-visual',
    description:
      'Em vez de desmontar pilhas pesadas ou levantar tampas acima dos ombros, a porta frontal gira lateralmente com mínimo esforço — acessível para pessoas de diferentes estaturas e forças físicas. Todos os pontos de interação (fechos, puxadores, travas de rodízio e fita de CO₂) usam alto contraste #b9fc12 sobre #1d4c0b para leitura imediata em docas de madrugada com pouca luz.',
    practicalBenefit: 'Qualquer operador identifica onde abrir, travar ou ler o QR Code em segundos, sem treinamento técnico complexo.',
  },
  {
    number: '04',
    audienceNeed: 'Segurança alimentar & Combate ao desperdício',
    title: 'Menos comida no lixo, zero fungicida químico e fim do isopor descartável',
    description:
      'No Brasil, mais de 30% das berries produzidas com trabalho intenso no campo acabam descartadas antes do consumo. Ao dobrar a validade de 5–10 para 10–21 dias apenas com frio passivo seco e CO₂ natural — sem fungicidas pós-colheita — e substituir centenas de caixas de isopor por uma embalagem com vida útil de 5 a 10 anos, o design protege quem planta, quem consome e o meio ambiente.',
    practicalBenefit: 'Preserva alimentos nutritivos até a mesa final e elimina montanhas de resíduo de isopor em aterros.',
  },
];

export type CaixaMManualView = 'open' | 'closed';

export interface CaixaMManualComponent {
  code: string;
  name: string;
  subsystem: string;
  view: CaixaMManualView;
  xPct: number;
  yPct: number;
  materialOrSpec: string;
  functionText: string;
  careTip: string;
}

export interface CaixaMManualGuideStep {
  step: string;
  title: string;
  timing: string;
  instructions: string;
}

export const CAIXA_M_MANUAL_COMPONENTS: CaixaMManualComponent[] = [
  {
    code: '01',
    name: '4 Encaixes de Empilhamento em L',
    subsystem: 'Estrutura & Transporte',
    view: 'closed',
    xPct: 23,
    yPct: 16,
    materialOrSpec: 'PEAD estrutural de alta densidade · 4 cantos completos em 90°',
    functionText:
      'Travam mecanicamente uma Caixa M sobre a outra em pilhas de até 5 unidades (ou 4 por camada no palete PBR), impedindo deslizamento em vans secas e reduzindo a perda térmica em 25–30% quando empilhadas.',
    careTip:
      'Alinhe os 4 cantos inferiores sobre os batentes em L antes de mover a pilha; mantenha os encaixes livres de resíduos de terra ou folhas.',
  },
  {
    code: '02',
    name: 'Tampa Superior Articulada & Vedação EPDM',
    subsystem: 'Acesso Técnico & Estanqueidade',
    view: 'closed',
    xPct: 50.5,
    yPct: 25.5,
    materialOrSpec: 'Parede sanduíche 40 mm PU + gaxeta perimetral EPDM + 2 fechos #b9fc12',
    functionText:
      'Abertura independente dedicada exclusivamente à troca dos cartuchos de gelo e do sachê de CO₂ sem expor as bandejas de berries ao ar quente externo.',
    careTip:
      'Sempre pressione a tampa até o clique firme dos dois fechos superiores para comprimir o perfil EPDM e vedar a atmosfera de CO₂.',
  },
  {
    code: '03',
    name: 'Alça Superior Dobrável Embutida',
    subsystem: 'Ergonomia NR-17',
    view: 'closed',
    xPct: 52,
    yPct: 15,
    materialOrSpec: 'Polímero reforçado retrátil · recolhimento 100% nivelado ao topo',
    functionText:
      'Facilita o manuseio rápido da caixa vazia ou com carga leve (~6,5 kg vazia) e dobra rente ao tampo para nunca interferir no empilhamento de outras caixas acima.',
    careTip:
      'Com a caixa cheia (~20 kg), dê preferência às alças laterais embutidas (componente 10) ou à Base com Rodízios para preservar a lombar.',
  },
  {
    code: '04',
    name: 'Módulo IoT ESP32-C3 + Placa QR Code',
    subsystem: 'Telemetria & Rastreabilidade',
    view: 'closed',
    xPct: 67,
    yPct: 13.5,
    materialOrSpec: 'ESP32-C3 + SHT40 (T/UR) + LIS3DH (impacto) + bateria 18650',
    functionText:
      'Grava temperatura, umidade, vibração e aberturas offline a cada 5–10 min durante toda a rota. Na chegada, basta apontar o celular para o QR Code embutido e gerar o Certificado Digital < 5 °C.',
    careTip:
      'Alojamento selado IP65 contra respingos — higienize o tampo com pano úmido e sanitizante sem direcionar jato de alta pressão sobre a lente do QR.',
  },
  {
    code: '05',
    name: '2 Cartuchos de Gelo PCM (2 × 2 kg)',
    subsystem: 'Motor Térmico Passivo',
    view: 'open',
    xPct: 35,
    yPct: 35,
    materialOrSpec: '2 blocos eutéticos de ~2 kg congelados a −18 °C · ~12–14 h a 30 °C',
    functionText:
      'Posicionados no topo da câmara, resfriam o ar que desce naturalmente por gravidade sobre as frutas. Empilhada ou em loja climatizada, a autonomia sobe para ~16–18 h antes da troca rápida.',
    careTip:
      'Congele os cartuchos por 12–24 h a −18 °C antes do embarque e mantenha um par reserva no freezer da loja para troca em 15 segundos.',
  },
  {
    code: '06',
    name: 'Sachê Protetor de CO₂ + Fita & Válvula',
    subsystem: 'Atmosfera Modificada (Opcional)',
    view: 'open',
    xPct: 56,
    yPct: 33,
    materialOrSpec: 'Sachê ativado por fita #b9fc12 (10–15% CO₂) + válvula de alívio ~20%',
    functionText:
      'Ao puxar a fita verde-lima e fechar a caixa, forma uma atmosfera natural de CO₂ que inibe fungos pós-colheita e dobra a validade das berries de 5–10 para 10–21 dias sem fungicidas.',
    careTip:
      'Puxe a fita somente no momento final de fechar a caixa para viagem ou estocagem longa. A válvula de alívio evita excesso de CO₂ (> 20%).',
  },
  {
    code: '07',
    name: 'Placa Difusora Perfurada (Vão ~15 mm)',
    subsystem: 'Convecção Anti-Congelamento',
    view: 'open',
    xPct: 44,
    yPct: 40,
    materialOrSpec: 'PEAD grau alimentício perfurado · separação térmica de ~15 mm',
    functionText:
      'Separa fisicamente o gelo a −18 °C das cumbucas (ponto de congelamento do morango: −0,8 °C), distribuindo uma cortina homogênea de ar frio entre 0,5 °C e 4,5 °C sem queimar a camada superior.',
    careTip:
      'Nunca remova a placa difusora durante a operação nem obstrua os furos com plástico filme ou papelão.',
  },
  {
    code: '08',
    name: 'Porta Frontal Lateral & Dobradiças Inox',
    subsystem: 'Acesso Empilhado em Balcão',
    view: 'closed',
    xPct: 76,
    yPct: 40,
    materialOrSpec: 'Abertura lateral articulada · 2 dobradiças em aço inox 304 à direita',
    functionText:
      'Permite carregar na fazenda e retirar cumbucas no balcão da confeitaria mesmo com outras Caixas M empilhadas em cima — sem desmontar a pilha nem desperdiçar o ar frio acumulado no topo.',
    careTip:
      'Abra apenas o necessário no ponto de venda e verifique periodicamente se a gaxeta EPDM interna da porta está limpa e íntegra.',
  },
  {
    code: '09',
    name: 'Fechos de Compressão #b9fc12 & Puxador',
    subsystem: 'Acessibilidade & Vedação Frontal',
    view: 'closed',
    xPct: 47,
    yPct: 47,
    materialOrSpec: '2 travas horizontais de alto contraste #b9fc12 + recorte ergonômico',
    functionText:
      'Operáveis com uma só mão mesmo com luvas ou pouca iluminação em docas de madrugada. Comprimem uniformemente a porta lateral contra a vedação perimetral EPDM.',
    careTip:
      'Alavancas independentes das alças de carga: nunca suspenda a caixa pelos fechos verde-lima.',
  },
  {
    code: '10',
    name: 'Alças Laterais NR-17 & Parede 40 mm PU',
    subsystem: 'Isolamento & Pega Segura',
    view: 'closed',
    xPct: 29,
    yPct: 40,
    materialOrSpec: 'Cavidades ergonômicas bilaterais · parede PU + PEAD (k = 0,023 W/m·K)',
    functionText:
      'Alças fundas embutidas no corpo para levantamento seguro a duas mãos (~20 kg cheia). O sanduíche de 40 mm de poliuretano isola ~3× melhor que isopor descartável e suporta empilhamento sem esmagar frutas.',
    careTip:
      'As alças ficam recuadas dentro do perfil de 60 × 50 cm para manter o encaixe exato no palete PBR e na Base com Rodízios.',
  },
  {
    code: '11',
    name: 'Gavetas Perfuradas Deslizantes (8–9 kg)',
    subsystem: 'Acomodação de Berries',
    view: 'open',
    xPct: 53,
    yPct: 55,
    materialOrSpec: 'Prateleiras ventiladas removíveis · 3–4 camadas de cumbucas (49 L)',
    functionText:
      'Suportam ~8–9 kg em cumbucas (ou até ~15 kg granel) sem transferir peso para as camadas inferiores. Deslizam suavemente pela porta lateral para reposição rápida sem manusear fruta por fruta.',
    careTip:
      'Acomode as frutas já pré-resfriadas (0–2 °C) deixando pequenos vãos entre cumbucas para o fluxo descendente de ar frio.',
  },
  {
    code: '12',
    name: 'Calha Drenante, Canais & Manta Absorvente',
    subsystem: 'Controle de Umidade 100% Seco',
    view: 'open',
    xPct: 51,
    yPct: 73,
    materialOrSpec: 'Canais laterais de retorno térmico + calha inferior + manta removível',
    functionText:
      'Enquanto o ar morno sobe de volta ao gelo pelos canais laterais da parede, qualquer gota de condensação escorre pela calha até a manta absorvente no fundo, mantendo as berries 100% secas e livres de mofo.',
    careTip:
      'Substitua ou higienize a manta absorvente a cada novo ciclo de viagem e lave o fundo liso com sanitizante clorado neutro.',
  },
];

export const CAIXA_M_MANUAL_GUIDES: CaixaMManualGuideStep[] = [
  {
    step: '01',
    title: 'Preparo Pré-Viagem',
    timing: '12–24 h antes',
    instructions:
      'Congele os 2 cartuchos PCM (2 kg cada) a −18 °C, higienize o interior com sanitizante alimentar, posicione uma manta absorvente seca no fundo e garanta que as berries estejam pré-resfriadas a 0–2 °C.',
  },
  {
    step: '02',
    title: 'Carregamento & Ativação',
    timing: 'No embarque',
    instructions:
      'Encaixe os cartuchos sobre a placa difusora pela tampa superior, acomode as cumbucas nas gavetas pela porta frontal lateral, puxe a fita #b9fc12 do sachê de CO₂ (se usar) e trave todos os 4 fechos.',
  },
  {
    step: '03',
    title: 'Uso Empilhado no Balcão',
    timing: 'Na confeitaria / loja',
    instructions:
      'Mantenha as caixas travadas pelos 4 cantos em L (ou sobre a Base com Rodízios travada). Retire cumbucas pela porta frontal lateral e, a cada 12–18 h, troque apenas os cartuchos pelo topo.',
  },
  {
    step: '04',
    title: 'Leitura QR & Higienização',
    timing: 'Na entrega / retorno',
    instructions:
      'Aponte a câmera do celular para a placa QR no topo para baixar o Certificado Digital < 5 °C. Ao esvaziar, remova gavetas e manta, lave com detergente neutro + sanitizante e deixe secar aberta.',
  },
];


