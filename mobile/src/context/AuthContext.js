import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await authAPI.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (email, password) => {
    await authAPI.login(email, password);
    const userData = await authAPI.getMe();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const userData = await authAPI.getMe();
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      initialized,
      login,
      logout,
      refreshUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isDogOwner: user?.role === 'dog_owner',
      isEventManager: user?.role === 'event_manager',
    }}>
      {children}
    </AuthContext.Provider>
  );
};