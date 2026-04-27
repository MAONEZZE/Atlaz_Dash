// Dados fictícios para o dashboard Dashcomp
// Equipe comercial de 8 vendedores

const VENDEDORES = [
  { id: 'mateus',  nome: 'Mateus Alvarenga', avatar: 'MA', cor: '#3B82F6' },
  { id: 'helena',  nome: 'Helena Ribeiro',   avatar: 'HR', cor: '#8B5CF6' },
  { id: 'rafael',  nome: 'Rafael Monteiro',  avatar: 'RM', cor: '#10B981' },
  { id: 'bianca',  nome: 'Bianca Tavares',   avatar: 'BT', cor: '#F59E0B' },
  { id: 'thiago',  nome: 'Thiago Ferraz',    avatar: 'TF', cor: '#EF4444' },
  { id: 'larissa', nome: 'Larissa Mendes',   avatar: 'LM', cor: '#EC4899' },
  { id: 'diego',   nome: 'Diego Salgado',    avatar: 'DS', cor: '#06B6D4' },
  { id: 'camila',  nome: 'Camila Nogueira',  avatar: 'CN', cor: '#6366F1' },
];

// Ranking por cota (% atingido)
const RANKING_COTA = [
  { id: 'mateus',  fat: 284000, cota: 220000, pct: 129.1 },
  { id: 'helena',  fat: 198000, cota: 180000, pct: 110.0 },
  { id: 'rafael',  fat: 172000, cota: 180000, pct:  95.6 },
  { id: 'bianca',  fat: 141000, cota: 160000, pct:  88.1 },
  { id: 'thiago',  fat: 128000, cota: 160000, pct:  80.0 },
  { id: 'larissa', fat:  96000, cota: 140000, pct:  68.6 },
  { id: 'diego',   fat:  78000, cota: 140000, pct:  55.7 },
  { id: 'camila',  fat:  62000, cota: 140000, pct:  44.3 },
];

// Performance operacional por closer (mês)
// la = ligações agendadas recebidas; lr = realizadas; ra = reuniões agendadas; rr = realizadas; ind = indicações
const CLOSER_OPS = {
  mateus:  { la: 94, lr: 81, ra: 38, rr: 33, ind: 18 },
  helena:  { la: 82, lr: 71, ra: 32, rr: 27, ind: 14 },
  rafael:  { la: 76, lr: 62, ra: 28, rr: 22, ind: 11 },
  bianca:  { la: 71, lr: 58, ra: 26, rr: 20, ind:  9 },
  thiago:  { la: 68, lr: 57, ra: 24, rr: 19, ind: 10 },
  larissa: { la: 62, lr: 48, ra: 22, rr: 16, ind:  8 },
  diego:   { la: 58, lr: 44, ra: 19, rr: 14, ind:  7 },
  camila:  { la: 57, lr: 41, ra: 17, rr: 12, ind:  6 },
};

// Gestão Visual (produto)
const GESTAO_VISUAL = [
  { id: 'thiago',  fat: 118000, leads: 32, p: 12, r: 11, f: 4,  venda: 5, conv: 15.63 },
  { id: 'mateus',  fat:  52000, leads: 53, p: 29, r: 17, f: 5,  venda: 2, conv:  3.77 },
  { id: 'helena',  fat:  48000, leads: 43, p: 26, r: 15, f: 8,  venda: 4, conv:  9.30 },
  { id: 'rafael',  fat:  41000, leads: 31, p: 17, r:  9, f: 4,  venda: 1, conv:  3.23 },
  { id: 'bianca',  fat:  38000, leads: 68, p: 41, r: 18, f: 8,  venda: 1, conv:  1.47 },
  { id: 'larissa', fat:  14000, leads: 31, p: 14, r: 10, f: 5,  venda: 2, conv:  6.45 },
  { id: 'diego',   fat:   8000, leads: 30, p: 13, r:  8, f: 4,  venda: 1, conv:  3.33 },
  { id: 'camila',  fat:   5000, leads: 26, p: 12, r:  8, f: 3,  venda: 3, conv: 11.54 },
];

