import React, { createContext, useState, useCallback, useContext } from 'react';

import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@Adoraveis:token');
    const user = localStorage.getItem('@Adoraveis:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { token, user } = response.data;

    localStorage.setItem('@Adoraveis:token', token);
    localStorage.setItem('@Adoraveis:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Adoraveis:token');
    localStorage.removeItem('@Adoraveis:user');

    setData({});
  }, []);

  const updateUser = useCallback(
    user => {
      localStorage.setItem('@Adoraveis:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}
