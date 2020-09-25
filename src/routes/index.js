import React from 'react';
import { Switch } from 'react-router-dom';

import Animal from '../pages/Animal';
import Dashboard from '../pages/Dashboard';
import Server from '../pages/Server';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Route from './Route';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Server} />
    <Route path="/dashboard" exact component={Dashboard} needsRegion />
    <Route path="/animal" exact component={Animal} needsRegion />
    <Route path="/login" exact component={SignIn} needsRegion header={false} />
    <Route
      path="/register"
      exact
      component={SignUp}
      needsRegion
      header={false}
    />

    {/* Caso a pessoa tente entrar em uma pagina que nao exista, ele voltara para o Dashboard */}
    <Route component={Dashboard} />
  </Switch>
);

export default Routes;
