import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Header from '../../components/Header';

import Theme from '../../styles/themes/light';

jest.mock('../../hooks/header', () => {
  return {
    useHeader() {
      return {
        header: true,
      };
    },
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth() {
      return {
        token: 'user-token',
        user: 'user-name',
      };
    },
  };
});

jest.mock('../../hooks/region', () => {
  return {
    useRegion() {
      return {
        institute: 'institute',
        logo: 'logo',
        url_param: 'url_param',
      };
    },
  };
});

jest.mock(
  '../../hooks/category',
  () => {
    return {
      useCategory() {
        return {
          category: 'adopt',
        };
      },
    };
  },
  { virtual: true },
);

jest.mock('react-router-dom', () => {
  return {
    useLocation() {
      return {
        pathname: '/',
      };
    },
    Link: ({ children }) => children,
  };
});

describe('Header Component', () => {
  it('should be able to render the Header', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={Theme}>
        <Header />
      </ThemeProvider>,
    );
    expect(getByTestId('header-container')).toBeTruthy();
  });
});