// Gestão Estratégica (produto)
const GESTAO_ESTRATEGICA = [
  { id: 'mateus',  fat: 232000, leads: 41, p: 23, r: 15, f: 7,  venda: 12, conv: 29.27 },
  { id: 'helena',  fat: 150000, leads: 31, p: 20, r:  4, f: 3,  venda:  4, conv: 12.90 },
  { id: 'rafael',  fat: 131000, leads: 59, p: 32, r: 16, f: 9,  venda:  3, conv:  5.08 },
  { id: 'bianca',  fat: 103000, leads: 27, p: 13, r: 10, f: 1,  venda:  3, conv: 11.11 },
  { id: 'thiago',  fat:  82000, leads: 37, p: 25, r:  7, f: 3,  venda:  4, conv: 10.81 },
  { id: 'larissa', fat:  72000, leads: 151, p: 72, r: 60, f: 16, venda: 3, conv:  1.99 },
  { id: 'diego',   fat:  60000, leads: 21, p:  9, r:  7, f: 2,  venda:  5, conv: 23.81 },
  { id: 'camila',  fat:  43000, leads: 26, p: 12, r:  8, f: 2,  venda:  2, conv:  7.69 },
];

// Projeção de meta — mês corrente (22 dias úteis)
const PROJECAO = Array.from({ length: 22 }, (_, i) => {
  const dia = i + 1;
  // meta linear
  const meta = Math.round((1000000 / 22) * dia);
  // faturamento com crescimento e ruído
  const base = 1000000 * (1 - Math.exp(-dia / 12)) * 0.95;
  const noise = Math.sin(dia * 1.3) * 8000 + Math.cos(dia * 0.7) * 5000;
  const fat = Math.max(0, Math.round(base + noise));
  return { dia, meta, fat };
});

// Vendas por dia — últimas ~30 entradas (dia / valor em mil)
const VENDAS_POR_DIA = [
  { data: '02/04', valor:  37.0 },
  { data: '04/04', valor: 102.0 },
  { data: '04/04', valor: 133.0 },
  { data: '06/04', valor:  64.0 },
  { data: '07/04', valor: 112.0 },
  { data: '08/04', valor:  49.0 },
  { data: '10/04', valor: 189.0 },
  { data: '12/04', valor:  20.0 },
  { data: '15/04', valor:  78.0 },
  { data: '16/04', valor: 142.0 },
  { data: '17/04', valor:  31.0 },
  { data: '18/04', valor:  95.0 },
  { data: '19/04', valor: 167.0 },
  { data: '20/04', valor:  54.0 },
  { data: '22/04', valor: 121.0 },
  { data: '23/04', valor:  88.0 },
  { data: '24/04', valor: 205.0 },
  { data: '25/04', valor:  42.0 },
  { data: '28/04', valor: 113.0 },
  { data: '29/04', valor:  71.0 },
  { data: '30/04', valor: 156.0 },
];

// Receita por produto — Fat. Bruto, Líquido, Nº Vendas
const PRODUTOS = [
  { nome: 'KeepSide',             bruto: 360000, liquido: 38906.06, vendas: 3, pct: 79.89, cor: '#2551D8' },
  { nome: 'Produto de Aceleração', bruto:  60000, liquido:  4529.61, vendas: 1, pct: 13.32, cor: '#3B6EF0' },
  { nome: 'Produto de Ativação',   bruto:  20000, liquido:  4529.61, vendas: 1, pct:  4.44, cor: '#5A8AFB' },
  { nome: 'Produto de Entrada',    bruto:  10600, liquido:  8080.10, vendas: 2, pct:  2.35, cor: '#8AAEFF' },
  { nome: 'Boltique',              bruto:      0, liquido:      0.00, vendas: 0, pct:  0.00, cor: '#B8CEFF' },
];
const PRODUTOS_TOTAL = { bruto: 450600, liquido: 56045.38, parcelasAnt: 21567.42, totalLiquido: 77612.80, vendas: 7 };

// ── Pré-vendas (SDRs) ───────────────────────────
const SDRS = [
  { id: 'joana',   nome: 'Joana Prado',    avatar: 'JP', cor: '#2551D8' },
  { id: 'rodrigo', nome: 'Rodrigo Lins',   avatar: 'RL', cor: '#8B5CF6' },
  { id: 'patricia',nome: 'Patrícia Souza', avatar: 'PS', cor: '#10B981' },
  { id: 'lucas',   nome: 'Lucas Barros',   avatar: 'LB', cor: '#F59E0B' },
  { id: 'mariana', nome: 'Mariana Torres', avatar: 'MT', cor: '#EC4899' },
];

