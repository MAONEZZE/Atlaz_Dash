// Mirrors Atlaz_Dash_Backend Part 6 (sales finance).
// All numeric default 0; arrays default []; strings default "".

/**
 * @typedef {Object} FinancialSummaryDTO
 * @property {number} bruto
 * @property {number} liquido
 * @property {number} vendido
 * @property {number} vendas
 * @property {number} deltaLiquido
 * @property {number} deltaBruto
 * @property {number} deltaVendas
 * @property {number} margem
 * @property {number} deltaMargem
 * @property {number} taxaPlataforma
 * @property {number} ticketMedio
 * @property {number} emNegociacaoValor
 * @property {number} emNegociacaoQtd
 * @property {number} comissaoSDR
 * @property {number} comissaoCloser
 * @property {number} comissaoTotal
 * @property {number} margemOpValor
 */

/**
 * @typedef {Object} FinancialMonthDTO
 * @property {string} m - Month label, e.g. "Jan"
 * @property {number} bruto
 * @property {number} liquido
 * @property {number} vendido
 * @property {number} previsto
 * @property {boolean} atual
 */

/**
 * @typedef {Object} ProductRevenueDTO
 * @property {string} nome
 * @property {number} bruto
 * @property {number} liquido
 * @property {number} vendas
 * @property {number} pct
 * @property {string} cor
 */

/**
 * @typedef {Object} ProductsTotalDTO
 * @property {number} bruto
 * @property {number} liquido
 * @property {number} vendas
 */

/**
 * @typedef {Object} ChannelRevenueDTO
 * @property {string} id
 * @property {string} nome
 * @property {number} bruto
 * @property {number} liquido
 * @property {number} vendas
 * @property {string} cor
 */

/**
 * @typedef {Object} FinancialBreakdownDTO
 * @property {string} item
 * @property {number} valor
 * @property {"entrada"|"saida"|"resultado"} tipo
 */

/**
 * @typedef {Object} MonthlyFinancialTableRowDTO
 * @property {string} id
 * @property {string} nome
 * @property {"entrada"|"saida"|"subtotal"|"resultado"} tipo
 * @property {number[]} valores
 * @property {number} total
 */

/**
 * @typedef {Object} MonthlyFinancialTableDTO
 * @property {string[]} meses - Array of 12 month labels
 * @property {number} mesAtualIdx
 * @property {MonthlyFinancialTableRowDTO[]} linhas
 */

/**
 * @typedef {Object} SalesFinanceResponseDTO
 * @property {FinancialSummaryDTO} FIN_RESUMO
 * @property {FinancialMonthDTO[]} MESES_FIN
 * @property {ProductRevenueDTO[]} PRODUTOS
 * @property {ProductsTotalDTO} PRODUTOS_TOTAL
 * @property {ChannelRevenueDTO[]} RECEITA_POR_CANAL
 * @property {FinancialBreakdownDTO[]} FIN_BREAKDOWN
 * @property {MonthlyFinancialTableDTO} TABELA_FIN_MENSAL
 */

export const EMPTY_FIN_RESUMO = Object.freeze({ bruto: 0, liquido: 0, vendido: 0, vendas: 0, deltaLiquido: 0, deltaBruto: 0, deltaVendas: 0, margem: 0, deltaMargem: 0, taxaPlataforma: 0, ticketMedio: 0, emNegociacaoValor: 0, emNegociacaoQtd: 0, comissaoSDR: 0, comissaoCloser: 0, comissaoTotal: 0, margemOpValor: 0 })

export const EMPTY_TABELA_FIN_MENSAL = Object.freeze({ meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], mesAtualIdx: 0, linhas: [] })
