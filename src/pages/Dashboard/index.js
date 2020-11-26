import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RiFilterFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
} from 'react-icons/ri';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form } from '@unform/web';

import { toast } from 'react-toastify';
import { useCategory } from '../../hooks/category';
import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import {
  ChangePageArrow,
  Container,
  Content,
  Title,
  Filters,
  FilterTitle,
  Selects,
  Select,
  Message,
  Animals,
  Animal,
  Description,
  Info,
  Pages,
  Page,
} from './styles';

const Dashboard = () => {
  const { category } = useCategory();
  const { region } = useRegion();
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterIsVisible, setFilterIsVisible] = useState(false);

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);

  const maxNumOfPages = 2;

  useEffect(() => {
    setLoading(true);
    // verificar se isto esta certo
    api
      .get(`/${region.url_param}/animals/list/${category}`)
      .then(response => {
        setAnimals(response.data);
      })
      .catch(() => {});

    api
      .get(`/${region.url_param}/animals/${category}/count`)
      .then(response => {
        setTotalNumberOfPages(response.data.pages);
      })
      .catch(() => {});
    setLoading(false);
  }, [category, region.url_param]);

  useEffect(() => {
    setAnimals([]);
    setLoading(true);

    api
      .get(`/${region.url_param}/animals/list/${category}`, {
        params: { page: currentPage },
      })
      .then(response => {
        setAnimals(response.data);
      })
      .catch(() => {});

    setLoading(false);
  }, [category, currentPage, region.url_param]);

  // Busca na api as racas cadastradas
  useEffect(() => {
    api
      .get('/breeds')
      .then(response => {
        setAllAnimals(response.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setAnimalsOptions([...new Set(allAnimals.map(({ animal }) => animal))]);
  }, [allAnimals]);

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

  const handleChangeFiltersVisibility = useCallback(() => {
    setFilterIsVisible(!filterIsVisible);
  }, [filterIsVisible]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage]);

  const handleShowBreed = useCallback(() => {
    const selectedAnimal = formRef.current.getFieldValue('animal');

    const breedOptions = allAnimals
      .filter(({ animal }) => animal === selectedAnimal)
      .map(({ breed }) => breed);

    setBreedsOptions(breedOptions);
  }, [allAnimals]);

  const handleFilter = useCallback(
    async data => {
      const filtratedAnimals = await api.get(
        `/${region.url_param}/animals/list/${category}`,
        {
          params: {
            ...(data.animal === 'Todos' ? {} : { animal: data.animal }),
            ...(data.breed === 'Todos' ? {} : { breed: data.breed }),
            ...(data.port === 'Todos' ? {} : { port: data.port }),
            ...(data.genre === 'Todos' ? {} : { genre: data.genre }),
          },
        },
      );

      if (!filtratedAnimals)
        return toast.error('Aconteceu algum erro, por favor, tente novamente');

      setAnimals(filtratedAnimals.data);

      const totalPages = await api.get(
        `/${region.url_param}/animals/${category}/count`,
        {
          params: {
            ...(data.animal === 'Todos' ? {} : { animal: data.animal }),
            ...(data.breed === 'Todos' ? {} : { breed: data.breed }),
            ...(data.port === 'Todos' ? {} : { port: data.port }),
            ...(data.genre === 'Todos' ? {} : { genre: data.genre }),
          },
        },
      );

      if (!totalPages)
        return toast.error('Aconteceu algum erro, por favor, tente novamente');
      setTotalNumberOfPages(totalPages.data.pages);

      setCurrentPage(1);
    },
    [region.url_param, category],
  );

  return (
    <Container>
      <Content>
        <Title>
          Animais
          {category === 'adopt' ? ' para adoção' : ' desaparecidos'}
        </Title>

        <Filters>
          <FilterTitle onClick={handleChangeFiltersVisibility}>
            <div>
              <h1>Filtros</h1>
              <RiFilterFill size={22} />
            </div>
            <div>
              <RiArrowDownSLine size={32} />
            </div>
          </FilterTitle>

          <Selects visible={filterIsVisible}>
            <Form onSubmit={handleFilter} ref={formRef}>
              <Select
                name="animal"
                title="Animal"
                placeholder="Todos"
                options={['Todos', ...animalsOptions]}
                onChange={handleShowBreed}
              />
              <Select
                name="breed"
                title="Raça"
                placeholder="Todos"
                options={['Todos', ...breedsOptions]}
              />
              <Select
                name="port"
                title="Porte"
                placeholder="Todos"
                options={['Todos', 'Pequeno', 'Médio', 'Grande']}
              />
              <Select
                name="genre"
                title="Gênero"
                placeholder="Todos"
                options={['Todos', 'Macho', 'Fêmea']}
              />
              <button>Filtrar</button>
            </Form>
          </Selects>
        </Filters>

        <hr />
        {loading && (
          <Message>
            <CircularProgress />
          </Message>
        )}
        {animals.length === 0 ? (
          <Message>Não há nenhum animal disponível no momento.</Message>
        ) : (
          <>
            <Animals>
              {animals.map(animal => (
                <Animal
                  to={{ pathname: `/animal/${animal.id}` }}
                  key={animal.id}
                >
                  <div>
                    <img src={animal.photo} alt={animal.name} />
                  </div>
                  <Description>
                    <h1>{animal.name}</h1>
                    <Info>
                      <div>
                        <span>Porte</span>
                        <span>{animal.port}</span>
                      </div>
                      <div>
                        <span>Raça</span>
                        <span>{animal.breed.breed}</span>
                      </div>
                    </Info>
                  </Description>
                </Animal>
              ))}
            </Animals>

            <hr />

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
          </>
        )}
      </Content>
    </Container>
  );
};

export default Dashboard;
