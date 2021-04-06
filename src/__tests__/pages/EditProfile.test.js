import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

import userEvent from '@testing-library/user-event';
import EditProfile from '../../pages/EditProfile';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedToastError = jest
  .spyOn(toast, 'error')
  .mockImplementation(() => jest.fn());

const mockedHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => {
  return {
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

const apiResponse = {
  name: 'Test',
  email: 'test@mail.com',
  phone: '(11)11111-1111',
};

const apiMock = new MockAdapter(api);

describe('EditProfile Page', () => {
  beforeEach(() => {
    mockedHistoryGoBack.mockClear();
    mockedToastError.mockClear();

    apiMock
      .onGet('/my/user')
      .reply(200, apiResponse)
      .onPut('/my/user')
      .reply(200);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect(screen.getByText('Editar Perfil')).toBeTruthy();
  });

  it('should be able to put user info in inputs', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect((await screen.findByPlaceholderText('Digite seu nome')).value).toBe(
      apiResponse.name,
    );
    expect((await screen.findByPlaceholderText('DDD + Telefone')).value).toBe(
      apiResponse.phone,
    );
  });

  it('should be able to update user info', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect((await screen.findByPlaceholderText('Digite seu nome')).value).toBe(
      apiResponse.name,
    );

    const nameInputRef = screen.getByPlaceholderText('Digite seu nome');
    userEvent.type(nameInputRef, 'name-123');

    const phoneInputRef = screen.getByPlaceholderText('DDD + Telefone');
    userEvent.type(phoneInputRef, '(11)11111-1111');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedHistoryGoBack).toBeCalledTimes(1);
    });
  });

  it('should not be able to update user info with a wrong credentials', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect((await screen.findByPlaceholderText('Digite seu nome')).value).toBe(
      apiResponse.name,
    );

    const nameInputRef = screen.getByPlaceholderText('Digite seu nome');
    userEvent.type(nameInputRef, 'name-123');

    const phoneInputRef = screen.getByPlaceholderText('DDD + Telefone');
    userEvent.clear(phoneInputRef);
    userEvent.type(phoneInputRef, '4412dasdsa');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toBeCalledTimes(1);
    });

    expect(mockedToastError).toBeCalledWith(
      'Ocorreu um erro ao atualizar, cheque as credenciais.',
    );
  });

  it('should be able to show a error message when occasionally get a error by API', async () => {
    apiMock.onPut('/my/user').reply(400, { message: 'some-error' });
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect((await screen.findByPlaceholderText('Digite seu nome')).value).toBe(
      apiResponse.name,
    );

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toBeCalledTimes(1);
    });

    expect(mockedToastError).toBeCalledWith(
      'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
    );
  });

  it('should be able to back to previous page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <EditProfile />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId('return-button')).toBeTruthy();

    const returnButtonRef = screen.getByTestId('return-button');
    userEvent.click(returnButtonRef);

    await waitFor(() => {
      expect(mockedHistoryGoBack).toHaveBeenCalledTimes(1);
    });
  });
});
