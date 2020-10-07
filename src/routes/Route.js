import React, { useEffect } from 'react';
import {
  Route as ReactDOMRoute,
  Redirect,
  useLocation,
} from 'react-router-dom';

import { useRegion } from '../hooks/region';
import { useHeader } from '../hooks/header';
import { useAuth } from '../hooks/auth';

const Route = ({
  ensureAdmin = false,
  needsRegion = false,
  needsLogin = false,
  component: Component,
  header = true,
  ...rest
}) => {
  const { pathname } = useLocation();
  const { region } = useRegion();
  const { changeHeader } = useHeader();
  const { user } = useAuth();

  useEffect(() => {
    changeHeader(header);
  }, [header, changeHeader]);

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        // Tentar acessar a pagina de login/cadastro estando logado
        if (
          (location.pathname === '/login' ||
            location.pathname === '/register' ||
            location.pathname === '/reset' ||
            location.pathname === '/forgot') &&
          user.name
        )
          return <Redirect to="/dashboard" />;

        // tentar acessar uma pagina que precisa estar logado como admin
        if (ensureAdmin && user && user.url_param !== region.url_param) {
          return <Redirect to="/dashboard" />;
        }

        // tentar acessar uma pagina que precisa de login
        if (location.pathname !== '/login' && needsLogin && !user.name) {
          return (
            <Redirect
              push
              to={{ pathname: '/login', state: { from: pathname } }}
            />
          );
        }

        // tentar acessar uma pagina que precisa de uma regiao
        return needsRegion === !!region ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: needsRegion ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
