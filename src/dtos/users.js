// Mirrors Atlaz_Dash_Backend Part 4 (users) + per-user statistics route.

/**
 * @typedef {Object} UserInfoDTO
 * @property {string} id
 * @property {string} nome
 * @property {"Closer"|"SDR"} cargo
 * @property {string} imagem_url - Full URL, already includes auth token when applicable
 */

/** @typedef {{ data: UserInfoDTO[] }} UsersResponseDTO */

/**
 * @typedef {Object} UserStatisticsResponseDTO
 * @property {string} user_id
 * @property {string} nome
 * @property {string} cargo
 * @property {{ CLOSER: Array, SDR: Array }} statistics
 */

export const EMPTY_USERS_RESPONSE = Object.freeze({ data: [] })
export const EMPTY_USER_STATISTICS = Object.freeze({ user_id: '', nome: '', cargo: '', statistics: { CLOSER: [], SDR: [] } })
