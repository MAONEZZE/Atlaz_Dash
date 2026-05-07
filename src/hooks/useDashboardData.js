import { useState, useEffect } from 'react'
import { loadFilters } from '../components/Filters'
import { apiGet } from '../lib/apiClient'

function buildFilterParams(filters) {
  const now = Date.now()
  const params = {}

  switch (filters.period) {
    case 'dia': {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      params.data_inicio = today.getTime()
      params.data_fim    = now
      break
    }
    case 'semana':
      params.data_inicio = now - 7 * 24 * 60 * 60 * 1000
      params.data_fim    = now
      break
    case 'mes': {
      const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0)
      params.data_inicio = d.getTime()
      params.data_fim    = now
      break
    }
    case 'trim': {
      const d = new Date(); d.setMonth(d.getMonth() - 3)
      params.data_inicio = d.getTime()
      params.data_fim    = now
      break
    }
    case 'sem': {
      const d = new Date(); d.setMonth(d.getMonth() - 6)
      params.data_inicio = d.getTime()
      params.data_fim    = now
      break
    }
    case 'ano': {
      const d = new Date(); d.setFullYear(d.getFullYear() - 1)
      params.data_inicio = d.getTime()
      params.data_fim    = now
      break
    }
    case 'custom':
      if (filters.dateRange?.start) params.data_inicio = filters.dateRange.start
      if (filters.dateRange?.end)   params.data_fim    = filters.dateRange.end
      break
    default:
      break
  }

  if (filters.canal !== 'todos')       params.canal              = filters.canal
  if (filters.responsavel !== 'todos') params.responsavel        = filters.responsavel
  if (filters.produto !== 'todos')     params.produto            = filters.produto
  if (filters.etapa !== 'todas')       params.etapa_do_funil     = filters.etapa
  if (filters.status !== 'todos')      params.status_do_negocio  = filters.status
  if (filters.tipoReceita !== 'todos') params.tipo_de_receita    = filters.tipoReceita
  if (filters.ticketFaixa !== 'todos') params.faixa_de_ticket    = filters.ticketFaixa
  if (filters.atividade !== 'todos')   params.tipo_de_atividade  = filters.atividade

  return params
}

function prevMonthRange() {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
  const end   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  return { data_inicio: start.getTime(), data_fim: end.getTime() }
}

function normalizeResponse(raw) {
  const item = Array.isArray(raw?.data) ? raw.data[0] : (Array.isArray(raw) ? raw[0] : raw)
  if (!item) return { rawClosers: [], rawSdrs: [] }
  return {
    rawClosers: item.CLOSER ?? [],
    rawSdrs:    item.SDR    ?? [],
  }
}

export function useDashboardData() {
  const [data, setData]             = useState(null)
  const [prevData, setPrevData]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [filters, setFilters]       = useState(() => loadFilters())
  const [refetchKey, setRefetchKey] = useState(0)

  const refetch = () => setRefetchKey(k => k + 1)

  useEffect(() => {
    const handler = (e) => setFilters(e.detail)
    window.addEventListener('filters-change', handler)
    return () => window.removeEventListener('filters-change', handler)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const params = buildFilterParams(filters)
    const prevParams = prevMonthRange()

    Promise.allSettled([
      apiGet('/metrics', params,     { signal: controller.signal }),
      apiGet('/metrics', prevParams, { signal: controller.signal }),
    ]).then(([currResult, prevResult]) => {
      if (controller.signal.aborted) return
      if (currResult.status === 'fulfilled') {
        setData(normalizeResponse(currResult.value))
        setError(null)
      } else {
        setData(null)
        setError(currResult.reason?.message ?? 'error')
      }
      setPrevData(
        prevResult.status === 'fulfilled'
          ? normalizeResponse(prevResult.value)
          : null
      )
      setLoading(false)
    })

    return () => controller.abort()
  }, [filters, refetchKey])

  return { data, prevData, loading, error, refetch }
}
