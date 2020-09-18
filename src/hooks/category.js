import React, { createContext, useState, useCallback, useContext } from 'react';

const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {
  const [data, setData] = useState('adopt');

  const changeCategory = useCallback(() => {
    if (data === 'adopt') setData('missing');
    else setData('adopt');
  }, [data]);

  return (
    <CategoryContext.Provider value={{ category: data, changeCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export function useCategory() {
  const context = useContext(CategoryContext);

  if (!context)
    throw new Error('useCategory must be used within an CategoryProvider');

  return context;
}
