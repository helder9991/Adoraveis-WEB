import React, { useCallback } from 'react';
import {
  RiUserFill,
  RiPencilFill,
  RiLock2Fill,
  RiMenuLine,
} from 'react-icons/ri';

import { useAuth } from '../../hooks/auth';

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

  const handleSignOut = useCallback(() => {
    if (window.confirm('Deseja realmente sair de sua conta?')) {
      signOut();
    }
  }, [signOut]);

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

          <Page>
            <RiLock2Fill size={20} />
            <span>Alterar senha</span>
          </Page>
          <hr />

          <Page>
            <RiMenuLine size={20} />
            <span>Meus animais cadastrados</span>
          </Page>
          <hr />
        </Menu>
        <ButtonContainer>
          <Button title="Sair" buttonType="danger" onClick={handleSignOut} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Profile;
