import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { IoMdMail } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import Logo from '../../images/adoraveis.svg';

import api from '../../services/api';

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

const ForgotPassword = () => {
  const formRef = useRef();

  const handleSubmit = useCallback(async data => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Digite um email válido')
          .required('Email obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users/password/forgot', {
        email: data.email,
      });

      toast.info('Um email para a troca de senha foi enviado em seu email.');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current.setErrors(errors);

        toast.error('Digite um email válido.');

        return;
      }

      if (err.isAxiosError) {
        switch (err.response.data.message) {
          case 'User does not exists.':
            toast.error('Este email não está cadastrado na plataforma.');
            break;
          default:
            toast.error(
              'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
            );
            break;
        }
      }
    }
  }, []);

  return (
    <Container>
      <Content>
        <ImageContainer>
          <img src={Logo} alt="Adoraveis" />
        </ImageContainer>
        <FormContainer>
          <Title>Esqueci minha senha</Title>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              name="email"
              type="email"
              title="Digite seu email para recuperar a conta"
              icon={IoMdMail}
              placeholder="Digite seu email"
              data-testid="email-input"
            />

            <Buttons>
              <Button
                type="submit"
                buttonType="confirm"
                title="Enviar"
                data-testid="submit-button"
              />
              <Link to="/login">
                <Button title="Voltar" buttonType="return" />
              </Link>
            </Buttons>
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
};

export default ForgotPassword;
