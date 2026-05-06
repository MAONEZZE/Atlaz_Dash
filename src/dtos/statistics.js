// Mirrors Atlaz_Dash_Backend Part 1 (statistics).
// Numeric fields default to 0; arrays default to []; never null/NaN/undefined.
// Field keys with `\n` are LITERAL — preserved end-to-end on the wire.

/**
 * @typedef {Object} FrontendCloserStatisticDTO
 * @property {string} Nome
 * @property {number} ["Ligações\nRealizadas"]
 * @property {number} ["Reuniões\nAgendadas"]
 * @property {number} ["Reuniões\nRealizadas"]
 * @property {number} ["Indicações"]
 */

/**
 * @typedef {Object} FrontendSdrStatisticDTO
 * @property {string} Nome
 * @property {number} ["Conexões\nEnviadas"]
 * @property {number} ["Conexões\nAceitas"]
 * @property {number} ["InMails\nEnviados"]
 * @property {number} ["Follow-ups"]
 * @property {number} ["Números\nCaptados"]
 * @property {number} ["Ligações\nAgendadas"]
 * @property {number} ["Reuniões\nAgendadas"]
 * @property {number} ["Indicações\nCaptadas"]
 * @property {number} ["Abordagens"]
 */

/**
 * @typedef {Object} StatisticItemDTO
 * @property {FrontendCloserStatisticDTO[]} CLOSER
 * @property {FrontendSdrStatisticDTO[]} SDR
 */

/**
 * @typedef {Object} StatisticResponseDTO
 * @property {StatisticItemDTO[]} data
 */

export const EMPTY_STATISTIC_RESPONSE = Object.freeze({ data: [{ CLOSER: [], SDR: [] }] })
