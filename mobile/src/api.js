import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator: 10.0.2.2
// iOS simulator: localhost
// Physical device: YOUR_COMPUTER_IP (e.g., 192.168.1.100)
const BASE_URL = 'https://studious-dollop-7vj6rwrx7vr73xpgv-8000.app.github.dev/api';

// ── Storage Keys ─────────────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = '@pawtrack_access_token';
const REFRESH_TOKEN_KEY = '@pawtrack_refresh_token';
const USER_KEY = '@pawtrack_user';

// ── Token Helpers ────────────────────────────────────────────────────────────
export const getAccessToken = async () => await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = async () => await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

export const saveTokens = async (access, refresh) => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
};

// ── Refresh Token Logic ──────────────────────────────────────────────────────
const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    throw new Error('Session expired');
  }

  const data = await response.json();
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  return data.access;
};

// ── Core Request with Auto-Refresh ───────────────────────────────────────────
const request = async (url, options = {}, retry = true) => {
  const token = await getAccessToken();
  
  const makeRequest = async (authToken) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(token);

  // If unauthorized and retry is allowed, refresh token and try again
  if (response.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();
      response = await makeRequest(newToken);
    } catch (refreshError) {
      await clearTokens();
      throw new Error('Please login again');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  if (response.status === 204) return null;
  return response.json();
};

// ── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw data;
    
    await saveTokens(data.access, data.refresh);
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  getMe: async () => {
    const data = await request('/accounts/me/');
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  logout: async () => {
    const refresh = await getRefreshToken();
    try {
      await request('/accounts/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      // Ignore errors during logout
    }
    await clearTokens();
  },

  getUser: async () => {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
};

// ── Dogs API ─────────────────────────────────────────────────────────────────
export const dogsAPI = {
  list: (params = '') => request(`/dogs/${params}`),
  detail: (id) => request(`/dogs/${id}/`),
  create: (data) => request('/dogs/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/dogs/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (id, data) => request(`/dogs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/dogs/${id}/`, { method: 'DELETE' }),
  stats: () => request('/dogs/stats/'),
  dashboard: () => request('/dogs/dashboard/'),
};

// ── Admin Users API ──────────────────────────────────────────────────────────
export const adminAPI = {
  list: () => request('/accounts/users/'),
  update: (id, data) => request(`/accounts/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/accounts/users/${id}/`, { method: 'DELETE' }),
};