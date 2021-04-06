import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';

import ResetPassword from '../../pages/ResetPassword';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedToastError = jest
  .spyOn(toast, 'error')
  .mockImplementation(() => jest.fn());

const mockedToastInfo = jest
  .spyOn(toast, 'info')
  .mockImplementation(() => jest.fn());

const mockedHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      goBack: mockedHistoryGoBack,
    }),
    useLocation() {
      return {
        pathname: '/',
        search: '?token=token-123',
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

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryGoBack.mockClear();
    mockedToastError.mockClear();
    mockedToastInfo.mockClear();

    apiMock.onPut('/users/password/reset').reply(200);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ResetPassword />
      </ThemeProvider>,
    );

    expect(await screen.findByText('Alterar senha')).toBeTruthy();
  });

  it('should not be able to reset the password with a wrong credentials', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ResetPassword />
      </ThemeProvider>,
    );

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, '12345678');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, '321654987');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledTimes(1);
      expect(mockedToastError).toHaveBeenCalledWith(
        'Campos preenchidos inválidos, tente novamente.',
      );
    });
  });

  it('should be able to show a error message when occasionally API return a error ', async () => {
    apiMock
      .onPut('/users/password/reset')
      .reply(400, { message: 'some-error' });

    render(
      <ThemeProvider theme={Theme}>
        <ResetPassword />
      </ThemeProvider>,
    );

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, '12345678');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, '12345678');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledTimes(1);
      expect(mockedToastError).toHaveBeenCalledWith(
        'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
      );
    });
  });

  it('should be able to show a error message when the token expires ', async () => {
    apiMock
      .onPut('/users/password/reset')
      .reply(400, { message: 'Token expired or inexistent.' });

    render(
      <ThemeProvider theme={Theme}>
        <ResetPassword />
      </ThemeProvider>,
    );

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, '12345678');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, '12345678');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledTimes(1);
      expect(mockedToastError).toHaveBeenCalledWith('Este link já expirou.');
    });
  });

  it('should be able to reset the password ', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ResetPassword />
      </ThemeProvider>,
    );

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, '12345678');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, '12345678');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToastInfo).toHaveBeenCalledTimes(1);
      expect(mockedToastInfo).toHaveBeenCalledWith(
        'Sua senha foi alterada com sucesso.',
      );
    });
  });
});
