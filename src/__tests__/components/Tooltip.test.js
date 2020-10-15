import React from 'react';
import { render } from '@testing-library/react';
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
    const { getByText } = render(
      <ThemeProvider theme={Theme}>
        <Tooltip title="teste" />
      </ThemeProvider>,
    );

    expect(getByText('teste')).toBeTruthy();
  });

  it('should be able to render a children element in the Tooltip', () => {
    const { getByText } = render(
      <ThemeProvider theme={Theme}>
        <Tooltip>children</Tooltip>
      </ThemeProvider>,
    );

    expect(getByText('children')).toBeTruthy();
  });
});
