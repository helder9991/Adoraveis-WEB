import React from 'react';

import { AuthProvider } from './auth';
import { RegionProvider } from './region';
import { CategoryProvider } from './category';

const AppProvider = ({ children }) => (
  <RegionProvider>
    <AuthProvider>
      <CategoryProvider>{children}</CategoryProvider>
    </AuthProvider>
  </RegionProvider>
);

export default AppProvider;
