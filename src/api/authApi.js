import { api, unwrap } from './client'
import { rawHttp } from './http'

export function loginRequest(email, password) {
  return rawHttp.post('/api/auth/login', { email, password }).then((r) => unwrap(r))
}

export function registerRequest(body) {
  return rawHttp.post('/api/auth/register', body).then((r) => unwrap(r))
}

export function meRequest() {
  return api.get('/api/auth/me').then((r) => unwrap(r))
}
