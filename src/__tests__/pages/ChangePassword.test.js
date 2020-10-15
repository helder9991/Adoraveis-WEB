import React from 'react';
import { ThemeProvider } from 'styled-components';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChangePassword from '../../pages/ChangePassword';

import api from '../../services/api';

import Theme from '../../styles/themes/light';

const mockedHistoryGoBack = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      goBack: mockedHistoryGoBack,
    }),
    Link: ({ children }) => children,
  };
});

describe('Change Password Page', () => {
  beforeEach(() => {
    mockedHistoryGoBack.mockClear();
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ChangePassword />
      </ThemeProvider>,
    );

    expect(screen.getByText('Alterar Senha')).toBeTruthy();
  });

  it('should be able to change the password', async () => {
    apiMock.onPut('/my/user').reply(200);

    render(
      <ThemeProvider theme={Theme}>
        <ChangePassword />
      </ThemeProvider>,
    );

    expect(screen.getByText('Alterar Senha')).toBeTruthy();

    const oldPasswordRef = screen.getByPlaceholderText('Digite sua senha');
    expect(oldPasswordRef).toBeTruthy();
    await userEvent.type(oldPasswordRef, '12345678');

    const passwordRef = screen.getByPlaceholderText('Digite a nova senha');
    expect(passwordRef).toBeTruthy();
    await userEvent.type(passwordRef, '12345678');

    const confirmPasswordRef = screen.getByPlaceholderText(
      'Digite novamente a nova senha',
    );
    expect(confirmPasswordRef).toBeTruthy();
    await userEvent.type(confirmPasswordRef, '12345678');

    const buttonRef = screen.getByTestId('submit-button');
    userEvent.click(buttonRef);

    await waitFor(() => expect(mockedHistoryGoBack).toHaveBeenCalledTimes(1));
  });

  it('should not be able to change the password with a invalid fields', async () => {
    apiMock.onPut('/my/user').reply(200);

    render(
      <ThemeProvider theme={Theme}>
        <ChangePassword />
      </ThemeProvider>,
    );

    expect(screen.getByText('Alterar Senha')).toBeTruthy();

    const oldPasswordRef = screen.getByPlaceholderText('Digite sua senha');
    expect(oldPasswordRef).toBeTruthy();
    await userEvent.type(oldPasswordRef, '123');

    const passwordRef = screen.getByPlaceholderText('Digite a nova senha');
    expect(passwordRef).toBeTruthy();
    await userEvent.type(passwordRef, '123');

    const confirmPasswordRef = screen.getByPlaceholderText(
      'Digite novamente a nova senha',
    );
    expect(confirmPasswordRef).toBeTruthy();
    await userEvent.type(confirmPasswordRef, '123');

    const buttonRef = screen.getByTestId('submit-button');
    userEvent.click(buttonRef);

    await waitFor(() =>
      expect(mockedHistoryGoBack).not.toHaveBeenCalledTimes(1),
    );
  });

  it('should not be able to change the password with a password confirmation invalid', async () => {
    apiMock.onPut('/my/user').reply(200);

    render(
      <ThemeProvider theme={Theme}>
        <ChangePassword />
      </ThemeProvider>,
    );

    expect(screen.getByText('Alterar Senha')).toBeTruthy();

    const oldPasswordRef = screen.getByPlaceholderText('Digite sua senha');
    expect(oldPasswordRef).toBeTruthy();
    await userEvent.type(oldPasswordRef, '12345678');

    const passwordRef = screen.getByPlaceholderText('Digite a nova senha');
    expect(passwordRef).toBeTruthy();
    await userEvent.type(passwordRef, '123456789');

    const confirmPasswordRef = screen.getByPlaceholderText(
      'Digite novamente a nova senha',
    );
    expect(confirmPasswordRef).toBeTruthy();
    await userEvent.type(confirmPasswordRef, '123');

    const buttonRef = screen.getByTestId('submit-button');
    userEvent.click(buttonRef);

    await waitFor(() =>
      expect(mockedHistoryGoBack).not.toHaveBeenCalledTimes(1),
    );
  });
});
