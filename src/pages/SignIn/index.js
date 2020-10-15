import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { IoMdMail, IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useRegion } from '../../hooks/region';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Logo from '../../images/adoraveis.svg';

import {
  Container,
  Content,
  ImageContainer,
  FormContainer,
  Title,
  Input,
  Buttons,
  Button,
} from './styles';

const SignIn = () => {
  const formRef = useRef();

  const { signIn } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { region } = useRegion();

  const handleSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
          password: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push(location.state.from ? location.state.from : '/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);
          toast.error('Campos preenchidos inválidos, tente novamente.');

          return;
        }

        toast.error('Ocorreu um erro ao fazer login, cheque as credenciais.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
    [history, signIn, location.state],
  );

  return (
    <Container>
      <Content>
        <ImageContainer>
          <img src={Logo} alt={region ? region.institute : null} />
        </ImageContainer>
        <FormContainer>
          <Title>Faça seu login</Title>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              name="email"
              type="email"
              title="Email"
              icon={IoMdMail}
              placeholder="Digite seu email"
              data-testid="email-input"
            />
            <Input
              name="password"
              type="password"
              title="Senha"
              icon={IoIosLock}
              placeholder="Digite sua senha"
              data-testid="password-input"
            />

            <Buttons>
              <Button
                type="submit"
                title="Entrar"
                data-testid="submit-button"
              />
              <Link to="/register">
                <Button title="Registrar-se" buttonType="register" />
              </Link>
            </Buttons>
            <Link to="/forgot">Esqueci minha senha</Link>
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
