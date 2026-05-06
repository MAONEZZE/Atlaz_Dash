import { useState, useEffect } from 'react'
import { apiGet } from '../lib/apiClient'

function normalizeUser(u) {
  const cargo = u.cargo ? u.cargo.charAt(0).toUpperCase() + u.cargo.slice(1) : u.cargo
  return {
    id:       u.id,
    nome:     u.nome,
    imageUrl: u.imagem_url || null,
    cargo,
  }
}

export function useUserInfo() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [refetchKey, setRefetchKey] = useState(0)

  const refetch = () => setRefetchKey(k => k + 1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiGet('/users')
      .then(data => {
        const raw  = data?.data ?? data
        const list = Array.isArray(raw) ? raw : [raw]
        setUsers(list.map(normalizeUser))
        setLoading(false)
      })
      .catch(err => {
        setUsers([])
        setError(err.message || 'error')
        setLoading(false)
      })
  }, [refetchKey])

  const closers = users.filter(u => u.cargo === 'Closer')
  const sdrs    = users.filter(u => u.cargo === 'SDR')

  return { users, closers, sdrs, loading, error, refetch }
}
