import styled from 'styled-components';
import { shade } from 'polished';

import ButtonInput from '../../components/Button';

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

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px auto;
  width: 32%;

  div {
    display: flex;
    flex-direction: column;

    & + div {
      margin-top: 25px;
    }

    span {
      color: ${props => props.theme.colors.text.tertiary};
      font-size: 1.6rem;
      margin-left: 25px;
    }

    span:first-child {
      margin: 0;
      font-size: 1.4rem;
      color: ${props => props.theme.colors.text.primary};
    }
  }

  @media (max-width: 500px) {
    width: 60vw;
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
