import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  html {
    display:flex;
    height: 100%;
    font-size: 65%;
    background: ${props => props.theme.colors.background};
    overflow-y: scroll;

    @media(max-width: 1440px) {
      font-size: 64.5%;
    }

    @media(max-width: 1200px) {
      font-size: 62.5%;
    }

    @media(max-width: 600px) {
      font-size: 55.5%;
    }
  }

  body {
    -webkit-font-smoothing: antialiased;
    flex: 1;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  body, input, button, select {
    font-family: 'Roboto', serif;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
    border: 0;
  }

  svg {
    color: ${props => props.theme.colors.text.primary};
  }
`;
