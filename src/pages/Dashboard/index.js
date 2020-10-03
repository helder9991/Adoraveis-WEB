import React, { useState, useEffect, useCallback } from 'react';
import {
  RiFilterFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
} from 'react-icons/ri';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useCategory } from '../../hooks/category';
import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import {
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
  ChangePageArrow,
} from './styles';

const Dashboard = () => {
  const { category } = useCategory();
  const { region } = useRegion();

  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterIsVisible, setFilterIsVisible] = useState(false);

  const [animalFilter, setAnimalFilter] = useState('Todos');
  const [breedFilter, setBreedFilter] = useState('Todos');
  const [portFilter, setPortFilter] = useState('Todos');
  const [genreFilter, setGenreFilter] = useState('Todos');

  const maxNumOfPages = 2;

  useEffect(() => {
    setLoading(true);
    api.get(`/${region.url_param}/animals/list/${category}`).then(response => {
      setAnimals(response.data);
    });

    api.get(`/${region.url_param}/animals/count`).then(response => {
      setTotalNumberOfPages(response.data.pages);
    });
    setLoading(false);
  }, [category, region]);

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
          id={i}
          selected={i === currentPage}
          onClick={() => handleChangePage(i)}
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

          {/* <Selects visible={filterIsVisible}>
            <Select
              title="Animal"
              defaultValue={animalFilter}
              placeholder="Selecione"
              setOption={setAnimalFilter}
              options={['name']}
            />
            <Select
              title="Raça"
              defaultValue={breedFilter}
              placeholder="Selecione"
              setOption={setBreedFilter}
              options={['name']}
            />
            <Select
              title="Porte"
              defaultValue={portFilter}
              placeholder="Selecione"
              setOption={setPortFilter}
              options={['name']}
            />
            <Select
              title="Gênero"
              defaultValue={genreFilter}
              placeholder="Selecione"
              setOption={setGenreFilter}
              options={['name']}
            />
          </Selects> */}
        </Filters>

        <hr />
        {false && (
          <Message>
            <CircularProgress />
          </Message>
        )}
        {animals.length === 0 ? (
          <Message>Não há nenhum animal disponível no momento. </Message>
        ) : (
          <>
            <Animals>
              {animals.map(animal => (
                <Animal
                  to={{ pathname: '/animal', state: { id: animal.id } }}
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
