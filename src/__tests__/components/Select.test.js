import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Select from '../../components/Select';

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

describe('Select Component', () => {
  it('should be able to render the Select', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Select placeholder="teste" />
      </ThemeProvider>,
    );

    expect(screen.getByPlaceholderText('teste')).toBeTruthy();
  });

  it('should be able to pass options to Select input', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Select placeholder="teste" options={['teste1', 'teste2']} />
      </ThemeProvider>,
    );

    expect(screen.getByText('teste1')).toBeTruthy();
    expect(screen.getByText('teste2')).toBeTruthy();
  });

  it('should be able to render the title', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Select title="teste" />
      </ThemeProvider>,
    );

    expect(screen.getByText('teste')).toBeTruthy();
  });
});
