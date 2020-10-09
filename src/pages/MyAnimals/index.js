import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form } from '@unform/web';
import { RiFilterFill, RiArrowDownSLine } from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';
import { isEqual, parseISO } from 'date-fns';

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
  Info,
  Input,
  Message,
  Select,
  Selects,
  Status,
  StatusContainer,
  Title,
} from './styles';

const ProfileInfo = () => {
  const formRef = useRef(null);
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [myVisibleAnimals, setMyVisibleAnimals] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);

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

  useEffect(() => {
    setLoading(true);
    api.get('/my/animals/list').then(response => {
      const animalsData = response.data.map(animal => {
        if (animal.adopted_at)
          return {
            ...animal,
            status: 'Adotado',
            message: 'Este animal já foi adotado.',
          };
        if (animal.verified_at) {
          if (
            isEqual(parseISO(animal.verified_at), new Date(0, 0, 0, 0, 0, 0))
          ) {
            return {
              ...animal,
              status: 'Recusado',
              message: 'O animal foi recusado pela instituição.',
            };
          }

          return {
            ...animal,
            status: 'Disponivel',
            message: 'O animal esta disponivel na plataforma.',
          };
        }
        return {
          ...animal,
          status: 'Em análise',
          message:
            'O animal cadastrado será analisado antes de aparecer na plataforma.',
        };
      });
      setMyAnimals(animalsData);
      setMyVisibleAnimals(animalsData);
    });
    setLoading(false);
  }, []);

  useEffect(() => {}, [formRef]);

  const handleFilterAnimals = useCallback(() => {
    const filter = formRef.current.getData();
    const visibleAnimals = myAnimals.filter(animal => {
      let allMyAnimals = false;
      let allMyBreeds = false;
      let allMyPorts = false;
      let allMyGenres = false;

      if (filter.animal === 'Todos') allMyAnimals = true;
      if (filter.breed === 'Todos') allMyBreeds = true;
      if (filter.port === 'Todos') allMyPorts = true;
      if (filter.genre === 'Todos') allMyGenres = true;

      if (
        allMyAnimals &&
        allMyBreeds &&
        allMyPorts &&
        allMyGenres &&
        filter.name === ''
      )
        return true;

      return (
        (filter.animal === animal.breed.animal || allMyAnimals) &&
        (filter.breed === animal.breed.breed || allMyBreeds) &&
        (filter.port === animal.port || allMyPorts) &&
        (filter.genre === animal.genre || allMyGenres) &&
        animal.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    });

    setMyVisibleAnimals(visibleAnimals);
  }, [formRef, myAnimals]);

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
        <Title>Meus animais cadastrados</Title>
        <Center>
          {loading && setAllAnimals.length === 0 && (
            <Message>
              <CircularProgress />
            </Message>
          )}
          <Form onSubmit={() => {}} ref={formRef}>
            <FilterTitle onClick={handleChangeFiltersVisibility}>
              <div>
                <h1>Filtros</h1>
                <RiFilterFill size={22} />
              </div>
              <div>
                <RiArrowDownSLine size={32} />
              </div>
            </FilterTitle>
            <Input
              name="name"
              title="Nome do animal"
              placeholder="Digite o nome do animal"
              onChange={handleFilterAnimals}
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
                  handleFilterAnimals();
                }}
              />
              <Select
                name="breed"
                title="Raça"
                defaultValue="Todos"
                options={['Todos', ...breedsOptions]}
                onChange={handleFilterAnimals}
              />
              <Select
                name="port"
                title="Porte"
                defaultValue="Todos"
                options={['Todos', 'Pequeno', 'Médio', 'Grande']}
                onChange={handleFilterAnimals}
              />
              <Select
                name="genre"
                title="Gênero"
                defaultValue="Todos"
                options={['Todos', 'Macho', 'Fêmea']}
                onChange={handleFilterAnimals}
              />
            </Selects>
          </Form>

          <hr />

          <Animals>
            <h1>Meus Animais</h1>
            {myVisibleAnimals.length > 0 ? (
              myVisibleAnimals.map(animal => (
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
                  <Info>
                    <img src={animal.photo} alt={animal.name} />
                  </Info>
                  <Info>
                    <span>Nome</span>
                    <span>{animal.name}</span>
                  </Info>
                  <Info>
                    <span>Porte</span>
                    <span>{animal.port}</span>
                  </Info>
                  <Info>
                    <span>Raça</span>
                    <span>{animal.breed.breed}</span>
                  </Info>
                  <StatusContainer>
                    <Status
                      title={animal.message}
                      status={{
                        adopted_at: animal.adopted_at,
                        verified_at: animal.verified_at,
                      }}
                    >
                      {animal.status}
                    </Status>
                  </StatusContainer>
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
