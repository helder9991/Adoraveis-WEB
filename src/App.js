import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from './components/Header';

import AppProvider from './hooks';

import Routes from './routes';

import GlobalStyle from './styles/global';
import 'react-toastify/dist/ReactToastify.css';

import light from './styles/themes/light';

toast.configure({
  style: {
    fontSize: 15,
  },
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

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