// Ranking SDR — performance de prospecção no LinkedIn
// con = conexões enviadas; ace = aceitas; inm = InMails; fup = follow-ups;
// numeros = números pegos; ligacoes = ligações AGENDADAS (entrega final)
// reunioes = reuniões agendadas (métrica derivada); indicacoes = indicações captadas
const SDR_RANKING = [
  { id: 'joana',    con: 412, ace: 168, inm:  94, fup: 212, numeros: 142, ligacoes: 38, reunioes: 38, indicacoes: 27, score: 94.2 },
  { id: 'patricia', con: 388, ace: 151, inm:  82, fup: 188, numeros: 128, ligacoes: 34, reunioes: 34, indicacoes: 22, score: 88.5 },
  { id: 'rodrigo',  con: 346, ace: 128, inm:  71, fup: 161, numeros: 117, ligacoes: 29, reunioes: 29, indicacoes: 19, score: 76.3 },
  { id: 'lucas',    con: 298, ace: 102, inm:  58, fup: 134, numeros:  98, ligacoes: 22, reunioes: 22, indicacoes: 15, score: 64.8 },
  { id: 'mariana',  con: 261, ace:  88, inm:  46, fup: 112, numeros:  83, ligacoes: 18, reunioes: 18, indicacoes: 12, score: 55.1 },
];

// KPIs operacionais — progresso por período
// Cada métrica retorna { realizado, meta } por período
const OPS_METRICS = {
  dia: {
    vendas:      { realizado:   3, meta:   5 },
    ligacoes:    { realizado:  28, meta:  40 },
    reunioes:    { realizado:   6, meta:   8 },
    indicacoes:  { realizado:   4, meta:   6 },
    numeros:     { realizado:  38, meta:  60 },
  },
  semana: {
    vendas:      { realizado:  14, meta:  22 },
    ligacoes:    { realizado: 142, meta: 180 },
    reunioes:    { realizado:  28, meta:  35 },
    indicacoes:  { realizado:  18, meta:  25 },
    numeros:     { realizado: 186, meta: 240 },
  },
  mes: {
    vendas:      { realizado:  63, meta:  80 },
    ligacoes:    { realizado: 568, meta: 720 },
    reunioes:    { realizado: 141, meta: 160 },
    indicacoes:  { realizado:  95, meta: 120 },
    numeros:     { realizado: 814, meta:1000 },
  },
};

const META_TOTAL = 1000000;
const META_ATINGIDA = 761000;

// ── Funis / Canais ────────────────────────────────
// Cada funil com entrada, avanço por etapa, resultado e conversão
const FUNIS = [
  {
    id: 'linkedin',
    nome: 'LinkedIn',
    cor: '#2551D8',
    icone: 'linkedin',
    etapas: { conexoes: 1705, aceitas: 637, inmails: 351, followups: 807, numeros: 568, ligacoes: 141, reunioes: 78, indicacoes: 95 },
    resultado: { oportunidades: 78, vendas: 14, receita: 412000 },
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    cor: '#EC4899',
    icone: 'instagram',
    etapas: { conexoes: 892, aceitas: 318, inmails: 0, followups: 412, numeros: 286, ligacoes: 72, reunioes: 41, indicacoes: 38 },
    resultado: { oportunidades: 41, vendas: 8, receita: 189000 },
  },
  {
    id: 'indicacao',
    nome: 'Indicação',
    cor: '#10B981',
    icone: 'share',
    etapas: { conexoes: 0, aceitas: 0, inmails: 0, followups: 142, numeros: 95, ligacoes: 58, reunioes: 42, indicacoes: 95 },
    resultado: { oportunidades: 42, vendas: 18, receita: 287000 },
  },
  {
    id: 'trafego',
    nome: 'Tráfego pago',
    cor: '#F59E0B',
    icone: 'globe',
    etapas: { conexoes: 0, aceitas: 0, inmails: 0, followups: 298, numeros: 187, ligacoes: 94, reunioes: 51, indicacoes: 12 },
    resultado: { oportunidades: 51, vendas: 11, receita: 198000 },
  },
  {
    id: 'whatsapp',
    nome: 'WhatsApp',
    cor: '#8B5CF6',
    icone: 'chat',
    etapas: { conexoes: 0, aceitas: 0, inmails: 0, followups: 176, numeros: 118, ligacoes: 48, reunioes: 28, indicacoes: 22 },
    resultado: { oportunidades: 28, vendas: 6, receita: 112000 },
  },
];

