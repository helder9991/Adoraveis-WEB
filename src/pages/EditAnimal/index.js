import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Carousel from '../../components/Carousel';

import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Button,
  Buttons,
  CarouselContainer,
  Checkbox,
  CheckboxContainer,
  Container,
  Content,
  FormContainer,
  Info,
  Input,
  Message,
  RowButtons,
  Select,
  Title,
} from './styles';

const Animal = () => {
  const formRef = useRef(null);

  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { region } = useRegion();

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);

  const [animal, setAnimal] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (params.id) {
      api.get(`/${region.url_param}/animals/${params.id}`).then(response => {
        setAnimal(response.data);

        formRef.current.setData({
          animal: response.data.breed.animal,
          name: response.data.name,
          castrated: response.data.castrated === 'Sim',
          category: response.data.category,
          genre: response.data.genre,
          pedigree: response.data.pedigree === 'Sim',
          port: response.data.port,
          years_old: response.data.years_old,
        });
      });
    }
    if (location.state) {
      if (Object.prototype.hasOwnProperty.call(location.state, 'admin'))
        setAdmin(true);
    }
    setLoading(false);
  }, [params.id, region, location.state]);

  useEffect(() => {
    api.get('/breeds').then(response => {
      setAllAnimals(response.data);
    });
  }, []);

  useEffect(() => {
    setAnimalsOptions([...new Set(allAnimals.map(animals => animals.animal))]);
  }, [allAnimals]);

  useEffect(() => {
    if (animal) {
      const breedOptions = allAnimals
        .filter(animalInfo => animalInfo.animal === animal.breed.animal)
        .map(({ breed }) => {
          return breed;
        });
      setBreedsOptions(breedOptions);
      formRef.current.setFieldValue('breed', animal.breed.breed);
    }
  }, [animal, allAnimals, formRef]);

  const handleClearSelect = useCallback(() => {
    formRef.current.setFieldValue('breed', '');
  }, []);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleShowBreed = useCallback(() => {
    const selectedAnimal = formRef.current.getFieldValue('animal');

    const breedOptions = allAnimals
      .filter(animals => animals.animal === selectedAnimal)
      .map(({ breed }) => breed);

    setBreedsOptions(breedOptions);
  }, [allAnimals]);

  const handleSubmit = useCallback(
    async data => {
      const schema = Yup.object().shape({
        animal: Yup.string().required('Selecione o animal'),
        breed: Yup.string().required('Selecione a raça'),
        name: Yup.string().required('O nome é obrigatorio'),
        genre: Yup.string()
          .equals(['Macho', 'Fêmea'])
          .required('A raça é obrigatoria'),
        pedigree: Yup.string().equals(['Não', 'Sim']).required(),
        port: Yup.string()
          .equals(['Pequeno', 'Médio', 'Grande'])
          .required('O porte é obrigatorio'),
        years_old: Yup.number().required('A idade é obrigatoria'),
        castrated: Yup.string().equals(['Não', 'Sim']).required(),
        category: Yup.string().equals(['Adoção', 'Desaparecido']).required(''),
        vaccines: Yup.array().of(Yup.string()),
        observations: Yup.array().of(Yup.string()),
      });

      // Caso na tenha o animal que o usuario selecionou
      const selectedAnimal = allAnimals.filter(
        animalInfo =>
          animalInfo.animal === data.animal && animalInfo.breed === data.breed,
      );
      if (selectedAnimal.length === 0) return;

      let observations = [];
      if (animal.observation.length > 0) {
        observations = data.observation.map((observation, index) => ({
          id: animal.observation[index].id,
          observation,
        }));
      }
      data = { ...data, observations };

      let vaccines = [];
      if (animal.vaccine.length > 0) {
        vaccines = data.vaccine.map((vaccine, index) => ({
          id: animal.vaccine[index].id,
          vaccine,
        }));
      }
      data = { ...data, vaccines };

      data = {
        ...data,
        castrated: data.castrated ? 'Sim' : 'Não',
        pedigree: data.pedigree ? 'Sim' : 'Não',
      };
      try {
        await schema.validate(data, { abortEarly: false });
        await api.put(`/my/animals/${params.id}`, {
          name: data.name,
          breed_id: selectedAnimal[0].id,
          port: data.port,
          years_old: data.years_old,
          castrated: data.castrated,
          pedigree: data.pedigree,
          observations: data.observations,
          vaccines: data.vaccines,
          category: data.category,
        });

        toast.info('As informação do animal foi salvo com sucesso');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);
          throw Error('Erro de validacao');
        }

        if (err.isAxiosError) {
          switch (err.response.data.message) {
            case 'Animal does not exists.':
              toast.error('Este animal não existe.');
              break;
            case 'Permission denied.':
              toast.error('Você não tem permissão para realizar esta ação.');
              break;
            default:
              toast.error(
                'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
              );
              break;
          }
          throw Error('Erro de requisicao da api');
        }
        throw Error('Erro');
      }
    },
    [params.id, animal, allAnimals],
  );

  const handleRefuseAnimal = useCallback(async () => {
    try {
      await api.patch(`/${region.url_param}/admin/animal/refuse/${params.id}`);
      toast.info('O animal foi recusado com sucesso!');
      history.goBack();
    } catch (err) {
      if (err.isAxiosError) {
        switch (err.response.data.message) {
          case 'Animal does not exists.':
            toast.error('Este animal não existe.');
            break;
          case 'You is not a admin in this ONG.':
            toast.error('Você não tem permissão para realizar esta ação.');
            break;
          default:
            toast.error(
              'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
            );
            break;
        }
      }
    }
  }, [region.url_param, params.id, history]);

  const handleAcceptAnimal = useCallback(async () => {
    try {
      await handleSubmit(formRef.current.getData());
      await api.patch(`/${region.url_param}/admin/animal/verify/${params.id}`);
      toast.info('O animal foi aceito com sucesso!');
      history.goBack();
    } catch (err) {
      if (err.isAxiosError) {
        switch (err.response.data.message) {
          case 'Animal does not exists.':
            toast.error('Este animal não existe.');
            break;
          case 'You is not a admin in this ONG.':
            toast.error('Você não tem permissão para realizar esta ação.');
            break;
          default:
            toast.error(
              'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
            );
            break;
        }
      }
    }
  }, [region.url_param, params.id, history, handleSubmit]);

  return (
    <Container>
      <Content>
        <Title>Dados do Animal</Title>

        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 25,
            }}
          >
            <CircularProgress />
          </div>
        )}
        <Info>
          {!animal ? (
            <Message>
              Este animal não está disponivel no momento ou não existe.
            </Message>
          ) : (
            <CarouselContainer>
              <Carousel photos={animal.photos} />
            </CarouselContainer>
          )}
          <FormContainer onSubmit={handleSubmit} ref={formRef}>
            <Input
              name="name"
              title="Nome do animal"
              placeholder="Digite o nome do animal"
            />
            <Select
              name="category"
              title="Categoria"
              placeholder="Selecione a categoria"
              options={['Adoção', 'Desaparecido']}
            />
            <Select
              name="animal"
              title="Animal"
              placeholder="Selecione o animal"
              options={animalsOptions}
              onChange={handleShowBreed}
              onClick={handleClearSelect}
            />
            <Select
              name="breed"
              title="Raça"
              placeholder="Selecione a raça"
              options={breedsOptions}
            />
            <Select
              name="port"
              title="Porte"
              placeholder="Selecione o porte"
              options={['Pequeno', 'Médio', 'Grande']}
            />
            <Select
              name="genre"
              title="Gênero"
              placeholder="Selecione o gênero"
              options={['Macho', 'Fêmea']}
            />
            <Input
              name="years_old"
              title="Idade"
              type="number"
              min="0"
              placeholder="Digite a idade do animal"
            />
            <hr />
            <Title>Observações</Title>
            {animal &&
              animal.observation.map((observation, index) => (
                <Input
                  key={observation.id}
                  name={`observation[${index}]`}
                  title={`Observação ${index + 1}`}
                  defaultValue={observation.observation}
                />
              ))}

            <hr />
            <Title>Vacinas</Title>
            {animal &&
              animal.vaccine.map((vaccine, index) => (
                <Input
                  key={vaccine.name}
                  name={`vaccine[${index}]`}
                  title={`Vacina ${index + 1}`}
                  defaultValue={vaccine.name}
                />
              ))}

            <hr />
            <CheckboxContainer>
              <Checkbox name="castrated" text="Animal castrado" />
              <Checkbox name="pedigree" text="Animal possui pedigree" />
            </CheckboxContainer>
            {admin ? (
              <Buttons>
                <RowButtons>
                  <Button
                    title="Rejeitar animal"
                    type="button"
                    onClick={handleRefuseAnimal}
                    buttonType="danger"
                  />
                  <Button
                    title="Aceitar animal"
                    type="button"
                    onClick={handleAcceptAnimal}
                    buttonType="confirm"
                  />
                </RowButtons>
                <Button
                  type="button"
                  title="Voltar"
                  buttonType="return"
                  onClick={handleBackPage}
                />
              </Buttons>
            ) : (
              <Buttons>
                <Button title="Salvar alterações" buttonType="confirm" />
                <Button
                  type="button"
                  title="Voltar"
                  buttonType="return"
                  onClick={handleBackPage}
                />
              </Buttons>
            )}
          </FormContainer>
        </Info>
      </Content>
    </Container>
  );
};

export default Animal;
