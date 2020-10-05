import React, { useState, useCallback, useEffect } from 'react';
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

import { useAuth } from '../../hooks/auth';
import { useCategory } from '../../hooks/category';
import { useHeader } from '../../hooks/header';
import { useRegion } from '../../hooks/region';

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
  const { user } = useAuth();
  const { category, changeCategory } = useCategory();
  const { header } = useHeader();
  const { region } = useRegion();

  const [menuIsOpened, setMenuIsOpened] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuIsOpened(!menuIsOpened);
  }, [menuIsOpened]);

  const isSelected = useCallback(page => category === page, [category]);

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
                <Link to="/new-animal">
                  <RiAddBoxFill size={30} />
                  <span>Adicionar novo animal</span>
                </Link>
                <Link to="/profile">
                  <RiUserFill size={28} />
                  <span>Perfil</span>
                </Link>
              </SideMenuItemContainer>
            </SideMenuContainer>
          </Drawer>

          <Left>
            <div>
              <button onClick={toggleMenu}>
                <RiMenuLine size={32} />
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
            {user && user.url_param === region.url_param && (
              <Link to="new-animal">
                <RiShieldUserFill size={30} />
              </Link>
            )}
            <Link to="/new-animal">
              <RiAddBoxFill size={30} />
            </Link>
            <Link to="/profile">
              <RiUserFill size={28} />
            </Link>
          </Right>
        </Container>
      ) : null}
    </>
  );
};

export default Header;
