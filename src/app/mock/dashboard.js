// Mock para /webhook-test/statistic
export const mockDashboard = {
  META_TOTAL:    1000000,
  META_ATINGIDA:  761000,

  VENDEDORES: [
    { id: 'mateus',  nome: 'Mateus Alvarenga', avatar: 'MA', cor: '#3B82F6' },
    { id: 'helena',  nome: 'Helena Ribeiro',   avatar: 'HR', cor: '#8B5CF6' },
    { id: 'rafael',  nome: 'Rafael Monteiro',  avatar: 'RM', cor: '#10B981' },
    { id: 'bianca',  nome: 'Bianca Tavares',   avatar: 'BT', cor: '#F59E0B' },
    { id: 'thiago',  nome: 'Thiago Ferraz',    avatar: 'TF', cor: '#EF4444' },
    { id: 'larissa', nome: 'Larissa Mendes',   avatar: 'LM', cor: '#EC4899' },
    { id: 'diego',   nome: 'Diego Salgado',    avatar: 'DS', cor: '#06B6D4' },
    { id: 'camila',  nome: 'Camila Nogueira',  avatar: 'CN', cor: '#6366F1' },
  ],

  RANKING_COTA: [
    { id: 'mateus',  fat: 284000, cota: 220000, pct: 129.1 },
    { id: 'helena',  fat: 198000, cota: 180000, pct: 110.0 },
    { id: 'rafael',  fat: 172000, cota: 180000, pct:  95.6 },
    { id: 'bianca',  fat: 141000, cota: 160000, pct:  88.1 },
    { id: 'thiago',  fat: 128000, cota: 160000, pct:  80.0 },
    { id: 'larissa', fat:  96000, cota: 140000, pct:  68.6 },
    { id: 'diego',   fat:  78000, cota: 140000, pct:  55.7 },
    { id: 'camila',  fat:  62000, cota: 140000, pct:  44.3 },
  ],

  CLOSER_OPS: {
    mateus:  { la: 94, lr: 81, ra: 38, rr: 33, ind: 18 },
    helena:  { la: 82, lr: 71, ra: 32, rr: 27, ind: 14 },
    rafael:  { la: 76, lr: 62, ra: 28, rr: 22, ind: 11 },
    bianca:  { la: 71, lr: 58, ra: 26, rr: 20, ind:  9 },
    thiago:  { la: 68, lr: 57, ra: 24, rr: 19, ind: 10 },
    larissa: { la: 62, lr: 48, ra: 22, rr: 16, ind:  8 },
    diego:   { la: 58, lr: 44, ra: 19, rr: 14, ind:  7 },
    camila:  { la: 57, lr: 41, ra: 17, rr: 12, ind:  6 },
  },

  GESTAO_VISUAL: [
    { id: 'thiago',  fat: 118000, leads: 32, p: 12, r: 11, f: 4,  venda: 5, conv: 15.63 },
    { id: 'mateus',  fat:  52000, leads: 53, p: 29, r: 17, f: 5,  venda: 2, conv:  3.77 },
    { id: 'helena',  fat:  48000, leads: 43, p: 26, r: 15, f: 8,  venda: 4, conv:  9.30 },
    { id: 'rafael',  fat:  41000, leads: 31, p: 17, r:  9, f: 4,  venda: 1, conv:  3.23 },
    { id: 'bianca',  fat:  38000, leads: 68, p: 41, r: 18, f: 8,  venda: 1, conv:  1.47 },
    { id: 'larissa', fat:  14000, leads: 31, p: 14, r: 10, f: 5,  venda: 2, conv:  6.45 },
    { id: 'diego',   fat:   8000, leads: 30, p: 13, r:  8, f: 4,  venda: 1, conv:  3.33 },
    { id: 'camila',  fat:   5000, leads: 26, p: 12, r:  8, f: 3,  venda: 3, conv: 11.54 },
  ],

  GESTAO_ESTRATEGICA: [
    { id: 'mateus',  fat: 232000, leads: 41, p: 23, r: 15, f: 7,  venda: 12, conv: 29.27 },
    { id: 'helena',  fat: 150000, leads: 31, p: 20, r:  4, f: 3,  venda:  4, conv: 12.90 },
    { id: 'rafael',  fat: 131000, leads: 59, p: 32, r: 16, f: 9,  venda:  3, conv:  5.08 },
    { id: 'bianca',  fat: 103000, leads: 27, p: 13, r: 10, f: 1,  venda:  3, conv: 11.11 },
    { id: 'thiago',  fat:  82000, leads: 37, p: 25, r:  7, f: 3,  venda:  4, conv: 10.81 },
    { id: 'larissa', fat:  72000, leads: 151, p: 72, r: 60, f: 16, venda: 3, conv:  1.99 },
    { id: 'diego',   fat:  60000, leads: 21, p:  9, r:  7, f: 2,  venda:  5, conv: 23.81 },
    { id: 'camila',  fat:  43000, leads: 26, p: 12, r:  8, f: 2,  venda:  2, conv:  7.69 },
  ],

  SDRS: [
    { id: 'joana',    nome: 'Joana Prado',    avatar: 'JP', cor: '#2551D8' },
    { id: 'rodrigo',  nome: 'Rodrigo Lins',   avatar: 'RL', cor: '#8B5CF6' },
    { id: 'patricia', nome: 'Patrícia Souza', avatar: 'PS', cor: '#10B981' },
    { id: 'lucas',    nome: 'Lucas Barros',   avatar: 'LB', cor: '#F59E0B' },
    { id: 'mariana',  nome: 'Mariana Torres', avatar: 'MT', cor: '#EC4899' },
  ],

  SDR_RANKING: [
    { id: 'joana',    con: 412, ace: 168, inm:  94, fup: 212, numeros: 142, ligacoes: 38, reunioes: 38, indicacoes: 27, score: 94.2 },
    { id: 'patricia', con: 388, ace: 151, inm:  82, fup: 188, numeros: 128, ligacoes: 34, reunioes: 34, indicacoes: 22, score: 88.5 },
    { id: 'rodrigo',  con: 346, ace: 128, inm:  71, fup: 161, numeros: 117, ligacoes: 29, reunioes: 29, indicacoes: 19, score: 76.3 },
    { id: 'lucas',    con: 298, ace: 102, inm:  58, fup: 134, numeros:  98, ligacoes: 22, reunioes: 22, indicacoes: 15, score: 64.8 },
    { id: 'mariana',  con: 261, ace:  88, inm:  46, fup: 112, numeros:  83, ligacoes: 18, reunioes: 18, indicacoes: 12, score: 55.1 },
  ],

  OPS_METRICS: {
    dia: {
      vendas:     { realizado:   3, meta:   5 },
      ligacoes:   { realizado:  28, meta:  40 },
      reunioes:   { realizado:   6, meta:   8 },
      indicacoes: { realizado:   4, meta:   6 },
      numeros:    { realizado:  38, meta:  60 },
    },
    semana: {
      vendas:     { realizado:  14, meta:  22 },
      ligacoes:   { realizado: 142, meta: 180 },
      reunioes:   { realizado:  28, meta:  35 },
      indicacoes: { realizado:  18, meta:  25 },
      numeros:    { realizado: 186, meta: 240 },
    },
    mes: {
      vendas:     { realizado:  63, meta:  80 },
      ligacoes:   { realizado: 568, meta: 720 },
      reunioes:   { realizado: 141, meta: 160 },
      indicacoes: { realizado:  95, meta: 120 },
      numeros:    { realizado: 814, meta: 1000 },
    },
  },
}
