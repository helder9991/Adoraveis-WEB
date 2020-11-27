import styled from 'styled-components';
import { lighten } from 'polished';

import TextInput from '../../components/Input';
import ButtonInput from '../../components/Button';

export const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.secondary};
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.8rem;

  position: absolute;
  left: 5vw;
  top: 9vh;

  svg {
    color: ${props => props.theme.colors.icon.secondary};
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 75vw;

  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: start;
    height: 70vh;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;

  width: 40%;

  img {
    width: 60%;
  }

  @media (max-width: 900px) {
    width: 75%;
    max-width: 350px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 35%;

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 330px;

    font-size: 1.5rem;

    div:first-child(2) {
      margin-top: 15px;
    }

    a {
      text-decoration: none;
      color: ${props => props.theme.colors.text.primary};
      font-weight: 500;

      transition: color 0.3s;

      &:hover {
        color: ${props => lighten(0.8, props.theme.colors.text.primary)};
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 900px) {
    height: 60%;
    width: 100%;

    form {
      min-width: 200px;
    }
  }
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;

  @media (max-width: 900px) {
    margin-top: 80px;
  }
`;

export const Input = styled(TextInput)`
  margin-top: 20px;
  width: 100%;
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 15px 0;

  button {
    margin-top: 10px;
  }

  @media (max-width: 900px) {
    width: 75vw;
  }
`;

export const Button = styled(ButtonInput)`
  width: 80%;
`;
