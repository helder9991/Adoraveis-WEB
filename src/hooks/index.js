import React from 'react';

import { AuthProvider } from './auth';
import { RegionProvider } from './region';
import { CategoryProvider } from './category';
import { HeaderProvider } from './header';

const AppProvider = ({ children }) => (
  <RegionProvider>
    <HeaderProvider>
      <AuthProvider>
        <CategoryProvider>{children}</CategoryProvider>
      </AuthProvider>
    </HeaderProvider>
  </RegionProvider>
);

export default AppProvider;
