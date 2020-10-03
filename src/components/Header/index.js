import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@material-ui/core';
import {
  RiAddBoxFill,
  RiArrowLeftLine,
  RiBearSmileLine,
  RiSearchEyeLine,
  RiShieldUserFill,
  RiMenuLine,
  RiUserFill,
} from 'react-icons/ri';

import { useRegion } from '../../hooks/region';
import { useCategory } from '../../hooks/category';
import { useHeader } from '../../hooks/header';

import {
  Container,
  Center,
  Categories,
  Category,
  Left,
  Logo,
  Right,
  SideMenuCloseButton,
  SideMenuContainer,
  SideMenuItemContainer,
} from './styles';

const Header = () => {
  const { region } = useRegion();
  const { category, changeCategory } = useCategory();
  const { header } = useHeader();

  const [menuIsOpened, setMenuIsOpened] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuIsOpened(!menuIsOpened);
  }, [menuIsOpened]);

  const isSelected = useCallback(
    buttonCategory => category === buttonCategory,
    [category],
  );

  const handleChangeCategory = useCallback(
    buttonCategory => {
      if (buttonCategory === category) return;

      changeCategory();

      if (menuIsOpened) setMenuIsOpened(false);
    },
    [changeCategory, category, menuIsOpened],
  );

  return (
    <>
      {header ? (
        <Container>
          <Drawer
            anchor="left"
            variant="temporary"
            open={menuIsOpened}
            // open
            onClose={toggleMenu}
            ModalProps={{ onBackdropClick: toggleMenu }}
          >
            <SideMenuContainer>
              <SideMenuItemContainer>
                <SideMenuCloseButton>
                  <button onClick={toggleMenu}>
                    <RiArrowLeftLine size={30} />
                  </button>
                </SideMenuCloseButton>
              </SideMenuItemContainer>

              <SideMenuItemContainer>
                <Link
                  selected={isSelected('adopt')}
                  onClick={() => handleChangeCategory('adopt')}
                  to="/dashboard"
                >
                  <RiBearSmileLine size={23} />
                  <span>Adoção</span>
                </Link>
                <Link
                  selected={isSelected('missing')}
                  onClick={() => handleChangeCategory('missing')}
                  to="/dashboard"
                >
                  <RiSearchEyeLine size={23} />
                  <span>Desaparecidos</span>
                </Link>
              </SideMenuItemContainer>

              <SideMenuItemContainer>
                <a href="#teste">
                  <RiShieldUserFill size={30} />
                  <span>Administrador</span>
                </a>
                <a href="#teste">
                  <RiAddBoxFill size={30} />
                  <span>Adicionar novo animal</span>
                </a>
                <a href="#teste">
                  <RiUserFill size={28} />
                  <span>Perfil</span>
                </a>
              </SideMenuItemContainer>
            </SideMenuContainer>
          </Drawer>

          <Left>
            <div>
              <button onClick={toggleMenu}>
                <RiMenuLine size={36} />
              </button>
            </div>
          </Left>
          <Center>
            <Logo src={region ? region.logo : null} />
            <Categories>
              <Category
                selected={isSelected('adopt')}
                onClick={() => handleChangeCategory('adopt')}
                to="/dashboard"
              >
                Adoção
              </Category>
              <Category
                selected={isSelected('missing')}
                onClick={() => handleChangeCategory('missing')}
                to="/dashboard"
              >
                Desaparecidos
              </Category>
            </Categories>
          </Center>
          <Right>
            <RiShieldUserFill size={30} />
            <Link to="new-animal" selected={false}>
              <RiAddBoxFill size={30} />
            </Link>
            <RiUserFill size={28} />
          </Right>
        </Container>
      ) : null}
    </>
  );
};

export default Header;
