import styled, { keyframes } from 'styled-components';
import { shade, transparentize } from 'polished';
import { Form } from '@unform/web';

import CheckboxInput from '../../components/Checkbox';
import ButtonInput from '../../components/Button';
import SelectInput from '../../components/Select';
import TextInput from '../../components/Input';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ModalBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: ${props =>
    transparentize(0.2, shade(0.9, props.theme.colors.background))};
`;

const showingModal = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: ${props => props.height};
  width: 700px;
  background: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  padding: 35px 0;

  border-radius: 7px;
  box-shadow: 4px 3px 4px rgba(0, 0, 0, 0.25);

  animation: ${showingModal} 1s;

  h1 {
    text-align: center;
  }
`;

export const OwnerInfo = styled.div`
  margin-top: -15px;
`;

export const OwnerData = styled.div`
  font-size: 2.2rem;

  & + div {
    margin-top: 15px;
  }
`;

export const TipsList = styled.div`
  width: 80%;
  margin: 0 auto;

  li {
    font-size: 1.8rem;
  }
`;

export const ModalButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
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

export const AnimalData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  margin: 2vh auto;

  @media (max-width: 1200px) {
    flex-direction: column;
    margin: 0;
  }
`;

export const CarouselContainer = styled.div`
  margin: 0 auto;
  width: 70%;
`;

export const FormContainer = styled(Form)`
  margin: 0 auto;
  width: 90%;
`;

export const Card = styled.div`
  margin: 20px 0 0 20px;
  width: 50%;

  h1 {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.primary};
    font-weight: 400;
  }

  span {
    margin-left: 15%;
    font-size: 2rem;
  }
`;

export const Buttons = styled.div`
  flex: 1;
  width: 40vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 45px auto;

  button {
    margin-top: 10px;
  }

  @media (max-width: 1200px) {
    width: 75vw;
  }
`;

export const RowButtons = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    margin-top: 10px;
    width: 45%;
  }

  @media (max-width: 1200px) {
    width: 75vw;
  }
`;

export const Button = styled(ButtonInput)`
  width: 60%;
`;

export const Message = styled.h1`
  margin-top: 50px;
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
`;

export const Input = styled(TextInput)`
  width: 50%;
  padding: 0 10px;
  display: inline-block;
  margin-bottom: 20px;

  h1 {
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const CheckboxContainer = styled.div`
  margin-left: 36px;
`;

export const Checkbox = styled(CheckboxInput)`
  label {
    width: 250px;
  }
  label span {
    color: ${props => props.theme.colors.text.primary};
    font-size: 1.7rem;
    font-weight: 400;
  }
`;

export const Select = styled(SelectInput)`
  width: 50%;
  padding: 0 10px;
  display: inline-block;
  margin-bottom: 20px;

  h1 {
    color: ${props => props.theme.colors.text.primary};
  }
`;
