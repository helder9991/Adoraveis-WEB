import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form } from '@unform/web';
import { RiFilterFill, RiArrowDownSLine } from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';

import { toast } from 'react-toastify';
import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import {
  Animal,
  Animals,
  Button,
  ButtonContainer,
  Center,
  Container,
  Content,
  FilterTitle,
  ImageContainer,
  Info,
  InfoRow,
  Input,
  Message,
  SearchButton,
  Select,
  Selects,
  Title,
} from './styles';

const ProfileInfo = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { region } = useRegion();

  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);
  const [filterIsVisible, setFilterIsVisible] = useState(false);

  useEffect(() => {
    api.get('/breeds').then(response => {
      setAllAnimals(response.data);
    });
    formRef.current.setData({
      animal: 'Todos',
      breed: 'Todos',
      port: 'Todos',
      genre: 'Todos',
    });
  }, []);

  useEffect(() => {
    setAnimalsOptions([...new Set(allAnimals.map(({ animal }) => animal))]);
  }, [allAnimals]);

  const handleSearch = useCallback(
    async data => {
      setLoading(true);
      try {
        await api
          .get(`/${region.url_param}/animals/list/all`, {
            params: {
              ...(data.name.length > 0 ? { name: data.name } : {}),
              ...(data.animal !== 'Todos' ? { animal: data.animal } : {}),
              ...(data.genre !== 'Todos' ? { genre: data.genre } : {}),
              ...(data.port !== 'Todos' ? { port: data.port } : {}),
              ...(data.genre !== 'Todos' ? { genre: data.genre } : {}),
            },
          })
          .then(response => {
            setAnimals(response.data);
            toast.info('A busca foi realizada com sucesso');
          });
      } catch (err) {
        toast.error('Algo de errado aconteceu durante a busca');
      }
      setLoading(false);
    },
    [region],
  );

  const handleChangeFiltersVisibility = useCallback(() => {
    setFilterIsVisible(!filterIsVisible);
  }, [filterIsVisible]);

  const handleShowBreed = useCallback(() => {
    const selectedAnimal = formRef.current.getFieldValue('animal');

    const breedOptions = allAnimals
      .filter(({ animal }) => animal === selectedAnimal)
      .map(({ breed }) => breed);

    setBreedsOptions(breedOptions);
  }, [allAnimals]);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Content>
        <Title>Animais cadastrados</Title>
        <Center>
          {loading && setAllAnimals.length === 0 && (
            <Message>
              <CircularProgress />
            </Message>
          )}
          <Form onSubmit={handleSearch} ref={formRef}>
            <FilterTitle type="button" onClick={handleChangeFiltersVisibility}>
              <div>
                <h1>Filtros</h1>
                <RiFilterFill size={22} />
              </div>
              <div>
                <RiArrowDownSLine size={32} />
              </div>
            </FilterTitle>
            <Input
              visible={filterIsVisible}
              name="name"
              title="Nome do animal"
              placeholder="Digite o nome do animal"
              icon={IoIosSearch}
            />
            <Selects visible={filterIsVisible}>
              <Select
                name="animal"
                title="Animal"
                defaultValue="Todos"
                options={['Todos', ...animalsOptions]}
                onChange={() => {
                  handleShowBreed();
                }}
              />
              <Select
                name="breed"
                title="Raça"
                defaultValue="Todos"
                options={['Todos', ...breedsOptions]}
              />
              <Select
                name="port"
                title="Porte"
                defaultValue="Todos"
                options={['Todos', 'Pequeno', 'Médio', 'Grande']}
              />
              <Select
                name="genre"
                title="Gênero"
                defaultValue="Todos"
                options={['Todos', 'Macho', 'Fêmea']}
              />
            </Selects>
            <SearchButton title="Buscar" />
          </Form>

          <hr />

          <Animals>
            <h1>Animais</h1>
            {animals.length > 0 ? (
              animals.map(animal => (
                <Animal
                  key={animal.id}
                  to={{
                    pathname: `/animal/${animal.id}`,
                    state: {
                      owner: true,
                      ...(animal.adopted_at ? { adopted: true } : {}),
                    },
                  }}
                >
                  <ImageContainer>
                    <img src={animal.photo} alt={animal.name} />
                  </ImageContainer>
                  <InfoRow>
                    <Info>
                      <span>Nome</span>
                      <span>{animal.name}</span>
                    </Info>
                    <Info>
                      <span>Porte</span>
                      <span>{animal.port}</span>
                    </Info>
                  </InfoRow>
                  <InfoRow>
                    <Info>
                      <span>Raça</span>
                      <span>{animal.breed.breed}</span>
                    </Info>
                  </InfoRow>
                </Animal>
              ))
            ) : (
              <Message>Você ainda não cadastrou nenhum animal</Message>
            )}
          </Animals>
        </Center>

        <ButtonContainer>
          <Button title="Voltar" buttonType="return" onClick={handleBackPage} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default ProfileInfo;
