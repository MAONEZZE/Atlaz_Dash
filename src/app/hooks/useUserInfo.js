import { useState, useEffect } from 'react'

const API_URL = 'https://n8n.learningbrands.cloud/webhook-test/user/info'

const TOKEN_MAP = {
  jacob:    import.meta.env.VITE_IMG_JACOB_TOKEN,
  jonathan: import.meta.env.VITE_IMG_JONATHAN_TOKEN,
  alex:     import.meta.env.VITE_IMG_ALEX_TOKEN,
  jennifer: import.meta.env.VITE_IMG_JENNIFER_TOKEN,
}

function buildImageUrl(baseUrl, userId) {
  const token = TOKEN_MAP[userId?.toLowerCase()] || ''
  return token ? baseUrl + token : baseUrl
}

function normalizeUser(u) {
  return {
    id:       u.id,
    nome:     u.nome,
    imageUrl: u.imagem_url ? buildImageUrl(u.imagem_url, u.id) : null,
    cargo:    u.cargo, // 'closer' | 'sdr'
  }
}

export function useUserInfo() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_URL)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(data => {
        const list = Array.isArray(data) ? data : [data]
        setUsers(list.map(normalizeUser))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const closers = users.filter(u => u.cargo === 'closer')
  const sdrs    = users.filter(u => u.cargo === 'sdr')

  return { users, closers, sdrs, loading }
}
