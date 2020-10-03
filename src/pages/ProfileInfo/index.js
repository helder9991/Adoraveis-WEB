import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';

import {
  Button,
  ButtonContainer,
  Container,
  Content,
  Info,
  Title,
} from './styles';

const ProfileInfo = () => {
  const history = useHistory();

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api.get('/my/user').then(response => {
      setUser(response.data);
    });

    setLoading(false);
  }, []);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Content>
        <Title>Informações do Perfil</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <Info>
            <div>
              <span>Nome</span>
              <span>{user.name}</span>
            </div>
            <div>
              <span>E-mail</span>
              <span>{user.email}</span>
            </div>
            <div>
              <span>Telefone</span>
              <span>{user.phone}</span>
            </div>
          </Info>
        )}

        <ButtonContainer>
          <Button title="Voltar" buttonType="return" onClick={handleBackPage} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default ProfileInfo;
