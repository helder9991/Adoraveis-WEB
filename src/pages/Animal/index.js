import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Carousel from '../../components/Carousel';

import { useRegion } from '../../hooks/region';
import api from '../../services/api';

import {
  Container,
  Content,
  Title,
  AnimalData,
  Info,
  CarouselContainer,
  Description,
  Card,
  Buttons,
  Button,
} from './styles';

const Animal = () => {
  const { region } = useRegion();
  const location = useLocation();
  const history = useHistory();

  const [animal, setAnimal] = useState([]);

  useEffect(() => {
    api
      .get(`/${region.url_param}/animals/${location.state.id}`)
      .then(response => {
        setAnimal(response.data);
      });
  }, [location.state, region]);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Content>
        <Title>Dados do Animal</Title>
        <Info>
          {animal.length !== 0 ? (
            <>
              <AnimalData>
                <CarouselContainer>
                  <Carousel photos={animal.photos} />
                </CarouselContainer>
                <Description>
                  <Card>
                    <h1>Nome</h1>
                    <span>{animal.name}</span>
                  </Card>
                  <Card>
                    <h1>Animal</h1>
                    <span>{animal.breed.animal}</span>
                  </Card>
                  <Card>
                    <h1>Raca</h1>
                    <span>{animal.breed.breed}</span>
                  </Card>
                  <Card>
                    <h1>Porte</h1>
                    <span>{animal.port}</span>
                  </Card>
                  <Card>
                    <h1>Sexo</h1>
                    <span>{animal.genre}</span>
                  </Card>
                  <Card>
                    <h1>Idade</h1>
                    <span>{animal.years_old}</span>
                  </Card>
                  <Card>
                    <h1>Pedigree</h1>
                    <span>{animal.pedigree}</span>
                  </Card>
                  <Card>
                    <h1>Castrado</h1>
                    <span>{animal.castrated}</span>
                  </Card>
                </Description>
              </AnimalData>

              <Buttons>
                <Button title="Entrar em contato" />
                <Button
                  title="Voltar"
                  buttonType="return"
                  onClick={handleBackPage}
                />
              </Buttons>
            </>
          ) : (
            <div />
          )}
        </Info>
      </Content>
    </Container>
  );
};

export default Animal;