// série temporal últimos 14 dias — volume de leads captados por canal (para mini charts)
const FUNIL_SERIE = (() => {
  const out = {};
  FUNIS.forEach(f => {
    const base = f.etapas.numeros / 14;
    out[f.id] = Array.from({ length: 14 }, (_, i) => {
      const noise = Math.sin(i * 0.8 + f.id.charCodeAt(0)) * 0.4 + Math.cos(i * 1.3) * 0.3;
      return Math.max(1, Math.round(base * (1 + noise)));
    });
  });
  return out;
})();

// Funil do LinkedIn — 8 etapas + métricas auxiliares
const LINKEDIN_FUNIL = {
  etapas: [
    { id: 'enviadas',   nome: 'Conexões enviadas',  v: 2840 },
    { id: 'aceitas',    nome: 'Conexões aceitas',   v: 1278 },
    { id: 'abordagens', nome: 'Abordagens feitas',  v: 1158 },
    { id: 'numeros',    nome: 'Números captados',   v:  487 },
    { id: 'ligAgend',   nome: 'Ligações agendadas', v:  312 },
    { id: 'ligReal',    nome: 'Ligações realizadas',v:  241 },
    { id: 'reuAgend',   nome: 'Reuniões agendadas', v:  164 },
    { id: 'reuReal',    nome: 'Reuniões realizadas',v:  118 },
  ],
  aux: {
    followups:   892,
    leadsFup:    342,
    mediaFup:    2.6,   // follow-ups médios por lead
  },
};

