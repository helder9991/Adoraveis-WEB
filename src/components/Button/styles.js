import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  display: flex;
  justify-content: center;

  margin: 0 auto;

  width: 65%;
  font-size: 2rem;
  padding: 8px 00;
  border-radius: 5px;
  font-weight: 500;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: background 0.5s;

  background: ${props => {
    if (props.buttonType === 'next') return props.theme.colors.button.next;
    if (props.buttonType === 'return')
      return props.theme.colors.button.return.background;

    if (props.buttonType === 'confirm')
      return props.theme.colors.button.confirm;

    return props.theme.colors.button.next;
  }};

  color: ${props => {
    if (props.buttonType === 'return')
      return props.theme.colors.button.return.text;

    return props.theme.colors.button.text;
  }};

  /* Adiciona a borda caso o tipo do botao seja Return */
  ${props => {
    if (props.buttonType === 'return')
      return css`
        border: 0.2rem solid ${props.theme.colors.button.return.text};
      `;
  }}

  &:hover {
    background: ${props => {
      if (props.buttonType === 'next')
        return shade(0.1, props.theme.colors.button.next);

      if (props.buttonType === 'return')
        return shade(0.05, props.theme.colors.button.return.background);

      if (props.buttonType === 'confirm')
        return shade(0.1, props.theme.colors.button.confirm);
    }};
  }
`;
