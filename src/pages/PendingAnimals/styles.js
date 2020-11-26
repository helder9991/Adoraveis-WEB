import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';
import { Link } from 'react-router-dom';

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

export const Menu = styled.div``;

export const Animals = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px auto;
  width: 95%;
  height: 90%;

  overflow-y: hidden;
  margin-top: 10px;
  padding-bottom: 125px;

  h1 {
    font-size: 2.3rem;
    margin: 25px 15px 25px 15px;
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Animal = styled(Link)`
  display: flex;
  background: ${props => {
    if (props.theme.title === 'light')
      return lighten(0.8, props.theme.colors.background);
    return lighten(0.05, props.theme.colors.background);
  }};
  width: 95%;
  height: 101px;
  margin: 0 auto;
  padding: 0 15px;
  text-decoration: none;

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

export const ChangePageArrow = styled.button`
  background: none;

  svg {
    color: ${props => props.theme.colors.icon.primary};
  }

  :disabled {
    cursor: default;
    svg {
      transition: color 2s;
      color: ${props => lighten(0.4, props.theme.colors.icon.primary)};
    }
  }
`;

export const Message = styled.div`
  margin-top: 50px;
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.8rem;
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
  background: none;

  ${props =>
    props.selected &&
    css`
      color: ${() => props.theme.colors.text.primary};
      text-decoration: underline;
      font-size: 2rem;
    `}
`;