// ── Funis por canal — estrutura dinâmica ──────────
// Cada canal define suas próprias etapas + métricas auxiliares + KPIs
// Estrutura extensível: basta adicionar um novo canal aqui
const FUNIS_POR_CANAL = {
  linkedin: {
    id: 'linkedin',
    nome: 'LinkedIn',
    cor: '#2551D8',
    corAcc: '#3B6EF0',
    sub: 'Prospecção outbound estruturada via conexão direta',
    etapas: [
      { id: 'enviadas',   nome: 'Conexões enviadas',   v: 2840 },
      { id: 'aceitas',    nome: 'Conexões aceitas',    v: 1278 },
      { id: 'abordagens', nome: 'Abordagens feitas',   v: 1158 },
      { id: 'numeros',    nome: 'Números captados',    v:  487 },
      { id: 'ligAgend',   nome: 'Ligações agendadas',  v:  312 },
      { id: 'ligReal',    nome: 'Ligações realizadas', v:  241 },
      { id: 'reuAgend',   nome: 'Reuniões agendadas',  v:  164 },
      { id: 'reuReal',    nome: 'Reuniões realizadas', v:  118 },
      { id: 'fechamentos',nome: 'Fechamentos',         v:   28 },
    ],
    kpis: [
      { id: 'enviadas',    l: 'Conexões enviadas',  meta: 3200 },
      { id: 'aceitas',     l: 'Conexões aceitas',   meta: 1400 },
      { id: 'abordagens',  l: 'Abordagens feitas',  meta: 1200 },
      { id: 'followups',   l: 'Follow-ups feitos',  meta: 1000, auxRef: 'followups' },
      { id: 'numeros',     l: 'Números captados',   meta:  520 },
      { id: 'ligAgend',    l: 'Ligações agendadas', meta:  340 },
      { id: 'reuAgend',    l: 'Reuniões agendadas', meta:  190 },
      { id: 'fechamentos', l: 'Fechamentos',        meta:   35 },
    ],
    aux: {
      titulo: 'Follow-up & engajamento',
      blocos: [
        { l: 'Follow-ups feitos',  v: 892, fmt: 'num' },
        { l: 'Leads em follow-up', v: 342, fmt: 'num' },
        { l: 'Média por lead',     v: 2.6, fmt: 'dec' },
      ],
    },
  },
  instagram: {
    id: 'instagram',
    nome: 'Instagram',
    cor: '#EC4899',
    corAcc: '#F472B6',
    sub: 'Abordagem via DM + conteúdo orgânico',
    etapas: [
      { id: 'mensagens',  nome: 'Mensagens enviadas',  v: 1820 },
      { id: 'respostas',  nome: 'Respostas recebidas', v:  642 },
      { id: 'numeros',    nome: 'Números captados',    v:  286 },
      { id: 'ligAgend',   nome: 'Ligações agendadas',  v:  172 },
      { id: 'ligReal',    nome: 'Ligações realizadas', v:  128 },
      { id: 'reuAgend',   nome: 'Reuniões agendadas',  v:   89 },
      { id: 'reuReal',    nome: 'Reuniões realizadas', v:   64 },
      { id: 'fechamentos',nome: 'Fechamentos',         v:   14 },
    ],
    kpis: [
      { id: 'mensagens',   l: 'Mensagens enviadas',  meta: 2000 },
      { id: 'respostas',   l: 'Respostas recebidas', meta:  720 },
      { id: 'numeros',     l: 'Números captados',    meta:  320 },
      { id: 'ligAgend',    l: 'Ligações agendadas',  meta:  200 },
      { id: 'reuAgend',    l: 'Reuniões agendadas',  meta:  100 },
      { id: 'fechamentos', l: 'Fechamentos',         meta:   18 },
    ],
    aux: {
      titulo: 'Engajamento & resposta',
      blocos: [
        { l: 'Taxa de resposta', v: 35.3, fmt: 'pct' },
        { l: 'Tempo médio resp.', v: 4.2, fmt: 'h' },
        { l: 'Avanço p/ número',  v: 44.5, fmt: 'pct' },
      ],
    },
  },
  indicacao: {
    id: 'indicacao',
    nome: 'Indicação',
    cor: '#10B981',
    corAcc: '#34D399',
    sub: 'Canal de maior confiança e velocidade de fechamento',
    etapas: [
      { id: 'recebidas',  nome: 'Indicações recebidas', v: 284 },
      { id: 'contatos',   nome: 'Contatos feitos',      v: 248 },
      { id: 'respostas',  nome: 'Respostas recebidas',  v: 186 },
      { id: 'ligAgend',   nome: 'Ligações agendadas',   v: 142 },
      { id: 'ligReal',    nome: 'Ligações realizadas',  v: 118 },
      { id: 'reuAgend',   nome: 'Reuniões agendadas',   v:  92 },
      { id: 'reuReal',    nome: 'Reuniões realizadas',  v:  78 },
      { id: 'fechamentos',nome: 'Fechamentos',          v:  31 },
    ],
    kpis: [
      { id: 'recebidas',   l: 'Indicações recebidas', meta: 320 },
      { id: 'contatos',    l: 'Contatos feitos',      meta: 280 },
      { id: 'respostas',   l: 'Respostas recebidas',  meta: 220 },
      { id: 'ligAgend',    l: 'Ligações agendadas',   meta: 180 },
      { id: 'reuAgend',    l: 'Reuniões agendadas',   meta: 120 },
      { id: 'fechamentos', l: 'Fechamentos',          meta:  40 },
    ],
    aux: {
      titulo: 'Velocidade & qualidade',
      blocos: [
        { l: 'Tempo médio ciclo', v: 11, fmt: 'dias' },
        { l: 'Taxa de resposta',  v: 75.0, fmt: 'pct' },
        { l: 'Conv. fechamento',  v: 10.9, fmt: 'pct' },
      ],
    },
  },
  whatsapp: {
    id: 'whatsapp',
    nome: 'WhatsApp',
    cor: '#8B5CF6',
    corAcc: '#A78BFA',
    sub: 'Canal direto de qualificação e agendamento',
    etapas: [
      { id: 'mensagens',  nome: 'Mensagens enviadas',  v:  960 },
      { id: 'respostas',  nome: 'Respostas recebidas', v:  412 },
      { id: 'qualificados', nome: 'Leads qualificados', v: 238 },
      { id: 'ligAgend',   nome: 'Ligações agendadas',  v:  148 },
      { id: 'ligReal',    nome: 'Ligações realizadas', v:  112 },
      { id: 'reuAgend',   nome: 'Reuniões agendadas',  v:   72 },
      { id: 'reuReal',    nome: 'Reuniões realizadas', v:   54 },
      { id: 'fechamentos',nome: 'Fechamentos',         v:   12 },
    ],
    kpis: [
      { id: 'mensagens',   l: 'Mensagens enviadas',  meta: 1100 },
      { id: 'respostas',   l: 'Respostas recebidas', meta:  480 },
      { id: 'qualificados',l: 'Leads qualificados',  meta:  280 },
      { id: 'ligAgend',    l: 'Ligações agendadas',  meta:  180 },
      { id: 'reuAgend',    l: 'Reuniões agendadas',  meta:   90 },
      { id: 'fechamentos', l: 'Fechamentos',         meta:   18 },
    ],
    aux: {
      titulo: 'Resposta & avanço',
      blocos: [
        { l: 'Taxa de resposta', v: 42.9, fmt: 'pct' },
        { l: 'Avanço p/ lig.',   v: 62.2, fmt: 'pct' },
        { l: 'Conv. fechamento', v:  1.3, fmt: 'pct' },
      ],
    },
  },
};

