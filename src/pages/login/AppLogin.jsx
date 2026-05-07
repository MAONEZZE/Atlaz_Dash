import { useState, useEffect } from 'react'
import { setTokens, setUserInfo, isAuthenticated } from '../../lib/auth'

export default function AppLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (isAuthenticated()) window.location.href = '/'
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const BASE_URL = (import.meta.env?.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.message || body?.detail || 'Email ou senha inválidos.')
        return
      }
      const data = await res.json()
      setTokens(data)
      if (data.user) setUserInfo({ ...data.user, imageUrl: data.user.imagem_url ?? null })
      window.location.href = '/'
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">D</div>
          <div className="brand-name">Dash <em>SrPamplona</em><span>.</span></div>
        </div>
        <h1 className="login-title">Entrar</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="login-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div className="login-field">
            <label className="login-label" htmlFor="password">Senha</label>
            <input
              id="password"
              className="login-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
