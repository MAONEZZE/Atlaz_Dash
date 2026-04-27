// Mock para /webhook-test/sales
const FAT_BRUTO  = [741000, 812000, 874000, 981000, 412000, 487000, 521000, 498000, 612000, 684000, 731000, 892000]
const TAXA_PLAT  = FAT_BRUTO.map(v => +(v * 0.032).toFixed(2))
const IMPOSTO    = FAT_BRUTO.map(v => +(v * 0.085).toFixed(2))
const LIQ_VEND   = FAT_BRUTO.map((v, i) => +(v - TAXA_PLAT[i] - IMPOSTO[i]).toFixed(2))
const COMISSOES  = FAT_BRUTO.map(v => +(v * 0.107).toFixed(2))
const MARGEM_OP  = LIQ_VEND.map((v, i) => +(v - COMISSOES[i]).toFixed(2))
const REC_BRUTO  = [62132.55, 32132.88, 32132.88, 32132.88, 36859.11, 84067.99, 106453.39, 90191.43, 53798.81, 37132.55, 67132.22, 62132.55]
const sum        = arr => arr.reduce((a, b) => a + b, 0)

export const mockVendas = {
  FIN_RESUMO: {
    bruto:               981000,
    liquido:             761000,
    vendido:             948000,
    vendas:                  44,
    deltaLiquido:          20.2,
    deltaBruto:            12.2,
    deltaVendas:           15.8,
    margem:                77.6,
    deltaMargem:            3.1,
    taxaPlataforma:       31392,
    ticketMedio:          22295,
    emNegociacaoValor:   485000,
    emNegociacaoQtd:         18,
    comissaoSDR:          23973,
    comissaoCloser:       81250,
    comissaoTotal:       105223,
    margemOpValor:       655777,
  },

  MESES_FIN: [
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
  ],

  PRODUTOS: [
    { nome: 'KeepSide',              bruto: 360000, liquido:  38906.06, vendas: 3, pct: 79.89, cor: '#2551D8' },
    { nome: 'Produto de Aceleração', bruto:  60000, liquido:   4529.61, vendas: 1, pct: 13.32, cor: '#3B6EF0' },
    { nome: 'Produto de Ativação',   bruto:  20000, liquido:   4529.61, vendas: 1, pct:  4.44, cor: '#5A8AFB' },
    { nome: 'Produto de Entrada',    bruto:  10600, liquido:   8080.10, vendas: 2, pct:  2.35, cor: '#8AAEFF' },
    { nome: 'Boltique',              bruto:      0, liquido:      0.00, vendas: 0, pct:  0.00, cor: '#B8CEFF' },
  ],

  PRODUTOS_TOTAL: { bruto: 450600, liquido: 56045.38, parcelasAnt: 21567.42, totalLiquido: 77612.80, vendas: 7 },

  RECEITA_POR_CANAL: [
    { id: 'linkedin',  nome: 'LinkedIn',  bruto: 412000, liquido: 319800, vendas: 14, cor: '#2551D8' },
    { id: 'indicacao', nome: 'Indicação', bruto: 287000, liquido: 228700, vendas: 18, cor: '#10B981' },
    { id: 'instagram', nome: 'Instagram', bruto: 189000, liquido: 146200, vendas:  8, cor: '#EC4899' },
    { id: 'outros',    nome: 'Outros',    bruto:  93000, liquido:  66300, vendas:  4, cor: '#8B5CF6' },
  ],

  FIN_BREAKDOWN: [
    { item: 'Faturamento bruto',         valor:  981000, tipo: 'entrada'   },
    { item: 'Taxas de pagamento (3,2%)', valor:  -31392, tipo: 'saida'     },
    { item: 'Impostos (8,5%)',           valor:  -83385, tipo: 'saida'     },
    { item: 'Comissão vendedores',       valor:  -81250, tipo: 'saida'     },
    { item: 'Comissão SDR',              valor:  -23973, tipo: 'saida'     },
    { item: 'Receita líquida',           valor:  761000, tipo: 'resultado' },
  ],

  TABELA_FIN_MENSAL: {
    meses: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    mesAtualIdx: 3,
    linhas: [
      { id: 'recBruto',   nome: 'Recebimento Bruto',         tipo: 'entrada',   valores: REC_BRUTO,  total: sum(REC_BRUTO)  },
      { id: 'fatBruto',   nome: 'Faturamento Bruto Vendido', tipo: 'entrada',   valores: FAT_BRUTO,  total: sum(FAT_BRUTO)  },
      { id: 'taxaPlat',   nome: 'Taxa de Plataforma',        tipo: 'saida',     valores: TAXA_PLAT,  total: sum(TAXA_PLAT)  },
      { id: 'imposto',    nome: 'Imposto',                   tipo: 'saida',     valores: IMPOSTO,    total: sum(IMPOSTO)    },
      { id: 'liqVendido', nome: 'Líquido Vendido',           tipo: 'subtotal',  valores: LIQ_VEND,   total: sum(LIQ_VEND)   },
      { id: 'comissoes',  nome: 'Comissões',                 tipo: 'saida',     valores: COMISSOES,  total: sum(COMISSOES)  },
      { id: 'margemOp',   nome: 'Margem Operacional',        tipo: 'resultado', valores: MARGEM_OP,  total: sum(MARGEM_OP)  },
    ],
  },
}
