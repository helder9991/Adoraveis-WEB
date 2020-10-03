import styled from 'styled-components';
import { shade } from 'polished';
import { Form as FormContainer } from '@unform/web';

import ButtonInput from '../../components/Button';
import TextInput from '../../components/Input';

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

export const Form = styled(FormContainer)`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 35px auto 0 auto;
  width: 80%;
`;

export const Input = styled(TextInput)`
  width: 50%;
  margin: 0 auto;
  & + & {
    margin-top: 25px;
  }
  h1 {
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const ButtonContainer = styled.div`
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
    width: 100vw;
  }
`;

export const Button = styled(ButtonInput)`
  width: 38%;

  @media (max-width: 600px) {
    width: 80%;
  }
`;
