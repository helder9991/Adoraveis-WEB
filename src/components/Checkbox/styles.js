import styled from 'styled-components';

export const Container = styled.div`
  margin: 20px 0 0 10px;

  label {
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
      color: ${props => props.theme.colors.text.secondary};
      font-size: 1.8rem;
      font-weight: 500;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
    }
  }
`;
