import { useState, useEffect } from 'react'
import { apiGet } from '../lib/apiClient'

export function useTeamGoals() {
  const [teamTotals, setTeamTotals] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [refetchKey, setRefetchKey] = useState(0)

  const refetch = () => setRefetchKey(k => k + 1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiGet('/goals/metrics')
      .then(d => {
        // Shape RAW: {SDR:{...}, Closer:{...}} — sem wrapper data
        setTeamTotals(d && typeof d === 'object' ? d : null)
        setLoading(false)
      })
      .catch(err => {
        setTeamTotals(null)
        setError(err.message || 'error')
        setLoading(false)
      })
  }, [refetchKey])

  return { teamTotals, loading, error, refetch }
}
