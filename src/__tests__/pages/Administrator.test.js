import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Administrator from '../../pages/Administrator';

import Theme from '../../styles/themes/light';

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }) => children,
  };
});

describe('Administrator Page', () => {
  it('should be able to render the page', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Administrator />
      </ThemeProvider>,
    );

    expect(screen.getByText('Página do administrador')).toBeTruthy();
  });
});
