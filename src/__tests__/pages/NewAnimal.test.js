import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  render,
  screen,
  waitFor,
  waitForOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import MockAdapter from 'axios-mock-adapter';

import NewAnimal from '../../pages/NewAnimal';
import Theme from '../../styles/themes/light';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedHistoryGoBack = jest.fn();
const mockedSignIn = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
      goBack: mockedHistoryGoBack,
    }),
    useLocation: () => {
      return {
        state: {
          from: 'teste',
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

describe('NewAnimal In Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedSignIn.mockClear();

    apiMock.onGet('/breeds').reply(200, apiResponseBreeds);
    apiMock.onPost('/my/animals/city-123').reply(200);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <NewAnimal />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Cadastrar Animal')).toBeTruthy();
  });

  it('should be able to register a new animal', async () => {
    global.URL.createObjectURL = jest.fn(() => 'details');

    const mockedToast = jest
      .spyOn(toast, 'info')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    render(
      <ThemeProvider theme={Theme}>
        <NewAnimal />
      </ThemeProvider>,
    );

    expect(screen.findByPlaceholderText('Selecione o animal')).toBeTruthy();

    // Primeira pagina

    const categoryInputRef = screen.getByPlaceholderText(
      'Selecione a categoria',
    );
    userEvent.selectOptions(categoryInputRef, 'Desaparecido');

    const FakeFile1 = new File(['hello1'], 'hello1.png', { type: 'image/png' });
    const FakeFile2 = new File(['hello2'], 'hello2.png', { type: 'image/png' });
    const FakeFile3 = new File(['hello3'], 'hello3.png', { type: 'image/png' });

    const uploadInputRef = screen.getByTestId('upload-input');
    userEvent.upload(uploadInputRef, [FakeFile1, FakeFile2, FakeFile3]);

    const nextToSecondPageButtonRef = screen.getByTestId('next1-button');

    userEvent.click(nextToSecondPageButtonRef);

    // Segunda pagina
    expect(screen.getByPlaceholderText('Selecione o animal')).toBeTruthy();

    const animalInputRef = screen.getByPlaceholderText('Selecione o animal');
    await waitFor(() => {
      expect(animalInputRef[2].value).toBe('Gato');
    });

    userEvent.selectOptions(animalInputRef, 'Gato');

    const breedInputRef = screen.getByPlaceholderText('Selecione a raça');
    userEvent.selectOptions(breedInputRef, 'Sem raça');

    const portInputRef = screen.getByPlaceholderText('Selecione o porte');
    userEvent.selectOptions(portInputRef, 'Pequeno');

    const yearsOldInputRef = screen.getByPlaceholderText(
      'Digite a idade do animal',
    );
    userEvent.type(yearsOldInputRef, '12');

    const genreInputRef = screen.getByPlaceholderText('Selecione o gênero');
    userEvent.selectOptions(genreInputRef, 'Macho');

    const nameInputRef = screen.getByPlaceholderText('Digite o nome do animal');
    userEvent.type(nameInputRef, 'name-123');

    const nextToThirdPageButtonRef = screen.getByTestId('next2-button');

    const castratedCheckboxRef = screen.getByTestId('castrated-checkbox');
    userEvent.click(castratedCheckboxRef);

    const pedigreeCheckboxRef = screen.getByTestId('pedigree-checkbox');
    userEvent.click(pedigreeCheckboxRef);

    userEvent.click(nextToThirdPageButtonRef);

    // Terceira pagina
    expect(await screen.findByPlaceholderText('Vacina 1')).toBeTruthy();

    const vaccineInputRef = screen.getByPlaceholderText('Vacina 1');
    userEvent.type(vaccineInputRef, 'some-vaccine');

    const observationInputRef = screen.getByPlaceholderText('Observações 1');
    userEvent.type(observationInputRef, 'some-observation');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledWith(
        'O cadastro do animal foi realizado com sucesso!',
      );
    });

    expect(mockedToast).toHaveBeenCalledTimes(1);
  });
});
