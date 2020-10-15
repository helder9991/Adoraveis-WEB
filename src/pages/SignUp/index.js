import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { IoMdPerson, IoIosCall, IoMdMail, IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useRegion } from '../../hooks/region';

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
import api from '../../services/api';

const SignUp = () => {
  const formRef = useRef();

  const { region } = useRegion();
  const history = useHistory();

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
          phone: Yup.string()
            .required()
            .matches(
              /\(\d{2}\)([0-9]{4}|[0-9]{5})-[0-9]{4}/,
              'O número do telefone não está no formato correto',
            ) // (00)1234-5678 || (00)12345-6789
            .min(13, 'O número precisar ter no minimo 13 dígitos')
            .max(14, 'O número pode ter no máximo 14 dígitos'),
          password: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .required('Senha obrigatória'),
          passwordConfirmation: Yup.string()
            .min(8, 'A senha precisa ter no minimo 8 dígitos')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });

        toast.info('O cadastro foi realizado com sucesso!');

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
            case 'User already exists.':
              toast.error(
                'Este email já está sendo utilizado por outro usuario.',
              );
              break;
            default:
              toast.error(
                'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
              );
              break;
          }

          return;
        }

        toast.error(
          'Ocorreu um erro ao realizar o cadastro, cheque as credenciais.',
        );
      }
    },
    [history],
  );

  return (
    <Container>
      <Content>
        <ImageContainer>
          <img src={Logo} alt={region ? region.institute : null} />
        </ImageContainer>
        <FormContainer>
          <Title>Criando um cadastro</Title>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              name="name"
              title="Digite seu nome completo"
              icon={IoMdPerson}
              placeholder="Digite seu nome"
            />
            <Input
              name="email"
              type="email"
              title="Digite o seu email"
              icon={IoMdMail}
              placeholder="Digite seu email"
            />
            <Input
              name="phone"
              type="phone"
              title="Digite seu telefone"
              icon={IoIosCall}
              placeholder="DDD + Telefone"
            />
            <Input
              name="password"
              type="password"
              title="Digite sua senha senha"
              icon={IoIosLock}
              placeholder="Digite sua senha"
            />
            <Input
              name="passwordConfirmation"
              type="password"
              title="Digite sua senha novamente"
              icon={IoIosLock}
              placeholder="Digite sua senha novamente"
            />

            <Buttons>
              <Button
                type="submit"
                title="Cadastrar"
                buttonType="confirm"
                data-testid="submit-button"
              />
              <Button
                type="button"
                title="Voltar"
                buttonType="return"
                onClick={handleBackPage}
                data-testid="return-button"
              />
            </Buttons>
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
