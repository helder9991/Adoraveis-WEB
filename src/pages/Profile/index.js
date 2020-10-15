import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  RiUserFill,
  RiPencilFill,
  RiLock2Fill,
  RiMenuLine,
} from 'react-icons/ri';

import { useAuth } from '../../hooks/auth';
import { useRegion } from '../../hooks/region';

import {
  Button,
  ButtonContainer,
  Container,
  Content,
  Menu,
  Page,
  Title,
} from './styles';

const Profile = () => {
  const { signOut } = useAuth();
  const { removeRegion } = useRegion();
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    if (window.confirm('Deseja realmente sair de sua conta?')) {
      signOut();
    }
  }, [signOut]);

  const handleChangeRegion = useCallback(() => {
    if (window.confirm('Deseja realmente mudar de  região?')) {
      removeRegion();
      history.go(0);
    }
  }, [removeRegion, history]);

  return (
    <Container>
      <Content>
        <Title>Perfil</Title>
        <Menu>
          <Page to="/profile/info">
            <RiUserFill size={20} />
            <span>Ver informações do perfil</span>
          </Page>
          <hr />

          <Page to="/profile/edit">
            <RiPencilFill size={20} />
            <span>Editar perfil</span>
          </Page>
          <hr />

          <Page to="/profile/change-password">
            <RiLock2Fill size={20} />
            <span>Alterar senha</span>
          </Page>
          <hr />

          <Page to="/profile/my-animals">
            <RiMenuLine size={20} />
            <span>Meus animais cadastrados</span>
          </Page>
          <hr />
        </Menu>
        <ButtonContainer>
          <Button
            title="Alterar região"
            buttonType="return"
            onClick={handleChangeRegion}
            data-testid="change-region-button"
          />
          <Button
            title="Sair"
            buttonType="danger"
            onClick={handleSignOut}
            data-testid="logout-button"
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Profile;
