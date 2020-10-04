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
        if (
          (location.pathname === '/login' ||
            location.pathname === '/register' ||
            location.pathname === '/reset' ||
            location.pathname === '/forgot') &&
          user.name
        )
          return <Redirect to="/dashboard" />;

        if (location.pathname !== '/login' && needsLogin && !user.name)
          return (
            <Redirect
              push
              to={{ pathname: '/login', state: { from: pathname } }}
            />
          );

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
