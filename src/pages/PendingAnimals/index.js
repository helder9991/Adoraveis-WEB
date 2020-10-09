import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';

import { useRegion } from '../../hooks/region';

import {
  Animals,
  Animal,
  Container,
  Content,
  Info,
  Message,
  Title,
} from './styles';

const PendingAnimals = () => {
  const { region } = useRegion();

  const [loading, setLoading] = useState(false);
  const [pendingAnimals, setPendingAnimals] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/${region.url_param}/admin/animal/verify`).then(response => {
      setPendingAnimals(response.data);
    });
    setLoading(false);
  }, [region.url_param]);

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
      </Content>
    </Container>
  );
};

export default PendingAnimals;
