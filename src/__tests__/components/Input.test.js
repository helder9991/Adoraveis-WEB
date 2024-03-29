import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { IoIosAdd } from 'react-icons/io';
import userEvent from '@testing-library/user-event';

import { Simulate } from 'react-dom/test-utils';
import Input from '../../components/Input';

import Theme from '../../styles/themes/light';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input Component', () => {
  it('should be able to render the Input', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Input placeholder="teste" />
      </ThemeProvider>,
    );

    expect(screen.getByPlaceholderText('teste')).toBeTruthy();
  });

  it('should be able to render a icon in Input', () => {
    render(
      <ThemeProvider theme={Theme}>
        <Input placeholder="teste" icon={IoIosAdd} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('input-icon')).toBeTruthy();
  });

  it('should not be able to render a icon in Input', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Input />
      </ThemeProvider>,
    );

    expect(screen.queryByTestId('input-icon')).not.toBeInTheDocument();
  });

  it('should be able to use a phone mask in a phone input', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Input type="phone" placeholder="teste" />
      </ThemeProvider>,
    );

    const inputElement = screen.getByPlaceholderText('teste');

    await userEvent.type(inputElement, '1');
    Simulate.change(inputElement);
    expect(inputElement.value[0]).toBe('(');
    await userEvent.type(inputElement, '11');
    Simulate.change(inputElement);
    expect(inputElement.value[3]).toBe(')');
    await userEvent.type(inputElement, '1111');
    Simulate.change(inputElement);
    expect(inputElement.value[8]).toBe('-');
    await userEvent.type(inputElement, '1111');
    Simulate.change(inputElement);
    expect(inputElement.value[9]).toBe('-');
  });

  it('should be able to use a date in a date input', async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Input type="date" placeholder="teste" />
      </ThemeProvider>,
    );

    const inputElement = screen.getByPlaceholderText('teste');

    await userEvent.type(inputElement, '111');
    Simulate.change(inputElement);
    expect(inputElement.value[2]).toBe('/');
    await userEvent.type(inputElement, '11');
    Simulate.change(inputElement);
    expect(inputElement.value[2]).toBe('/');
    await userEvent.type(inputElement, '111');
  });
});
