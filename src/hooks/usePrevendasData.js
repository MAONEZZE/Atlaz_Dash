import { useState, useEffect } from 'react'
import { loadFilters } from '../components/Filters'
import { apiGet } from '../lib/apiClient'

function buildParams(filters) {
  const now = Date.now()
  const params = {}

  switch (filters.period) {
    case 'dia': {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      params.data_inicio = today.getTime(); params.data_fim = now
      break
    }
    case 'semana':
      params.data_inicio = now - 7 * 24 * 60 * 60 * 1000; params.data_fim = now
      break
    case 'mes': {
      const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0)
      params.data_inicio = d.getTime(); params.data_fim = now
      break
    }
    case 'trim': {
      const d = new Date(); d.setMonth(d.getMonth() - 3)
      params.data_inicio = d.getTime(); params.data_fim = now
      break
    }
    case 'sem': {
      const d = new Date(); d.setMonth(d.getMonth() - 6)
      params.data_inicio = d.getTime(); params.data_fim = now
      break
    }
    case 'ano': {
      const d = new Date(); d.setFullYear(d.getFullYear() - 1)
      params.data_inicio = d.getTime(); params.data_fim = now
      break
    }
    case 'custom':
      if (filters.dateRange?.start) params.data_inicio = filters.dateRange.start
      if (filters.dateRange?.end)   params.data_fim    = filters.dateRange.end
      break
    default:
      break
  }

  return params
}

export function usePrevendasData() {
  const [data, setData]             = useState(null)
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
    setLoading(true)
    setError(null)

    apiGet('/pre-sales/funnels', buildParams(filters))
      .then(d => {
        setData(d && typeof d === 'object' ? d : null)
        setLoading(false)
      })
      .catch(err => {
        setData(null)
        setError(err.message || 'Erro ao carregar dados de pré-vendas.')
        setLoading(false)
      })
  }, [filters, refetchKey])

  return { data, loading, error, refetch }
}
