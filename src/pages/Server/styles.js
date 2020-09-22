import styled from 'styled-components';

import SelectInput from '../../components/Select';
import ButtonInput from '../../components/Button';

export const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 100vh;
  background: ${props => props.theme.colors.primary};
`;

export const Logo = styled.div`
  background: #fff;
  margin-bottom: 35px;
  height: 15vh;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 65vh;
  margin-bottom: 60px;

  max-width: 500px;
  min-width: 300px;
  width: 100vw;

  form {
    width: 100%;

    button {
      margin-top: 25px;
    }
  }

  @media (max-width: 600px) {
    max-width: 460px;
  }

  @media (max-width: 500px) {
    max-width: 80vw;
  }
`;

export const Select = styled(SelectInput)`
  margin-top: 20px;
`;

export const Button = styled(ButtonInput)`
  width: 60%;
`;
