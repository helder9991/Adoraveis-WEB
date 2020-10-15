import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Profile from '../../pages/Profile';

import Theme from '../../styles/themes/light';

const mockedSignOut = jest.fn();
const mockedRemoveRegion = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }) => children,
    useHistory: () => ({
      go: jest.fn(),
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: mockedSignOut,
    }),
  };
});

jest.mock('../../hooks/region', () => {
  return {
    useRegion: () => ({
      removeRegion: mockedRemoveRegion,
    }),
  };
});

describe('Profile In Page', () => {
  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Profile />
      </ThemeProvider>,
    );

    expect(screen.getByText('Perfil')).toBeTruthy();
  });

  it('should be able change region', async () => {
    global.window.confirm = jest.fn(() => true);
    render(
      <ThemeProvider theme={Theme}>
        <Profile />
      </ThemeProvider>,
    );

    const logoutButtonRef = screen.getByTestId('change-region-button');
    userEvent.click(logoutButtonRef);

    await waitFor(() => {
      expect(mockedRemoveRegion).toBeCalledTimes(1);
    });
  });

  it('should be able to logout', async () => {
    global.window.confirm = jest.fn(() => true);
    render(
      <ThemeProvider theme={Theme}>
        <Profile />
      </ThemeProvider>,
    );

    const logoutButtonRef = screen.getByTestId('logout-button');
    userEvent.click(logoutButtonRef);

    await waitFor(() => {
      expect(mockedSignOut).toBeCalledTimes(1);
    });
  });
});
