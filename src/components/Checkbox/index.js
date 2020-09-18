import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

const Checkbox = ({ name, text }) => {
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
    <Container>
      <label htmlFor="save">
        <input id="save" ref={checkboxRef} type="checkbox" />
        <span>{text}</span>
      </label>
    </Container>
  );
};

export default Checkbox;
