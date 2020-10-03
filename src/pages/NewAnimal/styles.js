import styled, { css, keyframes } from 'styled-components';
import { shade, lighten } from 'polished';

import SelectInput from '../../components/Select';
import TextInput from '../../components/Input';
import ButtonInput from '../../components/Button';
import CheckboxInput from '../../components/Checkbox';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 65vw;
  margin: 0 auto;
  border: 1px solid ${props => shade(0.1, props.theme.colors.background)};
  border-top: 0px;
  border-bottom: 0px;

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

export const FormContainer = styled.div`
  flex: 1;
  width: 60%;
  margin: 0 auto;

  form {
    height: 100%;
  }

  @media (max-width: 600px) {
    width: 90vw;
  }
`;

export const Select = styled(SelectInput)`
  width: 100%;
  h1 {
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Select2 = styled(Select)`
  width: 48%;

  h1 {
    font-size: 1.8rem;
  }

  @media (max-width: 755px) {
    width: 100%;
    margin-bottom: 15px;
  }
`;

export const Input = styled(TextInput)`
  width: 100%;
  h1 {
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Input2 = styled(Input)`
  width: 48%;

  h1 {
    font-size: 1.8rem;
  }

  @media (max-width: 755px) {
    width: 100%;
  }
`;

export const FileInput = styled.div`
  margin-top: 15px;
`;

export const Thumbnails = styled.div`
  margin-top: 12px;
`;

export const PhotoInfo = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  background: ${props => props.theme.colors.text.secondary};
  margin-top: 15px;
  padding: 8px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;

  div {
    flex: 9;
    display: flex;
    align-items: center;
    height: 25px;

    img {
      width: 45px;
      max-height: 25px;
    }

    span {
      margin-left: 3%;
      font-size: 1.4rem;
    }
  }

  button {
    background: none;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: ${props => props.theme.colors.error};
      transition: color 0.2s;
      &:hover {
        color: ${props => shade(0.6, props.theme.colors.error)};
      }
    }
  }
`;

export const Buttons = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin: 25px 0 80px 0;

  button {
    margin-top: 10px;
  }

  @media (max-width: 600px) {
    width: 90vw;
  }
`;

export const Button = styled(ButtonInput)`
  width: 60%;
`;

const showingPage = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Page = styled.div`
  display: none;

  animation: ${showingPage} 600ms;

  ${props =>
    props.visible &&
    css`
      height: 100%;
      display: flex;
      flex-direction: column;
    `}
`;

export const InputsContainer = styled.div`
  max-width: 100%;
  margin-bottom: 20px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;

  & + & {
    margin-top: 15px;
  }

  @media (max-width: 755px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & + & {
      margin-top: 0;
    }
  }
`;

export const Checkbox = styled(CheckboxInput)`
  label span {
    color: ${props => props.theme.colors.text.primary};
    font-size: 1.6rem;
    font-weight: 400;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;

  & + & {
    margin-top: 0;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    svg {
      color: ${props => props.theme.colors.error};
      margin-left: 5px;
    }
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  margin: 10px 0 0 15px;
  color: ${props => lighten(0.15, props.theme.colors.text.primary)};
  background: none;

  svg {
    color: ${props => lighten(0.15, props.theme.colors.icon.primary)};
  }

  span {
    margin-left: 5px;
    font-size: 1.6rem;
  }
`;
