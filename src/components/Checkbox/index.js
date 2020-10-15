import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

const Checkbox = ({ name, className, text, ...rest }) => {
  const checkboxRef = useRef(null);
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: checkboxRef.current,
      path: 'checked',
    });
  }, [fieldName, registerField]);

  return (
    <Container className={className}>
      <label htmlFor={name}>
        <input id={name} ref={checkboxRef} type="checkbox" {...rest} />
        <span>{text}</span>
      </label>
    </Container>
  );
};

export default Checkbox;
