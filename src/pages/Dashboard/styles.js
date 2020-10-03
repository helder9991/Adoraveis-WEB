import styled, { css } from 'styled-components';
import { shade, lighten } from 'polished';
import { Link } from 'react-router-dom';

import SelectInput from '../../components/Select';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
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

export const Filters = styled.div``;

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
  width: 12vw;
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

export const Message = styled.h1`
  margin-top: 50px;
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
`;

export const Animals = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 98%;
  margin: 0 auto;

  @media (max-width: 515px) {
    justify-content: center;
  }
`;

export const Animal = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #fff;
  flex-basis: 30%;
  margin: 8px 1.6%;
  text-decoration: none;

  box-shadow: 4px 3px 6px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  div {
    img {
      margin: 15px auto;
      width: 90%;
      display: block;
      border-radius: 1px;
    }
  }

  @media (max-width: 1200px) {
    flex-basis: 30%;
  }

  @media (max-width: 770px) {
    flex-basis: 46%;
  }
  @media (max-width: 515px) {
    flex-basis: 80%;
  }
`;

export const Description = styled.div`
  margin: 0 auto;
  width: 90%;
  padding-bottom: 30px;
  color: ${props => props.theme.colors.text.tertiary};
  h1 {
    margin-left: 4%;
  }
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 18px;
  div {
    width: 50%;
    display: flex;
    flex-direction: column;

    span {
      font-size: 1.6rem;
      color: ${props => props.theme.colors.text.primary};
    }

    span + span {
      color: ${props => props.theme.colors.text.tertiary};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 102px;
      font-size: 2rem;
      text-overflow: ellipsis;
      margin-left: 10%;
    }
  }

  div:first-child {
    margin-left: 4%;
  }
`;

export const Pages = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px 0 35px 0;

  span {
    font-size: 1.6rem;
  }
`;
export const Page = styled.button`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.7rem;
  margin: 0 10px;

  ${props =>
    props.selected &&
    css`
      color: ${() => props.theme.colors.text.primary};
      text-decoration: underline;
      font-size: 2rem;
    `}
`;

export const ChangePageArrow = styled.button`
  background: none;

  :disabled {
    cursor: default;
    svg {
      transition: color 2s;
      color: ${props => lighten(0.4, props.theme.colors.icon.primary)};
    }
  }
`;
