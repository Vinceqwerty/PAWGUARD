const BASE_URL = 'https://animated-doodle-wrqp9xj5566pfg79q-8000.app.github.dev/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');
export const saveTokens = (access, refresh) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// ── Auth header ───────────────────────────────────────────────────────────────
const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAccessToken()}`,
});

// ── Auto-refresh on 401 ───────────────────────────────────────────────────────
const refreshAccessToken = async () => {
  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: getRefreshToken() }),
  });
  if (!res.ok) { clearTokens(); throw new Error('Session expired.'); }
  const data = await res.json();
  localStorage.setItem('access', data.access);
  return data.access;
};

// ── Core request (retries once after token refresh) ───────────────────────────
const request = async (url, options = {}) => {
  let res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: { ...authHeader(), ...options.headers },
  });

  if (res.status === 401) {
    try {
      await refreshAccessToken();
      res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: { ...authHeader(), ...options.headers },
      });
    } catch {
      clearTokens();
      window.location.href = '/login';
      return;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    }),

  register: (userData) =>
    fetch(`${BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    }),

  logout: (refresh) =>
    request('/accounts/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),

  me: () => request('/accounts/me/'),
};

// ── Dogs API ──────────────────────────────────────────────────────────────────
export const dogsAPI = {
  list:      (params = '') => request(`/dogs/${params}`),
  detail:    (id)           => request(`/dogs/${id}/`),
  create:    (data)         => request('/dogs/', { method: 'POST',  body: JSON.stringify(data) }),
  update:    (id, data)     => request(`/dogs/${id}/`, { method: 'PUT',   body: JSON.stringify(data) }),
  patch:     (id, data)     => request(`/dogs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete:    (id)           => request(`/dogs/${id}/`, { method: 'DELETE' }),
  stats:     ()             => request('/dogs/stats/'),
  dashboard: ()             => request('/dogs/dashboard/'),
};

// ── Admin Users API ───────────────────────────────────────────────────────────
export const usersAPI = {
  list:   ()         => request('/accounts/users/'),
  update: (id, data) => request(`/accounts/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id)       => request(`/accounts/users/${id}/`, { method: 'DELETE' }),
};