// ── Financeiro / Vendas ──────────────────────────
// Evolução mensal (jan→dez 2025–2026); abril é o mês atual
const MESES_FIN = [
  { m: 'Mai', bruto: 412000, liquido:  298000, vendido: 398000, previsto: 310000 },
  { m: 'Jun', bruto: 487000, liquido:  352000, vendido: 468000, previsto: 340000 },
  { m: 'Jul', bruto: 521000, liquido:  378000, vendido: 498000, previsto: 360000 },
  { m: 'Ago', bruto: 498000, liquido:  361000, vendido: 482000, previsto: 370000 },
  { m: 'Set', bruto: 612000, liquido:  443000, vendido: 592000, previsto: 420000 },
  { m: 'Out', bruto: 684000, liquido:  495000, vendido: 658000, previsto: 470000 },
  { m: 'Nov', bruto: 731000, liquido:  529000, vendido: 704000, previsto: 510000 },
  { m: 'Dez', bruto: 892000, liquido:  647000, vendido: 861000, previsto: 580000 },
  { m: 'Jan', bruto: 741000, liquido:  537000, vendido: 712000, previsto: 540000 },
  { m: 'Fev', bruto: 812000, liquido:  588000, vendido: 784000, previsto: 590000 },
  { m: 'Mar', bruto: 874000, liquido:  633000, vendido: 841000, previsto: 620000 },
  { m: 'Abr', bruto: 981000, liquido:  761000, vendido: 948000, previsto: 680000, atual: true },
];

// Receita por canal — bruto / líquido / nº vendas
const RECEITA_POR_CANAL = [
  { id: 'linkedin',  nome: 'LinkedIn',     bruto: 412000, liquido: 319800, vendas: 14, cor: '#2551D8' },
  { id: 'indicacao', nome: 'Indicação',    bruto: 287000, liquido: 228700, vendas: 18, cor: '#10B981' },
  { id: 'instagram', nome: 'Instagram',    bruto: 189000, liquido: 146200, vendas:  8, cor: '#EC4899' },
  { id: 'outros',    nome: 'Outros',       bruto:  93000, liquido:  66300, vendas:  4, cor: '#8B5CF6' },
];

// Resumo financeiro (mês atual)
const FIN_RESUMO = {
  bruto:        981000,
  liquido:      761000,
  vendido:      948000,
  vendas:            44,
  deltaLiquido:   20.2,  // vs mês anterior
  deltaBruto:     12.2,
  deltaVendas:    15.8,
  margem:         77.6,  // líquido / bruto
  deltaMargem:     3.1,
  // detalhe
  taxaPlataforma:  31392,
  ticketMedio:     22295,  // bruto / vendas
  emNegociacaoValor: 485000,
  emNegociacaoQtd:      18,
  comissaoSDR:      23973,
  comissaoCloser:   81250,
  comissaoTotal:   105223,
  margemOpValor:   655777, // líquido − comissões (aprox Abr)
};

// Breakdown financeiro — de onde veio e para onde foi
const FIN_BREAKDOWN = [
  { item: 'Faturamento bruto',         valor:  981000, tipo: 'entrada' },
  { item: 'Taxas de pagamento (3,2%)', valor:  -31392, tipo: 'saida' },
  { item: 'Impostos (8,5%)',           valor:  -83385, tipo: 'saida' },
  { item: 'Comissão vendedores',       valor:  -81250, tipo: 'saida' },
  { item: 'Comissão SDR',              valor:  -23973, tipo: 'saida' },
  { item: 'Receita líquida',           valor:  761000, tipo: 'resultado' },
];

