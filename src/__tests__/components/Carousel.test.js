import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Carousel from '../../components/Carousel';

import Theme from '../../styles/themes/light';

describe('Carousel Component', () => {
  it('should be able to render the carousel', () => {
    const { getByAltText } = render(
      <ThemeProvider theme={Theme}>
        <Carousel photos={['foto1', 'foto2', 'foto3']} />
      </ThemeProvider>,
    );

    expect(getByAltText('Foto do animal')).toBeTruthy();
  });

  it('should be able to change current photo', () => {
    const { getByTestId, getByAltText } = render(
      <ThemeProvider theme={Theme}>
        <Carousel photos={['foto1.png', 'foto2.png', 'foto3.png']} />
      </ThemeProvider>,
    );

    const buttonElement = getByTestId('button-container[1]');

    fireEvent.click(buttonElement);

    expect(getByAltText('Foto do animal').getAttribute('src')).toBe(
      'foto2.png',
    );
  });
});
