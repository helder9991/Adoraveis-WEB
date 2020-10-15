import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { toast } from 'react-toastify';

import userEvent from '@testing-library/user-event';
import EditAnimal from '../../pages/EditAnimal';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedToastInfo = jest
  .spyOn(toast, 'info')
  .mockImplementation(() => jest.fn());

const mockedToastError = jest
  .spyOn(toast, 'error')
  .mockImplementation(() => jest.fn());

const mockedHistoryGoBack = jest.fn();

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
      goBack: mockedHistoryGoBack,
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

const apiResponseAnimal = {
  name: '123auau',
  server_id: '7d6335b8-5d29-412b-b3ed-3ef1b7bf8eb6',
  genre: 'Fêmea',
  pedigree: 'Não',
  port: 'Médio',
  years_old: 2,
  castrated: 'Não',
  category: 'Desaparecido',
  user: {
    name: 'Admin',
    phone: '(22)22222-2222',
  },
  breed: {
    animal: 'Cachorro',
    breed: 'Rottweiler',
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

const apiMock = new MockAdapter(api);

describe('EditAnimal Page', () => {
  beforeEach(() => {
    mockedHistoryGoBack.mockClear();
    mockedToastInfo.mockClear();
    mockedToastError.mockClear();

    apiMock
      .onGet('/city-123/animals/id-123')
      .reply(200, apiResponseAnimal)
      .onGet('/breeds')
      .reply(200, apiResponseBreeds)
      .onPut('/my/animals/id-123')
      .reply(200);
  });

  it('should be able to render the page', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <EditAnimal />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Dados do Animal')).toBeTruthy();
    });
  });

  it('should be able to put a animal info in inputs', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <EditAnimal />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Digite o nome do animal'),
      ).toBeTruthy();
      expect(screen.getByPlaceholderText('Selecione a categoria')).toBeTruthy();
      expect(screen.getByPlaceholderText('Selecione o animal')).toBeTruthy();
      expect(screen.getByPlaceholderText('Selecione a raça')).toBeTruthy();
      expect(screen.getByPlaceholderText('Selecione o porte')).toBeTruthy();
      expect(screen.getByPlaceholderText('Selecione o gênero')).toBeTruthy();
      expect(
        screen.getByPlaceholderText('Digite a idade do animal'),
      ).toBeTruthy();
    });

    const nameInputRef = screen.getByPlaceholderText('Digite o nome do animal');
    expect(nameInputRef.value).not.toBe('');

    const categoryInputRef = screen.getByPlaceholderText(
      'Selecione a categoria',
    );
    expect(categoryInputRef.value).not.toBe('');

    const animalInputRef = screen.getByPlaceholderText('Selecione o animal');
    expect(animalInputRef.value).not.toBe('');

    const breedInputRef = screen.getByPlaceholderText('Selecione a raça');
    expect(breedInputRef.value).not.toBe('');

    const portInputRef = screen.getByPlaceholderText('Selecione o porte');
    expect(portInputRef.value).not.toBe('');

    const genreInputRef = screen.getByPlaceholderText('Selecione o gênero');
    expect(genreInputRef.value).not.toBe('');

    const yearsOldInputRef = screen.getByPlaceholderText(
      'Digite a idade do animal',
    );
    expect(yearsOldInputRef.value).not.toBe('');
  });

  it('should be able to update a animal info', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <EditAnimal />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      const breed = screen.getByPlaceholderText('Selecione a raça');
      expect(breed[breed.selectedIndex].value).toBe('Rottweiler');
    });

    const nameInputRef = screen.getByPlaceholderText('Digite o nome do animal');
    userEvent.type(nameInputRef, 'name-123');

    const categoryInputRef = screen.getByPlaceholderText(
      'Selecione a categoria',
    );
    userEvent.selectOptions(categoryInputRef, 'Adoção');

    const animalInputRef = screen.getByPlaceholderText('Selecione o animal');
    userEvent.selectOptions(animalInputRef, ['Gato']);

    await waitFor(() => {
      expect(animalInputRef[animalInputRef.selectedIndex].value).toBe('Gato');
    });

    const breedInputRef = screen.getByPlaceholderText('Selecione a raça');
    userEvent.selectOptions(breedInputRef, 'Sem raça');

    const portInputRef = screen.getByPlaceholderText('Selecione o porte');
    userEvent.selectOptions(portInputRef, 'Grande');

    const genreInputRef = screen.getByPlaceholderText('Selecione o gênero');
    userEvent.selectOptions(genreInputRef, 'Macho');

    const yearsOldInputRef = screen.getByPlaceholderText(
      'Digite a idade do animal',
    );
    userEvent.type(yearsOldInputRef, '12');

    const saveButtonRef = screen.getByTestId('save-button');
    expect(saveButtonRef).toBeTruthy();

    act(() => {
      fireEvent.click(saveButtonRef);
    });

    await waitFor(() => {
      expect(mockedToastInfo).toHaveBeenCalledWith(
        'As informação do animal foi salvo com sucesso.',
      );
      expect(mockedToastInfo).toHaveBeenCalledTimes(1);
    });
  });

  it('should not be able to update a animal info in non existing animal', async () => {
    apiMock.onPut('/my/animals/id-123').reply(404, {
      message: 'Animal does not exists.',
    });

    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <EditAnimal />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Digite o nome do animal'),
      ).toBeTruthy();
    });

    const saveButtonRef = screen.getByTestId('save-button');
    expect(saveButtonRef).toBeTruthy();
    userEvent.click(saveButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Este animal não existe.');
      expect(mockedToastError).toHaveBeenCalledTimes(1);
    });
    apiMock.restore();
  });

  it('should be able to go back to previous page', async () => {
    act(() => {
      render(
        <ThemeProvider theme={Theme}>
          <EditAnimal />
        </ThemeProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('return-button')).toBeTruthy();
    });

    const returnButtonRef = await screen.findByTestId('return-button');
    expect(returnButtonRef).toBeTruthy();

    userEvent.click(returnButtonRef);

    await waitFor(() => expect(mockedHistoryGoBack).toHaveBeenCalledTimes(1));
  });
});
