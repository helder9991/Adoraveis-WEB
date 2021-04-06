import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import userEvent from '@testing-library/user-event';
import MyAnimals from '../../pages/MyAnimals';
import Theme from '../../styles/themes/light';
import api from '../../services/api';

const mockedHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      goBack: mockedHistoryGoBack,
    }),
    Link: ({ children }) => children,
  };
});

const apiMock = new MockAdapter(api);

const apiResponseMyAnimals = [
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

const apiResponseBreeds = [
  {
    id: '1',
    animal: 'Cachorro',
    breed: 'Pitbull',
  },
  {
    id: '2',
    animal: 'Cachorro',
    breed: 'Rottweiler',
  },
  {
    id: '3',
    animal: 'Gato',
    breed: 'Sem raça',
  },
];

describe('MyAnimals In Page', () => {
  beforeEach(() => {
    apiMock
      .onGet('/breeds')
      .reply(200, apiResponseBreeds)
      .onGet('/my/animals/list')
      .reply(200, apiResponseMyAnimals)
      .onGet('/my/animals/list/count')
      .reply(200, { pages: 1 });
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <MyAnimals />
      </ThemeProvider>,
    );

    expect(screen.getByText('Meus animais cadastrados')).toBeTruthy();

    await waitForElementToBeRemoved(() =>
      screen.getByText(/Você ainda não cadastrou nenhum animal/),
    );
  });

  it('should be able to list my animals', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <MyAnimals />
      </ThemeProvider>,
    );

    const firstAnimalNameRef = await screen.findByText('Rex');
    const secondAnimalNameRef = await screen.findByText('Pandora');

    expect(firstAnimalNameRef).toBeTruthy();
    expect(secondAnimalNameRef).toBeTruthy();
  });

  it('should be able to filter animal by name', async () => {
    apiMock.onGet('/my/animals/list', { params: { name: 'Re' } }).reply(200, [
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
    ]);
    render(
      <ThemeProvider theme={Theme}>
        <MyAnimals />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Rex')).toBeTruthy();

    const nameInputRef = screen.getByPlaceholderText('Digite o nome do animal');
    userEvent.type(nameInputRef, 'Re');

    expect(await screen.findByText('Rex')).toBeTruthy();
  });

  it('should be able to filter animal by attributes', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <MyAnimals />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Rex')).toBeTruthy();

    apiMock
      .onGet('/my/animals/list', { params: { animal: 'Gato' } })
      .reply(200, [
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
      ]);

    // Filtro de animal
    const animalSelectRef = screen.getByTestId('animal-select');
    userEvent.selectOptions(animalSelectRef, 'Gato');

    expect(await screen.findByText('Pandora')).toBeTruthy();

    // Filtro de raca
    const breedSelectRef = screen.getByTestId('breed-select');
    userEvent.selectOptions(breedSelectRef, 'Sem raça');

    expect(await screen.findByText('Pandora')).toBeTruthy();

    // Filtro de porte
    const portSelectRef = screen.getByTestId('port-select');
    userEvent.selectOptions(portSelectRef, 'Pequeno');

    expect(await screen.findByText('Pandora')).toBeTruthy();

    // Filtro de genero
    const genreSelectRef = screen.getByTestId('genre-select');
    userEvent.selectOptions(genreSelectRef, 'Fêmea');

    expect(await screen.findByText('Pandora')).toBeTruthy();
  });

  it('should be able to show a message when the user havent animal', async () => {
    apiMock.onGet('/my/animals/list').reply(200, []);

    render(
      <ThemeProvider theme={Theme}>
        <MyAnimals />
      </ThemeProvider>,
    );

    expect(
      await screen.findByText('Você ainda não cadastrou nenhum animal'),
    ).toBeTruthy();
  });
});
