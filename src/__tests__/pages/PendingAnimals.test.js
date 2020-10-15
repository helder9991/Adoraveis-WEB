import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen, act, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import userEvent from '@testing-library/user-event';
import PendingAnimals from '../../pages/PendingAnimals';
import Theme from '../../styles/themes/light';
import api from '../../services/api';

const mockedHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      goBack: mockedHistoryGoBack,
    }),
    useRegion() {
      return {
        region: {
          url_param: 'city-123',
        },
      };
    },
    Link: ({ children }) => children,
  };
});

jest.mock('../../hooks/region.js', () => {
  return {
    useRegion() {
      return {
        region: {
          url_param: 'city-123',
        },
      };
    },
  };
});

const apiMock = new MockAdapter(api);

const apiResponsePendingAnimals = [
  {
    id: '1',
    name: 'Rex',
    port: 'Grande',
    genre: 'Macho',
    verified_at: null,
    adopted_at: null,
    breed: {
      animal: 'Cachorro',
      breed: 'Rottweiler',
    },
    photo:
      'http://localhost:3333/files/1602692608028-dfca7f674c0c28bce69d-animal.jpg',
  },
  {
    id: '2',
    name: 'Pandora',
    port: 'Pequeno',
    genre: 'Fêmea',
    verified_at: null,
    adopted_at: null,
    breed: {
      animal: 'Gato',
      breed: 'Sem raça',
    },
    photo:
      'http://localhost:3333/files/1602692555209-2e3a15d4a6b1c5fc4414-animal-stereotype-orig.jpg',
  },
];

describe('PendingAnimals In Page', () => {
  beforeEach(() => {
    apiMock
      .onGet('/city-123/admin/animal/verify')
      .reply(200, apiResponsePendingAnimals);
  });

  it('should be able to render the page', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <PendingAnimals />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Animais pendentes')).toBeTruthy();
    });
  });

  it('should be able to list pending animals', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <PendingAnimals />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeTruthy();
      expect(screen.getByText('Pandora')).toBeTruthy();
    });
  });

  it("should be able to show a message when does haven't pending animals", async () => {
    apiMock.onGet('/city-123/admin/animal/verify').reply(200, []);

    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <PendingAnimals />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('Não há animais pendentes para serem aceitos'),
      ).toBeTruthy();
    });
  });
});
