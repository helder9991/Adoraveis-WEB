import styled from 'styled-components';
import Select from 'react-select';

export const Container = styled.div`
  h1 {
    margin-left: 3px;
    color: ${props => props.theme.colors.text.secondary};
    font-size: 2rem;
    font-weight: bold;
  }
`;

export const SelectInput = styled(Select).attrs(props => ({
  styles: {
    control: provided => ({
      ...provided,
      color: props.theme.colors.input.text,
      background: props.theme.colors.input.background,
      borderRadius: 8,
      paddingTop: 2,
      paddingBottom: 2,
    }),
  },
}))`
  margin-top: 4px;
  width: 100%;
  font-size: 1.6rem;
`;
