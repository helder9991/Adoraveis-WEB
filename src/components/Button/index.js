import React from 'react';

import { Container } from './styles';

const Button = ({ title, buttonType = 'next', ...rest }) => {
  return (
    <Container buttonType={buttonType} {...rest}>
      {title}
    </Container>
  );
};

export default Button;
