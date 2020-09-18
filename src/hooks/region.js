import React, { createContext, useState, useCallback, useContext } from 'react';

const RegionContext = createContext({});

export const RegionProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const region = localStorage.getItem('@Adoraveis:region');

    if (region) return JSON.parse(region);

    return null;
  });

  const setRegion = useCallback(
    ({ institute, logo, url_param }) => setData({ institute, logo, url_param }),
    [],
  );

  const saveRegion = useCallback(({ institute, logo, url_param }) => {
    localStorage.setItem(
      '@Adoraveis:region',
      JSON.stringify({ institute, logo, url_param }),
    );
  }, []);

  const removeRegion = useCallback(() => {
    localStorage.removeItem('@Adoraveis:region');

    setData({});
  }, []);

  return (
    <RegionContext.Provider
      value={{ region: data, setRegion, saveRegion, removeRegion }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export function useRegion() {
  const context = useContext(RegionContext);

  if (!context)
    throw new Error('useRegion must be used within an RegionProvider');

  return context;
}
