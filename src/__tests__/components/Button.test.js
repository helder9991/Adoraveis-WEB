import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Button from '../../components/Button';

import Theme from '../../styles/themes/light';

describe('Button Component', () => {
  it('should be able to render the button', () => {
    const { getByText } = render(
      <ThemeProvider theme={Theme}>
        <Button title="Entrar" />
      </ThemeProvider>,
    );

    expect(getByText('Entrar')).toBeTruthy();
  });
});
