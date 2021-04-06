import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen } from '@testing-library/react';

import Animal from '../../pages/Animal';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedHistoryPush = jest.fn();

const apiResponse = {
  name: 'name-123',
  server_id: 'server_id-123',
  genre: 'genre-123',
  pedigree: 'pedigree-123',
  port: 'port123',
  years_old: 2,
  castrated: 'castrated-123',
  category: 'category-123',
  user: {
    name: 'Admin',
    phone: '(22)22222-2222',
  },
  breed: {
    animal: 'animal-123',
    breed: 'breed-123',
  },
  vaccine: [],
  observation: [],
  photos: [
    'http://localhost:3333/files/1601945283022-428434da40ba00833853-Screenshot-from-2020-09-16-17-20-30.png',
    'http://localhost:3333/files/1601945283032-1e780e6894b3f784db5a-Screenshot-from-2020-09-17-14-43-19.png',
    'http://localhost:3333/files/1601945283032-90c039cbadf00ae1525e-Screenshot-from-2020-09-17-14-59-35.png',
    'http://localhost:3333/files/1601945283032-338190ad00ffdfc1d8a9-Screenshot-from-2020-09-17-16-35-17.png',
    'http://localhost:3333/files/1601945283033-bea80817e28d715bac59-Screenshot-from-2020-09-17-21-06-56.png',
  ],
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

jest.mock('../../hooks/auth.js', () => {
  return {
    useAuth() {
      return {
        user: {},
      };
    },
  };
});

describe('Animal Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();

    apiMock.onGet('/city-123/animals/id-123').reply(200, apiResponse);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Animal />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Dados do Animal')).toBeTruthy();
  });

  it('should be able to show a animal info', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Animal />
      </ThemeProvider>,
    );

    const animalNameRef = await screen.findByText('name-123');

    expect(animalNameRef).toBeTruthy();
  });

  it('should be able to open and close modal', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Animal />
      </ThemeProvider>,
    );

    const openModalButtonRef = await screen.findByTestId('button-open-modal');
    expect(openModalButtonRef).toBeTruthy();

    fireEvent.click(openModalButtonRef);

    // o modal abriu
    expect(screen.getByTestId('modal-container')).toBeTruthy();

    // vai para o proximo modal
    const nextModalButtonRef = screen.getByTestId('button-next-modal');
    expect(nextModalButtonRef).toBeTruthy();

    fireEvent.click(nextModalButtonRef);

    // fecha o  modal
    const closeModalButtonRef = screen.getByTestId('button-close-modal');
    expect(closeModalButtonRef).toBeTruthy();

    fireEvent.click(closeModalButtonRef);

    // verifica se o modal foi fechado
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  it('should be able to see a message with a non existing animal', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Animal />
      </ThemeProvider>,
    );

    const errorMessageRef = await screen.findByTestId('error-message');
    expect(errorMessageRef).toBeTruthy();
  });
});
