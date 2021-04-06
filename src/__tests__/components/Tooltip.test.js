import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Tooltip from '../../components/Tooltip';

import Theme from '../../styles/themes/light';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'select',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Tooltip Component', () => {
  it('should be able to render the Tooltip', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Tooltip title="teste" />
      </ThemeProvider>,
    );

    expect(screen.getByText('teste')).toBeTruthy();
  });

  it('should be able to render a children element in the Tooltip', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Tooltip>children</Tooltip>
      </ThemeProvider>,
    );

    expect(screen.getByText('children')).toBeTruthy();
  });
});
