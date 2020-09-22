import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { IoMdMail, IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useRegion } from '../../hooks/region';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  BackButton,
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

  const { region } = useRegion();
  const { signIn } = useAuth();
  const history = useHistory();

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    async data => {
      // try {
      //   const schema = Yup.object().shape({
      //     email: Yup.string()
      //       .email('Digite um email válido')
      //       .required('Email obrigatório'),
      //     password: Yup.string()
      //       .min(8, 'A senha precisa ter no minimo 8 dígitos')
      //       .required('Senha obrigatória'),
      //   });

      //   await schema.validate(data, {
      //     abortEarly: false,
      //   });

      //   await signIn({
      //     email: data.email,
      //     password: data.password,
      //   });

      //   history.goBack();
      // } catch (err) {
      //   if (err instanceof Yup.ValidationError) {
      //     const errors = getValidationErrors(err);
      //     formRef.current.setErrors(errors);

      //     return;
      //   }

      //   toast.error('Ocorreu um erro ao fazer login, cheque as credenciais.', {
      //     position: 'top-right',
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //   });
      // }
      console.log('entrou');

      toast.error('Ocorreu um erro ao fazer login, cheque as credenciais.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    [history, signIn],
  );

  return (
    <Container>
      <BackButton onClick={handleBackPage}>
        <RiArrowLeftSLine size={32} />
        <span>Voltar</span>
      </BackButton>
      <Content>
        <ImageContainer>
          <img
            src={region ? region.logo : null}
            alt={region ? region.institute : null}
          />
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
            />
            <Input
              name="password"
              type="password"
              title="Senha"
              icon={IoIosLock}
              placeholder="Digite sua senha"
            />

            <Buttons>
              <Button type="submit" title="Entrar" />
              <Button title="Registrar-se" buttonType="register" />
            </Buttons>
            <a href="#teste">Esqueci minha senha</a>
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
