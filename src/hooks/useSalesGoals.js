import { useState, useEffect } from 'react'
import { apiGet } from '../lib/apiClient'

function normalizeGoals(raw) {
  const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : [])
  const meta_total = list
    .filter(g => g.Cargo === 'Closer')
    .reduce((s, g) => s + (g.Meta_Mensal ?? 0), 0)
  const byName = Object.fromEntries(
    list.filter(g => g.Nome).map(g => [g.Nome.toLowerCase(), g])
  )
  return { meta_total, byName, list }
}

export function useSalesGoals() {
  const [goals, setGoals]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [refetchKey, setRefetchKey] = useState(0)

  const refetch = () => setRefetchKey(k => k + 1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiGet('/goals/fat')
      .then(d => {
        setGoals(normalizeGoals(d))
        setLoading(false)
      })
      .catch(err => {
        setGoals(null)
        setError(err.message || 'error')
        setLoading(false)
      })
  }, [refetchKey])

  return { goals, loading, error, refetch }
}
