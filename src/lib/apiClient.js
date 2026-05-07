import { getAccessToken, getRefreshToken, setTokens, clearAuth } from './auth.js'

const DEFAULT_TIMEOUT_MS = 15000

const BASE_URL = (import.meta.env?.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (cause) this.cause = cause
  }
}

export class ValidationError extends ApiError {
  constructor(message, { status = 422, payload } = {}) {
    super(message, { status })
    this.name = 'ValidationError'
    this.payload = payload
  }
}

function buildUrl(path, params) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  // Always pass window.location.origin as base — ignored when BASE_URL is absolute
  const url = new URL(`${BASE_URL}${cleanPath}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function parseJsonOrThrow(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new ApiError('Invalid JSON from backend', { status: response.status, cause: err })
  }
}

async function refreshTokens() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  try {
    const res = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    setTokens(data)
    return true
  } catch {
    return false
  }
}

async function request(method, path, { params, body, signal, headers } = {}, _isRetry = false) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  const defaultHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const token = getAccessToken()
  if (token) defaultHeaders['Authorization'] = `Bearer ${token}`
  const mergedHeaders = { ...defaultHeaders, ...headers }

  let response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: mergedHeaders,
      body: body == null ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${DEFAULT_TIMEOUT_MS}ms`, { cause: err })
    }
    throw new ApiError(`Network error: ${err.message}`, { cause: err })
  }
  clearTimeout(timeoutId)

  if (response.status === 401 && !_isRetry) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      return request(method, path, { params, body, signal, headers }, true)
    }
    clearAuth()
    window.location.href = '/login.html'
    return new Promise(() => {})
  }

  if (response.status === 422) {
    const payload = await parseJsonOrThrow(response)
    throw new ValidationError('Validation failed', { status: 422, payload })
  }

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status} ${response.statusText || ''}`.trim(), {
      status: response.status,
    })
  }

  return parseJsonOrThrow(response)
}

// params positional arg takes priority over options
export function apiGet(path, params, options = {}) {
  return request('GET', path, { ...options, params })
}

// body positional arg takes priority over options
export function apiPost(path, body, options = {}) {
  return request('POST', path, { ...options, body })
}
