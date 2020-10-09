import React, { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IoMdPerson, IoIosCall } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Button,
  ButtonContainer,
  Container,
  Content,
  Form,
  Input,
  Title,
} from './styles';

const EditProfile = () => {
  const formRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    api.get('/my/user').then(response => {
      formRef.current.setData(response.data);
    });
  }, []);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          phone: Yup.string()
            .required()
            .matches(
              /\(\d{2}\)([0-9]{4}|[0-9]{5})-[0-9]{4}/,
              'O número do telefone não está no formato correto',
            ) // (00)1234-5678 || (00)12345-6789
            .min(13, 'O número precisar ter no minimo 13 dígitos')
            .max(14, 'O número pode ter no máximo 14 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put('/my/user', {
          name: data.name,
          phone: data.phone,
        });

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
          toast.error(
            'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
          );
        }
      }
    },
    [history],
  );

  return (
    <Container>
      <Content>
        <Title>Editar Perfil</Title>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Input
            name="name"
            title="Digite seu nome completo"
            icon={IoMdPerson}
            placeholder="Digite seu nome"
          />
          <Input
            name="phone"
            type="phone"
            title="Digite seu telefone"
            icon={IoIosCall}
            placeholder="DDD + Telefone"
          />
          <ButtonContainer>
            <Button title="Alterar Informações" buttonType="confirm" />
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

export default EditProfile;