import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../../pages/SignUp';
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

const apiMock = new MockAdapter(api);

describe('SignUp In Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedSignIn.mockClear();

    apiMock.onPost('/users').reply(200);
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <SignUp />
      </ThemeProvider>,
    );

    expect(screen.getByText('Criando um cadastro')).toBeTruthy();
  });

  it('should be able to register a new account', async () => {
    const mockedToast = jest
      .spyOn(toast, 'info')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    render(
      <ThemeProvider theme={Theme}>
        <SignUp />
      </ThemeProvider>,
    );

    const nameInputRef = screen.getByPlaceholderText('Digite seu nome');
    userEvent.type(nameInputRef, 'name-123');

    const emailInputRef = screen.getByPlaceholderText('Digite seu email');
    userEvent.type(emailInputRef, 'email@mail.com');

    const phoneInputRef = screen.getByPlaceholderText('DDD + Telefone');
    userEvent.type(phoneInputRef, '(16)16161-1616');

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, 'password-123');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, 'password-123');

    const submitButtonRef = screen.getByTestId('submit-button');

    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledTimes(1);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'O cadastro foi realizado com sucesso!',
    );
  });

  it('should not be able to register a new account with a wrong credentials', async () => {
    const mockedToast = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    render(
      <ThemeProvider theme={Theme}>
        <SignUp />
      </ThemeProvider>,
    );

    const nameInputRef = screen.getByPlaceholderText('Digite seu nome');
    userEvent.type(nameInputRef, 'name-123');

    const emailInputRef = screen.getByPlaceholderText('Digite seu email');
    userEvent.type(emailInputRef, 'email-123');

    const phoneInputRef = screen.getByPlaceholderText('DDD + Telefone');
    userEvent.type(phoneInputRef, '123123123');

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, 'password-123');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, 'confirmPassword-123');

    const submitButtonRef = screen.getByTestId('submit-button');

    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledTimes(1);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Ocorreu um erro ao realizar o cadastro, cheque as credenciais.',
    );
  });

  it('should be able to show a error message for try register a existing user', async () => {
    const mockedToast = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    apiMock.onPost('/users').reply(400, {
      message: 'User already exists.',
    });

    render(
      <ThemeProvider theme={Theme}>
        <SignUp />
      </ThemeProvider>,
    );

    const nameInputRef = screen.getByPlaceholderText('Digite seu nome');
    userEvent.type(nameInputRef, 'name-123');

    const emailInputRef = screen.getByPlaceholderText('Digite seu email');
    userEvent.type(emailInputRef, 'email@mail.com');

    const phoneInputRef = screen.getByPlaceholderText('DDD + Telefone');
    userEvent.type(phoneInputRef, '(16)16161-1616)');

    const passwordInputRef = screen.getByPlaceholderText('Digite sua senha');
    userEvent.type(passwordInputRef, 'password-123');

    const confirmPasswordInputRef = screen.getByPlaceholderText(
      'Digite sua senha novamente',
    );
    userEvent.type(confirmPasswordInputRef, 'password-123');

    const submitButtonRef = screen.getByTestId('submit-button');

    userEvent.click(submitButtonRef);

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledTimes(1);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Este email já está sendo utilizado por outro usuario.',
    );
  });
});
