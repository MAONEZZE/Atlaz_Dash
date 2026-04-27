import { useState, useEffect } from 'react'

const URL = 'https://n8n.learningbrands.cloud/webhook-test/pre_sales'

export function usePrevendasData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(d  => { setData(d);  setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
  }, [])

  return { data, loading, error }
}