// ── Tabela mensal detalhada (Resumo Financeiro) ──
// Colunas: categorias × 12 meses (Mai/2025 → Abr/2026) + TOTAL
// Estrutura segue a planilha: Recebimento Bruto, Faturamento Bruto Vendido,
// Taxa de Plataforma, Imposto, Líquido Vendido, Comissões, Margem Operacional
const MESES_TABELA = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// Recebimentos (caixa previsto — parcelas de vendas anteriores que caem no mês)
// Ordem: Jan, Fev, Mar, Abr | Mai, Jun, Jul, Ago, Set, Out, Nov, Dez
const REC_BRUTO = [
  62132.55, 32132.88, 32132.88, 32132.88,
  36859.11, 84067.99, 106453.39, 90191.43, 53798.81, 37132.55, 67132.22, 62132.55,
];
// Faturamento bruto vendido no mês
const FAT_BRUTO = [741000, 812000, 874000, 981000, 412000, 487000, 521000, 498000, 612000, 684000, 731000, 892000];
// Taxa de plataforma (~3,2% do faturamento)
const TAXA_PLAT = FAT_BRUTO.map(v => +(v * 0.032).toFixed(2));
// Imposto (~8,5%)
const IMPOSTO = FAT_BRUTO.map(v => +(v * 0.085).toFixed(2));
// Líquido vendido = bruto − taxas − impostos (valor contábil)
const LIQ_VENDIDO = FAT_BRUTO.map((v, i) => +(v - TAXA_PLAT[i] - IMPOSTO[i]).toFixed(2));
// Comissões (vendedores ~8,3% + SDR ~2,4% = ~10,7% do bruto)
const COMISSOES = FAT_BRUTO.map(v => +(v * 0.107).toFixed(2));
// Margem operacional = líquido − comissões
const MARGEM_OP = LIQ_VENDIDO.map((v, i) => +(v - COMISSOES[i]).toFixed(2));

const sum = arr => arr.reduce((a, b) => a + b, 0);

const TABELA_FIN_MENSAL = {
  meses: MESES_TABELA,
  mesAtualIdx: 3, // Abr = índice 3 (Jan=0, Fev=1, Mar=2, Abr=3)
  linhas: [
    { id: 'recBruto',   nome: 'Recebimento Bruto',         tipo: 'entrada',    valores: REC_BRUTO,   total: sum(REC_BRUTO) },
    { id: 'fatBruto',   nome: 'Faturamento Bruto Vendido', tipo: 'entrada',    valores: FAT_BRUTO,   total: sum(FAT_BRUTO) },
    { id: 'taxaPlat',   nome: 'Taxa de Plataforma',        tipo: 'saida',      valores: TAXA_PLAT,   total: sum(TAXA_PLAT) },
    { id: 'imposto',    nome: 'Imposto',                   tipo: 'saida',      valores: IMPOSTO,     total: sum(IMPOSTO) },
    { id: 'liqVendido', nome: 'Líquido Vendido',           tipo: 'subtotal',   valores: LIQ_VENDIDO, total: sum(LIQ_VENDIDO) },
    { id: 'comissoes',  nome: 'Comissões',                 tipo: 'saida',      valores: COMISSOES,   total: sum(COMISSOES) },
    { id: 'margemOp',   nome: 'Margem Operacional',        tipo: 'resultado',  valores: MARGEM_OP,   total: sum(MARGEM_OP) },
  ],
};

Object.assign(window, {
  VENDEDORES, RANKING_COTA, CLOSER_OPS, GESTAO_VISUAL, GESTAO_ESTRATEGICA,
  PROJECAO, VENDAS_POR_DIA, PRODUTOS, PRODUTOS_TOTAL,
  SDRS, SDR_RANKING, OPS_METRICS,
  FUNIS, FUNIL_SERIE, LINKEDIN_FUNIL, FUNIS_POR_CANAL,
  META_TOTAL, META_ATINGIDA,
  MESES_FIN, RECEITA_POR_CANAL, FIN_RESUMO, FIN_BREAKDOWN, TABELA_FIN_MENSAL,
});
