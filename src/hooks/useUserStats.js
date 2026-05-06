import { useState, useEffect } from 'react'

const BASE_URL = 'https://n8n.learningbrands.cloud/webhook-test/user/statistics'

export function useUserStats(users) {
  const [statsById, setStatsById] = useState({})
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!users || users.length === 0) return
    setLoading(true)

    Promise.all(
      users.map(u =>
        fetch(`${BASE_URL}/${u.id}`)
          .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
          .then(data => ({ id: u.id, data }))
          .catch(() => ({ id: u.id, data: null }))
      )
    ).then(results => {
      const map = {}
      results.forEach(({ id, data }) => { map[id] = data })
      setStatsById(map)
      setLoading(false)
    })
  }, [users])

  return { statsById, loading }
}
