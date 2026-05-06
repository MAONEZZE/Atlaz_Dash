import { useState, useEffect } from 'react'
import { apiGet } from '../lib/apiClient'

export function useUserStats(users, { data_inicio, data_fim } = {}) {
  const [statsById, setStatsById]   = useState({})
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [refetchKey, setRefetchKey] = useState(0)

  const refetch = () => setRefetchKey(k => k + 1)

  useEffect(() => {
    if (!users || users.length === 0) return
    setLoading(true)
    setError(null)

    Promise.allSettled(
      users.map(u =>
        apiGet(`/users/${u.id}/metrics`, { data_inicio, data_fim })
          .then(data => ({ id: u.id, statistics: data?.statistics ?? null }))
          .catch(() => ({ id: u.id, statistics: null }))
      )
    ).then(results => {
      const map = {}
      let allFailed = true
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          map[r.value.id] = r.value.statistics
          if (r.value.statistics !== null) allFailed = false
        }
      })
      setStatsById(map)
      setError(allFailed ? 'error' : null)
      setLoading(false)
    })
  }, [users, data_inicio, data_fim, refetchKey])

  return { statsById, loading, error, refetch }
}
