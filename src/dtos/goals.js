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
 * @typedef {Object} TeamGoalsSdrDTO
 * @property {number} conexoes_enviadas
 * @property {number} conexoes_aceitas
 * @property {number} abordagens
 * @property {number} inMails_enviados
 * @property {number} follow_ups
 * @property {number} numeros_captados
 * @property {number} ligacoes_agendadas
 * @property {number} indicacoes_captadas
 */

/**
 * @typedef {Object} TeamGoalsCloserDTO
 * @property {number} ligacoes_realizadas
 * @property {number} reunioes_agendadas
 * @property {number} reunioes_realizadas
 * @property {number} indicacoes
 */

/** @typedef {{ data: SalesGoalsDTO[] }} GoalsResponseDTO */

/** @typedef {{ SDR: TeamGoalsSdrDTO, Closer: TeamGoalsCloserDTO }} TeamGoalsResponseDTO */

export const EMPTY_TEAM_GOALS = Object.freeze({ SDR: {}, Closer: {} })
