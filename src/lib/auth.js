export function getAccessToken()  { return localStorage.getItem('access_token') }
export function getRefreshToken() { return localStorage.getItem('refresh_token') }

export function setTokens({ access_token, refresh_token }) {
  if (access_token)  localStorage.setItem('access_token', access_token)
  if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
}

export function setUserInfo(user) {
  localStorage.setItem('auth_user', JSON.stringify(user))
}

export function getUserInfo() {
  try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
}

export function clearAuth() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('auth_user')
}

export function isAuthenticated() { return !!getAccessToken() }
