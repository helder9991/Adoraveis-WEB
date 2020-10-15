import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { sign } from 'jsonwebtoken';

import { AuthProvider, useAuth } from '../../hooks/auth';

import api from '../../services/api';

const apiMock = new MockAdapter(api);

jest.mock('jsonwebtoken', () => {
  return {
    decode: () => ({
      exp: new Date() * 1000,
    }),
  };
});

describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      token: 'token-text',
      name: 'name-text',
      permission: 'permission-text',
      url_param: 'url_param-text',
    };

    apiMock.onPost('auth').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockClear();

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'teste@mail.com',
      password: '123456789',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Adoraveis:token',
      apiResponse.token,
    );

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Adoraveis:user',
      JSON.stringify({
        name: apiResponse.name,
        ...(apiResponse.url_param ? { url_param: apiResponse.url_param } : {}),
        ...(apiResponse.permission
          ? { permission: apiResponse.permission }
          : {}),
      }),
    );
    expect(result.current.user.token).toBe('token-text');
  });

  it('should be able to sign out', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Adoraveis:token':
          return 'token-123';
        case '@Adoraveis:user':
          return JSON.stringify({
            name: 'name-123',
            permission: 'permission-123',
            url_param: 'url_param-123',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    removeItemSpy.mockClear();

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledWith('@Adoraveis:token');
    expect(removeItemSpy).toHaveBeenCalledWith('@Adoraveis:user');
    expect(result.current.user.name).toBeUndefined();
  });

  it('should be able to update user', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Adoraveis:token':
          return 'token-123';
        case '@Adoraveis:user':
          return JSON.stringify({
            name: 'name-123',
            permission: 'permission-123',
            url_param: 'url_param-123',
          });
        default:
          return null;
      }
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockClear();

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() =>
      result.current.updateUser({
        name: 'teste',
      }),
    );

    expect(setItemSpy).toHaveBeenCalledTimes(1);

    expect(result.current.user.name).toBe('teste');
  });

  it('should be able to restore data from storage when inits user', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Adoraveis:token':
          return 'token-123';
        case '@Adoraveis:user':
          return JSON.stringify({
            name: 'name-123',
            permission: 'permission-123',
            url_param: 'url_param-123',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.name).toBe('name-123');
  });
});
