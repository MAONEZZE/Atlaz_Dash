// Mirrors Atlaz_Dash_Backend Part 5 (pre-sales funnels).
// Always five channels: linkedin, instagram, indicacao, whatsapp, outros.

/** @typedef {"num"|"pct"|"dec"|"h"|"dias"} FunnelFmt */

/**
 * @typedef {Object} FunnelStepDTO
 * @property {string} id
 * @property {string} nome - Step label
 * @property {number} v - Value
 */

/**
 * @typedef {Object} FunnelKpiDTO
 * @property {string} id
 * @property {string} l - Label
 * @property {number} meta
 * @property {string|null} auxRef - Reference to a block in aux.blocos for real value; null if unused
 */

/**
 * @typedef {Object} FunnelAuxBlockDTO
 * @property {string} l - Label
 * @property {number} v - Value
 * @property {FunnelFmt} fmt
 */

/**
 * @typedef {Object} FunnelAuxDTO
 * @property {string} titulo
 * @property {FunnelAuxBlockDTO[]} blocos
 */

/**
 * @typedef {Object} ChannelFunnelDTO
 * @property {string} id - e.g. "linkedin"
 * @property {string} nome - e.g. "LinkedIn"
 * @property {string} cor - Primary channel colour
 * @property {string} corAcc - Accent colour
 * @property {string} sub - Subtitle
 * @property {FunnelStepDTO[]} etapas
 * @property {FunnelKpiDTO[]} kpis
 * @property {FunnelAuxDTO} aux
 */

/**
 * FUNIS_POR_CANAL is a fixed-key object (not an array).
 * @typedef {Object} PreSalesFunnelResponseDTO
 * @property {{ linkedin: ChannelFunnelDTO, instagram: ChannelFunnelDTO, indicacao: ChannelFunnelDTO, whatsapp: ChannelFunnelDTO, outros: ChannelFunnelDTO }} FUNIS_POR_CANAL
 */

export const PRE_SALES_CHANNEL_KEYS = Object.freeze(['linkedin', 'instagram', 'indicacao', 'whatsapp', 'outros'])
