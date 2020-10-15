import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';

import Theme from '../../styles/themes/light';

const mockedHistoryGo = jest.fn();

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
        removeRegion: jest.fn(),
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
    useHistory() {
      return {
        go: mockedHistoryGo,
      };
    },
    Link: ({ children }) => children,
  };
});

describe('Header Component', () => {
  it('should be able to render the Header', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <Header />
        </ThemeProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('header-container')).toBeTruthy();
    });
  });

  it('should be able to change region', async () => {
    global.window.confirm = jest.fn(() => true);
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <Header />
        </ThemeProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByText('Alterar')).toBeTruthy();
    });

    const changeRegionButtonRef = screen.getByText('Alterar');
    userEvent.click(changeRegionButtonRef);

    await waitFor(() => {
      expect(mockedHistoryGo).toHaveBeenCalledTimes(1);
    });
  });
});
