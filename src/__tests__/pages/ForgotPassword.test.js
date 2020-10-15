import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

import Theme from '../../styles/themes/light';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }) => children,
  };
});

describe('Forgot Password Page', () => {
  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ForgotPassword />
      </ThemeProvider>,
    );

    expect(screen.getByText('Esqueci minha senha')).toBeTruthy();
  });

  it('should be able to send email', async () => {
    const mockedToast = jest
      .spyOn(toast, 'info')
      .mockImplementation(() => jest.fn());

    apiMock.onPost('/users/password/forgot').reply(204);

    render(
      <ThemeProvider theme={Theme}>
        <ForgotPassword />
      </ThemeProvider>,
    );

    const emailInputRef = screen.getByTestId('email-input');
    expect(emailInputRef).toBeTruthy();
    userEvent.type(emailInputRef, 'user@mail.com');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() =>
      expect(mockedToast).toHaveBeenCalledWith(
        'Um email para a troca de senha foi enviado em seu email.',
      ),
    );
    await waitFor(() => expect(mockedToast).toHaveBeenCalledTimes(1));
  });

  it('should be able to show a error with a wrong email field', async () => {
    const mockedToast = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    render(
      <ThemeProvider theme={Theme}>
        <ForgotPassword />
      </ThemeProvider>,
    );

    const emailInputRef = screen.getByTestId('email-input');
    expect(emailInputRef).toBeTruthy();
    userEvent.type(emailInputRef, 'user');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() =>
      expect(mockedToast).toHaveBeenCalledWith('Digite um email válido.'),
    );
    await waitFor(() => expect(mockedToast).toHaveBeenCalledTimes(1));
  });

  it('should be able to show a error message with a non existing user', async () => {
    const mockedToast = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    apiMock.onPost('/users/password/forgot').reply(404, {
      message: 'User does not exists.',
    });

    render(
      <ThemeProvider theme={Theme}>
        <ForgotPassword />
      </ThemeProvider>,
    );

    const emailInputRef = screen.getByTestId('email-input');
    expect(emailInputRef).toBeTruthy();
    userEvent.type(emailInputRef, 'user@mail.com');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() =>
      expect(mockedToast).toHaveBeenCalledWith(
        'Este email não está cadastrado na plataforma.',
      ),
    );
    await waitFor(() => expect(mockedToast).toHaveBeenCalledTimes(1));
  });
});
