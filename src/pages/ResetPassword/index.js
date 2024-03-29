import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

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

const ResetPassword = () => {
  const formRef = useRef();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          password: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .required('Senha obrigatória'),
          passwordConfirmation: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .oneOf(
              [Yup.ref('password'), null],
              'As senhas precisam ser iguais',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace('?token=', '');

        await api.put('/users/password/reset', {
          password: data.password,
          token,
        });

        toast.info('Sua senha foi alterada com sucesso.');

        setTimeout(() => {
          history.replace('/login');
        }, 6000);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);

          toast.error('Campos preenchidos inválidos, tente novamente.');
          return;
        }

        if (err.isAxiosError) {
          switch (err.response.data.message) {
            case 'Token expired or inexistent.':
              toast.error('Este link já expirou.');
              break;
            default:
              toast.error(
                'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
              );
              break;
          }
        }
      }
    },
    [location, history],
  );

  return (
    <Container>
      <Content>
        <ImageContainer>
          <img src={Logo} alt="Adoraveis" />
        </ImageContainer>
        <FormContainer>
          <Title>Alterar senha</Title>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              name="password"
              type="password"
              title="Digite sua nova senha senha"
              icon={IoIosLock}
              placeholder="Digite sua senha"
            />
            <Input
              name="passwordConfirmation"
              type="password"
              title="Digite sua nova senha novamente"
              icon={IoIosLock}
              placeholder="Digite sua senha novamente"
            />

            <Buttons>
              <Button
                type="submit"
                buttonType="confirm"
                title="Confirmar"
                data-testid="submit-button"
              />
            </Buttons>
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
