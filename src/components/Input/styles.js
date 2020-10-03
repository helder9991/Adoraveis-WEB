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
  background: ${props =>
    props.disabled
      ? shade(0.11, props.theme.colors.input.background)
      : props.theme.colors.input.background};
  margin-top: 4px;
  padding: 9px 13px;
  border: 1px solid
    ${props =>
      props.disabled
        ? shade(0.11, props.theme.colors.background)
        : props.theme.colors.border};
  border-radius: 6px;
  box-sizing: border-box;
  filter: drop-shadow(4px 3px 4px rgba(0, 0, 0, 0.25));

  transition: border 1s;

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid ${props.theme.colors.error};
    `}

  label {
    flex: 1;
    display: flex;
    align-items: center;
  }

  input {
    flex: 1;
    font-size: 1.6rem;
    color: ${props => shade(0.5, props.theme.colors.input.text)};
    border: none;
    border-radius: 2px;
    width: 100%;

    &::placeholder {
      color: ${props => props.theme.colors.input.text};
    }

    ${props =>
      props.inputType === 'file' &&
      css`
        width: 0;
        height: 0;
        display: none;
      `}
  }

  svg {
    color: ${props => shade(0.2, props.theme.colors.icon.primary)};
    margin-right: 2%;
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

export const FileContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  margin: 0 0 0 2%;
  font-size: 1.8rem;
  color: ${props => shade(0.5, props.theme.colors.input.text)};
  cursor: pointer;

  svg {
    margin: 0;
  }
`;
