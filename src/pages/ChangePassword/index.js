import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Button,
  ButtonContainer,
  Container,
  Content,
  Form,
  Input,
  Input2,
  Title,
} from './styles';

const ChangePassword = () => {
  const formRef = useRef(null);
  const { signOut } = useAuth();
  const history = useHistory();

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          oldPassword: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .required('Senha obrigatória'),
          password: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .required('A nova senha é obrigatória'),
          passwordConfirmation: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put('/my/user', data);

        toast.info('A alteracão foi realizada com sucesso!');
        history.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);
          toast.error(
            'Ocorreu um erro ao realizar o cadastro, cheque as credenciais.',
          );

          return;
        }

        if (err.isAxiosError) {
          switch (err.response.data.message) {
            case 'User password does not match.':
              toast.error('Senha atual inválida.');
              break;
            case 'JWT token is missing.' || 'Invalid JWT token':
              signOut();
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
    [history, signOut],
  );

  return (
    <Container>
      <Content>
        <Title>Alterar Senha</Title>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Input
            name="oldPassword"
            type="password"
            title="Digite sua senha atual"
            icon={IoIosLock}
            placeholder="Digite sua senha"
          />
          <Input
            name="password"
            type="password"
            title="Digite sua nova senha telefone"
            icon={IoIosLock}
            placeholder="Digite a nova senha"
          />
          <Input2
            name="passwordConfirmation"
            type="password"
            icon={IoIosLock}
            placeholder="Digite novamente a nova senha"
          />
          <ButtonContainer>
            <Button
              title="Alterar Informações"
              buttonType="confirm"
              data-testid="submit-button"
            />
            <Button
              title="Voltar"
              type="button"
              buttonType="return"
              onClick={handleBackPage}
            />
          </ButtonContainer>
        </Form>
      </Content>
    </Container>
  );
};

export default ChangePassword;
