import React from 'react';
import { Switch } from 'react-router-dom';

import Server from '../pages/Server';
import Dashboard from '../pages/Dashboard';
import Animal from '../pages/Animal';

import Route from './Route';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Server} />
    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route path="/animal" exact component={Animal} isPrivate />
  </Switch>
);

export default Routes;
