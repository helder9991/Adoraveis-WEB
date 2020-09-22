import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  display: flex;
  justify-content: center;

  margin: 0 auto;

  font-size: 2rem;
  padding: 8px 00;
  border-radius: 5px;
  font-weight: 500;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: background 0.5s;

  background: ${props => {
    switch (props.buttonType) {
      case 'next':
        return props.theme.colors.button.next;

      case 'return' || 'register':
        return props.theme.colors.button.return.background;

      case 'confirm':
        return props.theme.colors.button.confirm;
      default:
        break;
    }
  }};

  color: ${props => {
    switch (props.buttonType) {
      case 'return':
        return props.theme.colors.button.return.text;

      case 'register':
        return props.theme.colors.button.next;

      default:
        return props.theme.colors.button.text;
    }
  }};

  /* Adiciona a borda caso o tipo do botao seja Return ou Register */
  ${props => {
    switch (props.buttonType) {
      case 'return':
        return css`
          border: 0.2rem solid ${props.theme.colors.button.return.text};
        `;
      case 'register':
        return css`
          border: 0.2rem solid ${props.theme.colors.button.next};
        `;
      default:
        break;
    }
  }}

  &:hover {
    background: ${props => {
      switch (props.buttonType) {
        case 'next':
          return shade(0.1, props.theme.colors.button.next);

        case 'return':
          return shade(0.05, props.theme.colors.button.return.background);

        case 'confirm':
          return shade(0.1, props.theme.colors.button.confirm);
        default:
          break;
      }
    }};
  }
`;
