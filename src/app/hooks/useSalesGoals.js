import { useState, useEffect } from 'react'

const GOALS_URL = 'https://n8n.learningbrands.cloud/webhook-test/sales/goals'

export function useSalesGoals() {
  const [goals, setGoals]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(GOALS_URL)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(d  => { setGoals(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { goals, loading }
}
