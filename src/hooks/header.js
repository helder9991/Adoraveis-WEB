import React, { createContext, useState, useCallback, useContext } from 'react';

const HeaderContext = createContext({});

export const HeaderProvider = ({ children }) => {
  const [data, setData] = useState(true);

  const changeHeader = useCallback(value => {
    setData(value);
  }, []);

  return (
    <HeaderContext.Provider value={{ header: data, changeHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export function useHeader() {
  const context = useContext(HeaderContext);

  if (!context)
    throw new Error('useHeader must be used within an HeaderProvider');

  return context;
}
