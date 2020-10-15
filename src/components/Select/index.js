import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { IoMdAlert } from 'react-icons/io';

import { Container, SelectContainer, Error } from './styles';

const Select = ({
  name,
  className,
  title,
  placeholder,
  options = [],
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container className={className}>
      <h1>{title}</h1>
      <SelectContainer isErrored={!!error}>
        <select name={name} placeholder={placeholder} ref={inputRef} {...rest}>
          <option key="hidden" selected disabled hidden>
            {placeholder}
          </option>
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {error && (
          <Error title={error}>
            <IoMdAlert size={20} />
          </Error>
        )}
      </SelectContainer>
    </Container>
  );
};

export default Select;
