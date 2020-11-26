import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form } from '@unform/web';
import { IoIosSearch } from 'react-icons/io';
import {
  RiFilterFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
} from 'react-icons/ri';

import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/auth';
import { useRegion } from '../../hooks/region';

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
  SearchButton,
  Select,
  Selects,
  Title,
  Pages,
  Page,
} from './styles';

const ProfileInfo = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { region } = useRegion();
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);
  const [filterIsVisible, setFilterIsVisible] = useState(false);

  const maxNumOfPages = 2;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/${region.url_param}/animals/all/count`, {
        params: {
          ...selectedFilters,
        },
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
  }, [region.url_param, currentPage, selectedFilters, signOut]);

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
    try {
      api
        .get(`/${region.url_param}/animals/list/all`, {
          params: {
            page: currentPage,
            ...selectedFilters,
          },
        })
        .then(response => {
          setAnimals(response.data);
          toast.info('A busca foi realizada com sucesso.');
        });
    } catch (err) {
      if (err.isAxiosError) {
        if (
          err.response.data.message === 'JWT token is missing.' ||
          err.response.data.message === 'Invalid JWT token'
        )
          signOut();
      }
      toast.error('Algo de errado aconteceu durante a busca.');
    }
    setLoading(false);
  }, [currentPage, region.url_param, selectedFilters, signOut]);

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

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage]);

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
          <Form onSubmit={handleFilterAnimals} ref={formRef}>
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
          <Pages>
            <ChangePageArrow
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <RiArrowLeftSLine size={32} />
            </ChangePageArrow>
            {visiblePages}
            <ChangePageArrow
              onClick={handleNextPage}
              disabled={currentPage === totalNumberOfPages}
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

export default ProfileInfo;
