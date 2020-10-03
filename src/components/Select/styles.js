import styled, { css } from 'styled-components';
import { shade } from 'polished';

import Tooltip from '../Tooltip';

export const Container = styled.div`
  width: 100%;
  h1 {
    margin-left: 3px;
    color: ${props => props.theme.colors.text.secondary};
    font-size: 2rem;
    font-weight: bold;
  }
`;

export const SelectContainer = styled.div`
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

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid ${props.theme.colors.error};
    `}

  input {
    flex: 8;
    outline: none;
    background: none;
    border: none;
    font-size: 1.6rem;
    color: ${props => shade(0.8, props.theme.colors.input.text)};

    transition: border 1s;

    &::-webkit-calendar-picker-indicator {
      opacity: 100;
      color: ${props => shade(0.2, props.theme.colors.input.text)};
    }
  }
`;

export const Error = styled(Tooltip)`
  flex: 2;
  height: 20px;
  margin-left: 3%;

  svg {
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
