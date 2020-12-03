import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form } from '@unform/web';
import {
  RiFilterFill,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';
import { isSameDay, parseISO } from 'date-fns';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import {
  Animal,
  Animals,
  Button,
  ButtonContainer,
  Center,
  ChangePageArrow,
  Container,
  Content,
  FilterTitle,
  ImageContainer,
  Info,
  InfoRow,
  Input,
  Message,
  Pages,
  Page,
  Select,
  Selects,
  Status,
  StatusContainer,
  StatusResponsive,
  Title,
} from './styles';

const MyAnimals = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(false);
  const [myAnimals, setMyAnimals] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);
  const [filterIsVisible, setFilterIsVisible] = useState(false);

  const maxNumOfPages = 2;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/my/animals/list/count`, {
        params: { ...selectedFilters },
      })
      .then(response => {
        setTotalNumberOfPages(response.data.pages);
      })
      .catch(err => {
        if (err.isAxiosError) {
          if (
            err.response.data.message === 'JWT token is missing.' ||
            err.response.data.message === 'Invalid JWT token'
          )
            signOut();
        }
      });
    setLoading(false);
  }, [selectedFilters, signOut]);

  useEffect(() => {
    api
      .get('/breeds')
      .then(response => {
        setAllAnimals(response.data);
      })
      .catch(err => {
        if (err.isAxiosError) {
          if (
            err.response.data.message === 'JWT token is missing.' ||
            err.response.data.message === 'Invalid JWT token'
          )
            signOut();
        }
      });
    formRef.current.setData({
      animal: 'Todos',
      breed: 'Todos',
      port: 'Todos',
      genre: 'Todos',
    });
  }, [formRef, signOut]);

  useEffect(() => {
    setAnimalsOptions([...new Set(allAnimals.map(({ animal }) => animal))]);
  }, [allAnimals]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/my/animals/list', {
        params: { page: currentPage, ...selectedFilters },
      })
      .then(response => {
        const animalsData = response.data.map(animal => {
          if (animal.adopted_at)
            return {
              ...animal,
              status: 'Adotado',
              message: 'Este animal já foi adotado.',
            };
          if (animal.verified_at) {
            if (
              isSameDay(
                parseISO(animal.verified_at),
                new Date(0, 0, 0, 0, 0, 0).setUTCHours(0, 0, 0, 0),
              )
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
      })
      .catch(err => {
        if (err.isAxiosError) {
          if (
            err.response.data.message === 'JWT token is missing.' ||
            err.response.data.message === 'Invalid JWT token'
          )
            signOut();
        }
      });
    setLoading(false);
  }, [selectedFilters, currentPage, signOut]);

  const handleChangePage = useCallback(page => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const pages = [];
    let firstPage = currentPage - maxNumOfPages;
    let lastPage = currentPage + maxNumOfPages;

    if (firstPage <= 0) firstPage = 1;
    if (lastPage > totalNumberOfPages) lastPage = totalNumberOfPages;

    // Coloca (primeira pagina) + ...
    if (firstPage > 1) {
      pages.push(
        <Page
          id={1}
          selected={currentPage === 1}
          onClick={() => handleChangePage(1)}
        >
          1
        </Page>,
      );

      if (firstPage !== 2) pages.push(<span>...</span>);
    }

    // Cria um array com a quantidade de paginas que ira aparecer no 'footer'
    for (let i = firstPage; i <= lastPage; i++) {
      pages.push(
        <Page
          key={i}
          id={i}
          selected={i === currentPage}
          onClick={() => handleChangePage(i)}
          data-testid={`page[${i}]`}
        >
          {i}
        </Page>,
      );
    }

    // Coloca ... + (ultima pagina)
    if (lastPage < totalNumberOfPages) {
      if (lastPage + 1 !== totalNumberOfPages) pages.push(<span>...</span>);

      pages.push(
        <Page
          id={totalNumberOfPages}
          selected={totalNumberOfPages === currentPage}
          onClick={() => handleChangePage(totalNumberOfPages)}
        >
          {totalNumberOfPages}
        </Page>,
      );
    }

    setVisiblePages(pages);
  }, [currentPage, totalNumberOfPages, handleChangePage]);

  const handleFilterAnimals = useCallback(() => {
    const data = formRef.current.getData();
    const filter = {
      ...(data.name !== '' && data.name ? { name: data.name } : {}),
      ...(data.animal !== 'Todos' && data.animal
        ? { animal: data.animal }
        : {}),
      ...(data.breed !== 'Todos' && data.breed ? { breed: data.breed } : {}),
      ...(data.port !== 'Todos' && data.port ? { port: data.port } : {}),
      ...(data.genre !== 'Todos' && data.genre ? { genre: data.genre } : {}),
    };

    setSelectedFilters(filter);
  }, [formRef]);

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

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage]);

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
                data-testid="animal-select"
              />
              <Select
                name="breed"
                title="Raça"
                defaultValue="Todos"
                options={['Todos', ...breedsOptions]}
                onChange={handleFilterAnimals}
                data-testid="breed-select"
              />
              <Select
                name="port"
                title="Porte"
                defaultValue="Todos"
                options={['Todos', 'Pequeno', 'Médio', 'Grande']}
                onChange={handleFilterAnimals}
                data-testid="port-select"
              />
              <Select
                name="genre"
                title="Gênero"
                defaultValue="Todos"
                options={['Todos', 'Macho', 'Fêmea']}
                onChange={handleFilterAnimals}
                data-testid="genre-select"
              />
            </Selects>
          </Form>

          <hr />

          <Animals>
            <h1>Meus Animais</h1>
            {myAnimals.length > 0 ? (
              myAnimals.map(animal => (
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
                  </InfoRow>
                  <StatusResponsive
                    status={{
                      adopted_at: animal.adopted_at,
                      verified_at: animal.verified_at,
                    }}
                  />
                </Animal>
              ))
            ) : (
              <Message>Você ainda não cadastrou nenhum animal</Message>
            )}
          </Animals>

          <Pages>
            <ChangePageArrow
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || visiblePages.length === 0}
            >
              <RiArrowLeftSLine size={32} />
            </ChangePageArrow>
            {visiblePages}
            <ChangePageArrow
              onClick={handleNextPage}
              disabled={
                currentPage === totalNumberOfPages || visiblePages.length === 0
              }
            >
              <RiArrowRightSLine size={32} />
            </ChangePageArrow>
          </Pages>
        </Center>

        <ButtonContainer>
          <Button title="Voltar" buttonType="return" onClick={handleBackPage} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default MyAnimals;
