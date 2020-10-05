import styled, { css } from 'styled-components';
import { shade, lighten } from 'polished';

import ButtonInput from '../../components/Button';
import SelectInput from '../../components/Select';
import Tooltip from '../../components/Tooltip';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 65vw;
  margin: 0 auto;
  border: 1px solid ${props => shade(0.1, props.theme.colors.background)};
  border-top: 0px;
  border-bottom: 0px;

  hr {
    margin: 20px;
    border: 2px solid ${props => shade(0.1, props.theme.colors.background)};
    border-bottom: 0;
  }

  @media (max-width: 1200px) {
    width: 100vw;
  }
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 35px auto 15px auto;
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px auto;
  width: 90%;

  @media (max-width: 500px) {
    width: 60vw;
  }
`;

export const FilterTitle = styled.button`
  display: flex;
  justify-content: space-between;

  background: none;
  margin: 0 15px;
  div {
    display: flex;
  }

  h1 {
    color: ${props => props.theme.colors.text.primary};
  }

  svg {
    margin-left: 15px;
  }

  div:nth-child(2) {
    display: none;
  }

  @media (max-width: 515px) {
    width: 90%;
    margin: 0 auto;
    div:nth-child(2) {
      ${() => css`
        display: inline;
      `}
    }
  }
`;

export const Selects = styled.div`
  display: flex;
  justify-content: center;

  h1 {
    font-size: 1.6rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
  }

  @media (max-width: 515px) {
    flex-direction: column;
    display: none;

    ${props =>
      props.visible &&
      css`
        display: flex;
      `}
  }
`;

export const Select = styled(SelectInput)`
  margin-top: 10px;
  width: 22%;
  padding: 0 10px;

  h1 {
    font-weight: 400;
  }

  @media (max-width: 1200px) {
    width: 22vw;
  }

  @media (max-width: 515px) {
    width: 100%;
  }
`;

export const Animals = styled.div`
  height: 40vw;
  overflow-y: auto;
  margin-top: 25px;
  padding-bottom: 25px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 50%;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  h1 {
    font-size: 2.3rem;
    margin: 25px 15px 25px 15px;
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Animal = styled.div`
  display: flex;
  background: ${props => lighten(0.8, props.theme.colors.background)};
  width: 95%;
  height: 101px;
  margin: 0 auto;
  padding: 0 15px;

  box-shadow: 4px 3px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  & + & {
    margin-top: 20px;
  }
`;

export const Info = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 8vw;
  }

  span {
    color: ${props => props.theme.colors.text.tertiary};
    font-size: 1.6rem;
    margin-left: 25px;
    font-weight: bold;
    width: 60%;
    max-width: 60%;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${props => props.theme.colors.text.tertiary};

    &:first-child {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 400;
      color: ${props => props.theme.colors.text.primary};
    }
  }
`;

export const StatusContainer = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Status = styled(Tooltip)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 35%;
  border-radius: 7px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.5rem;
  font-weight: 500;

  ${props => {
    if (props.status.adopted_at) {
      return css`
        background: ${props.theme.colors.status.adopted.background};
        border: 1px solid ${props.theme.colors.status.adopted.border};
      `;
    }

    if (props.status.verified_at) {
      return css`
        background: ${props.theme.colors.status.available};
      `;
    }

    return css`
      background: ${props.theme.colors.status.unavailable};
      color: ${props.theme.colors.text.tertiary};
    `;
  }};

  span {
    ${props => {
      if (props.status.adopted_at) {
        return css`
          background: ${props.theme.colors.status.adopted.background};
          color: ${props.theme.colors.text.tertiary};
          border: 2px solid ${props.theme.colors.status.adopted.border};
          &::before {
            border-color: ${props.theme.colors.status.adopted.border}
              transparent;
          }
        `;
      }

      if (props.status.verified_at) {
        return css`
          background: ${props.theme.colors.status.available};
          &::before {
            border-color: ${props.theme.colors.status.available} transparent;
          }
        `;
      }

      return css`
        background: ${shade(0.35, props.theme.colors.status.unavailable)};
        &::before {
          border-color: ${props.theme.colors.status.unavailable} transparent;
        }
      `;
    }};
  }
`;

export const ButtonContainer = styled.div`
  flex: 1;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin: 25px 0 80px 0;

  button {
    margin-top: 10px;
  }

  @media (max-width: 600px) {
    width: 100vw;
  }
`;

export const Button = styled(ButtonInput)`
  width: 38%;

  @media (max-width: 600px) {
    width: 80%;
  }
`;

export const Message = styled.div`
  margin-top: 50px;
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.8rem;
`;
