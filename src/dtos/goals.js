// Mirrors Atlaz_Dash_Backend Parts 2 + 3 (goals + team goals).
// NOTE: GET /goals/metrics returns RAW shape { SDR: {}, Closer: {} } WITHOUT a `data` wrapper.

/**
 * @typedef {Object} SalesGoalsDTO
 * @property {string} Nome
 * @property {"Closer"|"SDR"} Cargo
 * @property {number} Meta_Mensal
 * @property {number} Meta_Numeros
 * @property {number} Meta_Leads
 * @property {number} Meta_Ligacoes
 * @property {number} Meta_Reunioes
 * @property {number} Meta_Indicacoes
 */

/**
 * @typedef {Object} TeamGoalsDTO
 * @property {number} numeros_captados
 * @property {number} ligacoes_agendadas
 * @property {number} reunioes_agendadas
 * @property {number} indicacoes
 */

/** @typedef {{ data: SalesGoalsDTO[] }} GoalsResponseDTO */

/** @typedef {{ data: TeamGoalsDTO[] }} TeamGoalsResponseDTO */

export const EMPTY_TEAM_GOALS = Object.freeze({ SDR: {}, Closer: {} })
