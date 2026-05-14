import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, saveTokens, clearTokens, getAccessToken } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getAccessToken()) {
      authAPI.me()
        .then(setUser)
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    saveTokens(data.access, data.refresh);
    const me = await authAPI.me();
    setUser(me);
    return me;
  };

  const logout = async () => {
    try { await authAPI.logout(localStorage.getItem('refresh')); } catch {}
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);