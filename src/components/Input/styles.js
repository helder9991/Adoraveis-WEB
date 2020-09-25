import styled, { css } from 'styled-components';
import { shade } from 'polished';

import Tooltip from '../Tooltip';

export const Container = styled.div`
  h1 {
    margin-left: 3px;
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.colors.input.background};
  margin-top: 1%;
  padding: 9px 13px;
  border: 2px solid ${props => props.theme.colors.background};
  border-radius: 6px;
  box-sizing: border-box;
  filter: drop-shadow(4px 3px 4px rgba(0, 0, 0, 0.25));

  transition: border 1s;

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid ${props.theme.colors.error};
    `}

  input {
    flex: 1;
    font-size: 1.8rem;
    color: ${props => shade(0.5, props.theme.colors.input.text)};
    border: none;
    border-radius: 2px;

    &::placeholder {
      color: ${props => props.theme.colors.input.text};
    }
  }

  svg {
    color: ${props => props.theme.colors.input.text};
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;

  svg {
    margin: 0;
    color: ${props => props.theme.colors.error};
  }

  span {
    background: ${props => props.theme.colors.error};
    color: #fff;

    &::before {
      border-color: ${props => props.theme.colors.error} transparent;
    }
  }
`;
