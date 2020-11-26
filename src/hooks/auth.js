import React, { createContext, useState, useCallback, useContext } from 'react';
import { decode } from 'jsonwebtoken';
import { isAfter } from 'date-fns';

import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@Adoraveis:token');
    const user = JSON.parse(localStorage.getItem('@Adoraveis:user'));

    if (token && user) {
      const { exp } = decode(token);

      // verifica se o token ja expirou
      if (isAfter(new Date(), new Date(exp * 1000))) {
        localStorage.removeItem('@Adoraveis:token');
        localStorage.removeItem('@Adoraveis:user');

        return {};
      }

      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, ...user };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/auth', { email, password });

    const { token, name, permission, url_param = '' } = response.data;

    localStorage.setItem('@Adoraveis:token', token);
    localStorage.setItem(
      '@Adoraveis:user',
      JSON.stringify({
        name,
        ...(url_param ? { url_param } : {}),
        ...(permission ? { permission } : {}),
      }),
    );

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, name, permission, ...(url_param ? { url_param } : {}) });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Adoraveis:token');
    localStorage.removeItem('@Adoraveis:user');

    setData({});
  }, []);

  const updateUser = useCallback(
    ({ name }) => {
      const userStorage = JSON.parse(localStorage.getItem('@Adoraveis:user'));
      localStorage.setItem(
        '@Adoraveis:user',
        JSON.stringify({ ...userStorage, name }),
      );
      setData({
        ...data,
        name,
      });
    },
    [setData, data],
  );

  return (
    <AuthContext.Provider value={{ user: data, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}
