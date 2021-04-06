import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';

import Dashboard from '../../pages/Dashboard';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedHistoryPush = jest.fn();

const apiResponseAnimals = [
  {
    id: '1',
    name: 'Pingo',
    port: 'Pequeno',
    breed: {
      animal: 'Cachorro',
      breed: 'Pitbull',
    },
    photo:
      'http://localhost:3333/files/1602274444055-8c56eab1b563e062fa88-animal.jpg',
  },
  {
    id: '2',
    name: 'Pandora',
    port: 'Pequeno',
    breed: {
      animal: 'Cachorro',
      breed: 'Pitbull',
    },
    photo:
      'http://localhost:3333/files/1602274447078-30c9dc1b763f9fc058c1-animal.jpg',
  },
  {
    id: '3',
    name: 'Rex',
    port: 'Pequeno',
    breed: {
      animal: 'Cachorro',
      breed: 'Pitbull',
    },
    photo:
      'http://localhost:3333/files/1602274448290-5a237d16507f11ed3752-animal.jpg',
  },
];

const apiResponseCount = {
  pages: 2,
};

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useParams() {
      return {
        id: 'id-123',
      };
    },
    useLocation() {
      return {
        pathname: '/',
      };
    },
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
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

jest.mock('../../hooks/category.js', () => {
  return {
    useCategory() {
      return {
        category: 'adopt',
      };
    },
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();

    apiMock
      .onGet('/city-123/animals/list/adopt')
      .reply(200, apiResponseAnimals)
      .onGet('/city-123/animals/adopt/count')
      .reply(200, apiResponseCount);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Dashboard />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Filtros')).toBeTruthy();
  });

  it('should be able to show a message when animals is not found in server', async () => {
    apiMock
      .onGet('/city-123/animals/list/adopt')
      .reply(400)
      .onGet('/city-123/animals/adopt/count')
      .reply(400);

    render(
      <ThemeProvider theme={Theme}>
        <Dashboard />
      </ThemeProvider>,
    );

    expect(
      await screen.findByText('Não há nenhum animal disponível no momento.'),
    ).toBeTruthy();
  });

  it('should be able to list all animals', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Dashboard />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Pandora')).toBeTruthy();
    expect(await screen.findByText('Pingo')).toBeTruthy();
    expect(await screen.findByText('Rex')).toBeTruthy();
  });

  it('should be able to list available pages', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Dashboard />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId('page[1]')).toBeTruthy();
    expect(await screen.findByTestId('page[2]')).toBeTruthy();
  });
});
