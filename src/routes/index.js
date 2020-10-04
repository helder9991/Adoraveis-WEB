import React from 'react';
import { Switch } from 'react-router-dom';

import Animal from '../pages/Animal';
import ChangePassword from '../pages/ChangePassword';
import Dashboard from '../pages/Dashboard';
import EditProfile from '../pages/EditProfile';
import NewAnimal from '../pages/NewAnimal';
import Server from '../pages/Server';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/Profile';
import ProfileInfo from '../pages/ProfileInfo';
import ResetPassword from '../pages/ResetPassword';

import Route from './Route';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Server} />

    {/* Animal routes */}
    <Route path="/dashboard" exact component={Dashboard} needsRegion />
    <Route path="/animal" exact component={Animal} needsRegion />
    <Route
      path="/new-animal"
      exact
      component={NewAnimal}
      needsRegion
      needsLogin
    />

    {/* Profile Routes */}
    <Route path="/profile" exact component={Profile} needsLogin needsRegion />
    <Route
      path="/profile/info"
      exact
      component={ProfileInfo}
      needsLogin
      needsRegion
    />
    <Route
      path="/profile/edit"
      exact
      component={EditProfile}
      needsLogin
      needsRegion
    />
    <Route
      path="/profile/change-password"
      exact
      component={ChangePassword}
      needsLogin
      needsRegion
    />

    <Route path="/login" exact component={SignIn} needsRegion header={false} />
    <Route
      path="/register"
      exact
      component={SignUp}
      needsRegion
      header={false}
    />
    <Route
      path="/forgot"
      exact
      component={ForgotPassword}
      needsRegion
      header={false}
    />
    <Route
      path="/reset"
      exact
      component={ResetPassword}
      needsRegion
      header={false}
    />

    {/* Caso a pessoa tente entrar em uma pagina que nao exista, ele voltara para o Dashboard */}
    <Route component={Dashboard} />
  </Switch>
);

export default Routes;
