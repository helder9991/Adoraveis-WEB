import React, { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from './components/Header';
import AppProvider from './hooks';
import Routes from './routes';
import usePersistedState from './hooks/persistedState';

import GlobalStyle from './styles/global';
import 'react-toastify/dist/ReactToastify.css';

import light from './styles/themes/light';
import dark from './styles/themes/dark';

toast.configure({
  style: {
    fontSize: 15,
  },
  position: 'top-right',
  autoClose: 8000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

const App = () => {
  const [theme, setTheme] = usePersistedState('@Adoraveis:theme', light);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? dark.title : light.title);
  }, [theme, setTheme]);

  return (
    <>
      <ThemeProvider theme={theme === 'dark' ? dark : light}>
        <GlobalStyle />
        <AppProvider>
          <Router>
            <Header toggleTheme={toggleTheme} />
            <Routes />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
