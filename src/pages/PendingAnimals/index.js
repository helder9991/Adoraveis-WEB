import React, { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useRegion } from '../../hooks/region';

import {
  Animals,
  Animal,
  Container,
  Content,
  ChangePageArrow,
  Info,
  Message,
  Title,
  Page,
  Pages,
} from './styles';

const PendingAnimals = () => {
  const { region } = useRegion();
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pendingAnimals, setPendingAnimals] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const maxNumOfPages = 2;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/${region.url_param}/admin/animal/verify/count`)
      .then(response => {
        setTotalNumberOfPages(response.data.pages);
      })
      .catch(err => {
        if (err.isAxiosError) {
          console.log(err);
          if (
            err.response.data.message === 'JWT token is missing.' ||
            err.response.data.message === 'Invalid JWT token'
          )
            signOut();
        }
      });
    setLoading(false);
  }, [region.url_param, signOut]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/${region.url_param}/admin/animal/verify`, {
        params: { page: currentPage },
      })
      .then(response => {
        setPendingAnimals(response.data);
      });
    setLoading(false);
  }, [region.url_param, currentPage]);

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
        <Title>Animais pendentes</Title>

        {loading && pendingAnimals.length === 0 && (
          <Message>
            <CircularProgress />
          </Message>
        )}

        <Animals>
          {pendingAnimals.length > 0 ? (
            pendingAnimals.map(animal => (
              <Animal
                key={animal.id}
                to={{
                  pathname: `/profile/my-animals/${animal.id}`,
                  state: {
                    admin: true,
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
                <Info>
                  <span>Categoria</span>
                  <span>{animal.category}</span>
                </Info>
              </Animal>
            ))
          ) : (
            <Message>Não há animais pendentes para serem aceitos</Message>
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
      </Content>
    </Container>
  );
};

export default PendingAnimals;
