import React from 'react';
import { Route as ReactDOMRoute, Redirect } from 'react-router-dom';

import { useRegion } from '../hooks/region';

const Route = ({ isPrivate = false, component: Component, ...rest }) => {
  const { region } = useRegion();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!region ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
