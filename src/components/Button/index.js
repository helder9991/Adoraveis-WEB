import React from 'react';

import { Container } from './styles';

const Button = ({ className, title, buttonType = 'next', ...rest }) => {
  return (
    <Container className={className} buttonType={buttonType} {...rest}>
      {title}
    </Container>
  );
};

export default Button;
