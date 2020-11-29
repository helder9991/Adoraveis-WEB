import React from 'react';
import { Switch } from 'react-router-dom';

import Administrator from '../pages/Administrator';
import Animal from '../pages/Animal';
import ChangePassword from '../pages/ChangePassword';
import Dashboard from '../pages/Dashboard';
import EditProfile from '../pages/EditProfile';
import EditAnimal from '../pages/EditAnimal';
import MyAnimals from '../pages/MyAnimals';
import NewAnimal from '../pages/NewAnimal';
import Server from '../pages/Server';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import PendingAnimals from '../pages/PendingAnimals';
import Profile from '../pages/Profile';
import ProfileInfo from '../pages/ProfileInfo';
import ResetPassword from '../pages/ResetPassword';
import SearchAnimal from '../pages/SearchAnimal';

import Route from './Route';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Server} />

    {/* Animal routes */}
    <Route path="/dashboard" exact component={Dashboard} needsRegion />
    <Route path="/animal/:id" exact component={Animal} needsRegion />
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
    <Route
      path="/profile/my-animals"
      exact
      component={MyAnimals}
      needsLogin
      needsRegion
    />
    <Route
      path="/profile/my-animals/:id"
      exact
      component={EditAnimal}
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

    {/* Administrador Routes */}
    <Route
      path="/administrator"
      exact
      component={Administrator}
      ensureAdmin
      needsLogin
      needsRegion
    />
    <Route
      path="/administrator/pending-animals"
      exact
      component={PendingAnimals}
      ensureAdmin
      needsLogin
      needsRegion
    />
    <Route
      path="/administrator/search-animal"
      exact
      component={SearchAnimal}
      ensureAdmin
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
    <Route component={Dashboard} needsRegion />
  </Switch>
);

export default Routes;
