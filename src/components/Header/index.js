import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Drawer } from '@material-ui/core';
import {
  RiAddBoxFill,
  RiArrowLeftLine,
  RiBearSmileLine,
  RiMenuLine,
  RiSearchEyeLine,
  RiShieldUserFill,
  RiSunFill,
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
  Region,
  Right,
  SideMenuCloseButton,
  SideMenuContainer,
  SideMenuItemContainer,
} from './styles';

const Header = ({ toggleTheme }) => {
  const { user } = useAuth();
  const { category, changeCategory } = useCategory();
  const { header } = useHeader();
  const history = useHistory();
  const { region, removeRegion } = useRegion();

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

  const handleChangeRegion = useCallback(() => {
    if (window.confirm('Deseja realmente alterar de região?')) {
      removeRegion();
      history.go(0);
    }
  }, [removeRegion, history]);

  return (
    <>
      {header ? (
        <Container data-testid="header-container">
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
                {Object.prototype.hasOwnProperty.call(user, 'url_param') &&
                  !!region &&
                  user.url_param === region.url_param && (
                    <a href="/administrator">
                      <RiShieldUserFill size={30} />
                      <span>Administrador</span>
                    </a>
                  )}
                <button onClick={toggleTheme}>
                  <RiSunFill size={28} />
                  <span>Alterar tema</span>
                </button>
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
              <button onClick={toggleMenu} data-testid="toggleMenu-button">
                <RiMenuLine size={32} />
              </button>
            </div>
          </Left>
          <Center>
            <Region>
              <Logo src={region ? region.logo : null} />
              <button onClick={handleChangeRegion}>Alterar</button>
            </Region>

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
            {Object.prototype.hasOwnProperty.call(user, 'url_param') &&
              !!region &&
              user.url_param === region.url_param && (
                <Link to="/administrator">
                  <RiShieldUserFill size={30} />
                </Link>
              )}
            <button onClick={toggleTheme}>
              <RiSunFill size={28} />
            </button>
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
