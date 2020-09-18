import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';

import AppProvider from './hooks';

import Routes from './routes';

import GlobalStyle from './styles/global';
import light from './styles/themes/light';

const App = () => (
  <>
    <ThemeProvider theme={light}>
      <GlobalStyle />
      <AppProvider>
        <Router>
          <Header />
          <Routes />
        </Router>
      </AppProvider>
    </ThemeProvider>
  </>
);

export default App;
