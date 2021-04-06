import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

import SignIn from '../../pages/SignIn';
import Theme from '../../styles/themes/light';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
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

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

describe('Sign In Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedSignIn.mockClear();
  });

  it('should be able to render the page', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <SignIn />
      </ThemeProvider>,
    );

    expect(screen.getByText('Faça seu login')).toBeTruthy();
  });

  it('should be able to sign in', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <SignIn />
      </ThemeProvider>,
    );

    const emailInputRef = screen.getByTestId('email-input');
    expect(emailInputRef).toBeTruthy();
    userEvent.type(emailInputRef, 'user@mail.com');

    const passwordInputRef = screen.getByTestId('password-input');
    expect(passwordInputRef).toBeTruthy();
    userEvent.type(passwordInputRef, 'password-123123');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: 'user@mail.com',
        password: 'password-123123',
      }),
    );
    expect(mockedSignIn).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(mockedHistoryPush).toHaveBeenCalledTimes(1));
  });

  it('should not be able to sign in with a wrong credentials', async () => {
    const mockedToast = jest
      .spyOn(toast, 'error')
      .mockImplementation(() => jest.fn());
    mockedToast.mockClear();

    render(
      <ThemeProvider theme={Theme}>
        <SignIn />
      </ThemeProvider>,
    );

    const emailInputRef = screen.getByTestId('email-input');
    expect(emailInputRef).toBeTruthy();
    userEvent.type(emailInputRef, 'user');

    const passwordInputRef = screen.getByTestId('password-input');
    expect(passwordInputRef).toBeTruthy();
    userEvent.type(passwordInputRef, '123');

    const submitButtonRef = screen.getByTestId('submit-button');
    userEvent.click(submitButtonRef);

    await waitFor(() => expect(mockedToast).toHaveBeenCalledTimes(1));
    expect(mockedToast).toHaveBeenCalledWith(
      'Campos preenchidos inválidos, tente novamente.',
    );
  });
});
