import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Checkbox from '../../components/Checkbox';

import Theme from '../../styles/themes/light';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Checkbox Component', () => {
  it('should be able to render the checkbox', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Checkbox text="checkbox test" />
      </ThemeProvider>,
    );

    expect(screen.getByText('checkbox test')).toBeTruthy();
  });
});
