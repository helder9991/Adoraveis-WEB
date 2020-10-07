import React from 'react';
import { RiMenuLine } from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';

import { Container, Content, Menu, Page, Title } from './styles';

const Administrator = () => {
  return (
    <Container>
      <Content>
        <Title>Página do Administrador</Title>
        <Menu>
          <Page to="/profile/info">
            <RiMenuLine size={20} />
            <span>Animais pendentes</span>
          </Page>
          <hr />

          <Page to="/profile/edit">
            <IoIosSearch size={20} />
            <span>Procurar animal</span>
          </Page>
          <hr />
        </Menu>
      </Content>
    </Container>
  );
};

export default Administrator;
