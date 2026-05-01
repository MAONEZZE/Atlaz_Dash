import { useState, useEffect } from 'react'
import { loadFilters } from '../components/Filters'
import { mockDashboard } from '../mock/dashboard'

const API_URL = 'https://n8n.learningbrands.cloud/webhook-test/statistic'

const CANAL_LABEL = {
  linkedin:  'Linkedin',
  instagram: 'Instagram',
  indicacao: 'Indicação',
  whatsapp:  'WhatsApp',
  outros:    'Outros',
}

function buildFilterBody(filters) {
  const now = Date.now()
  const body = {}

  switch (filters.period) {
    case 'dia': {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      body.start_date = today.getTime()
      body.end_date   = now
      break
    }
    case 'semana':
      body.start_date = now - 7 * 24 * 60 * 60 * 1000
      body.end_date   = now
      break
    case 'mes': {
      const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0)
      body.start_date = d.getTime()
      body.end_date   = now
      break
    }
    case 'trim': {
      const d = new Date(); d.setMonth(d.getMonth() - 3)
      body.start_date = d.getTime()
      body.end_date   = now
      break
    }
    case 'sem': {
      const d = new Date(); d.setMonth(d.getMonth() - 6)
      body.start_date = d.getTime()
      body.end_date   = now
      break
    }
    case 'ano': {
      const d = new Date(); d.setFullYear(d.getFullYear() - 1)
      body.start_date = d.getTime()
      body.end_date   = now
      break
    }
    case 'custom':
      if (filters.dateRange?.start) body.start_date = filters.dateRange.start
      if (filters.dateRange?.end)   body.end_date   = filters.dateRange.end
      break
    default:
      break
  }

  if (filters.canal !== 'todos')       body.channel      = CANAL_LABEL[filters.canal] || filters.canal
  if (filters.responsavel !== 'todos') body.responsible  = filters.responsavel
  if (filters.produto !== 'todos')     body.product      = filters.produto
  if (filters.etapa !== 'todas')       body.stage        = filters.etapa
  if (filters.status !== 'todos')      body.status       = filters.status
  if (filters.tipoReceita !== 'todos') body.revenue_type = filters.tipoReceita
  if (filters.ticketFaixa !== 'todos') body.ticket_range = filters.ticketFaixa
  if (filters.atividade !== 'todos')   body.activity     = filters.atividade

  return body
}

function prevMonthRange() {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
  const end   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  return { start_date: start.getTime(), end_date: end.getTime() }
}

// Real API returns [{ SDR: [...], CLOSER: [...] }]
// Normalize to { rawClosers, rawSdrs } so App.jsx can join with user data
function normalizeResponse(raw) {
  const item = Array.isArray(raw) ? raw[0] : raw
  if (!item) return { rawClosers: [], rawSdrs: [] }

  // Already in mock format (has VENDEDORES or RANKING_COTA) — pass through
  if (item.VENDEDORES || item.RANKING_COTA) return item

  return {
    rawClosers: item.CLOSER ?? [],
    rawSdrs:    item.SDR    ?? [],
  }
}

function postStatistic(body) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
}

export function useDashboardData() {
  const [data, setData]         = useState(null)
  const [prevData, setPrevData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [filters, setFilters]   = useState(() => loadFilters())

  useEffect(() => {
    const handler = (e) => setFilters(e.detail)
    window.addEventListener('filters-change', handler)
    return () => window.removeEventListener('filters-change', handler)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const body = buildFilterBody(filters)

    Promise.all([
      postStatistic(body),
      postStatistic(prevMonthRange()),
    ])
      .then(([curr, prev]) => {
        setData(normalizeResponse(curr))
        setPrevData(normalizeResponse(prev))
        setLoading(false)
      })
      .catch(() => {
        setData(mockDashboard)
        setPrevData(null)
        setLoading(false)
        setError('fallback')
      })
  }, [filters])

  return { data, prevData, loading, error }
}
