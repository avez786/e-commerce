export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
export const token = () => localStorage.getItem('token');
export function readJwt() {
  try { const part = token()?.split('.')[1]; if (!part) return {}; return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))); }
  catch { return {}; }
}
export const currentRole = () => String(readJwt().role || readJwt().authorities?.[0] || 'USER').replace(/^ROLE_/, '').toUpperCase();
export const currentEmail = () => readJwt().sub || readJwt().email || '';
export async function api(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...options.headers };
  let response;
  try { response = await fetch(`${API_BASE}${path}`, { ...options, headers }); }
  catch { throw new Error(`Cannot connect to the API Gateway at ${API_BASE}. Make sure the backend services are running.`); }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const body = await response.json(); message = body.message || body.error || message; } catch { try { const body = await response.text(); if (body && body.length < 220) message = body; } catch {} }
    if (response.status === 401) message = 'Your session may have expired. Please sign in again.';
    if (response.status === 403) message = 'You do not have permission to do that.';
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const type = response.headers.get('content-type') || '';
  return type.includes('application/json') ? response.json() : null;
}
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
export const safeImage = url => url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
