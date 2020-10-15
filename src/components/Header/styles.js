import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { shade } from 'polished';
import { Drawer } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

export const Container = styled.header`
  align-items: center;
  width: 100%;
  height: 8vh;
  background: ${props => props.theme.colors.primary};

  svg {
    color: ${props => props.theme.colors.background};
  }

  /* remove header se o usuario estiver no tela de selecao de regiao */
  ${() =>
    useLocation().pathname === '/'
      ? css`
          display: none;
        `
      : css`
          display: flex;
        `}
`;

export const Center = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 50vw;
  margin: 0 auto;

  @media (max-width: 900px) {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 515px) {
    display: flex;
    flex: 1;
    margin-right: 30px;
  }
`;

export const Categories = styled.div`
  background: ${props => props.theme.colors.primary};

  @media (max-width: 900px) {
    display: none;
  }
`;

export const Category = styled(Link)`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 5px;

  transition: color 0.2s;

  :hover {
    ${props =>
      !props.selected &&
      css`
        color: ${shade(0.1, props.theme.colors.text.secondary)};
        text-decoration: underline;
      `}
  }

  & + a {
    margin-left: 10px;
  }

  ${props =>
    props.selected &&
    css`
      background: ${shade(0.2, props.theme.colors.primary)};
      text-decoration: underline;
    `}
`;

export const SideMenu = styled(Drawer)`
  height: 100vw;
  background: ${props => props.theme.colors.sideMenuBackground};
`;

export const Left = styled.div`
  position: absolute;
  margin-left: 5vw;
  visibility: hidden;

  button {
    background: none;
  }

  @media (max-width: 900px) {
    margin-left: 3vh;
    visibility: visible;
  }
`;

export const Logo = styled.img`
  height: 90%;
`;

export const Right = styled.div`
  position: absolute;
  right: 35px;
  margin-right: 30px;

  a {
    width: 30px;
    height: 30px;
    margin-left: 25px;

    svg {
      transition: color 0.2s;

      &:hover {
        ${props =>
          !props.selected &&
          css`
            color: ${shade(0.15, props.theme.colors.icon.secondary)};
          `}
      }
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const SideMenuContainer = styled.div`
  height: 100vh;
  background: ${props => props.theme.colors.sideMenuBackground};
  width: 250px;
  padding: 0 5px;
`;

export const SideMenuItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid
    ${props => shade(0.3, props.theme.colors.sideMenuBackground)};
  padding: 20px 0;

  svg {
    color: ${props => props.theme.colors.background};
  }

  a {
    display: flex;
    align-items: center;
    font-size: 2.2rem;
    color: ${props => props.theme.colors.text.secondary};
    text-decoration: none;
    margin-left: 16px;

    & + a {
      margin-top: 25px;
    }

    span {
      margin-left: 20px;
    }
  }
`;

export const SideMenuCloseButton = styled.div`
  display: flex;
  justify-content: end;

  button {
    background: none;
    margin: 0 15px;
  }
`;

export const Region = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  button {
    background: none;
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.8rem;
    margin-left: 15px;
  }
`;
