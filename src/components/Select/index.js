import React, { useEffect, useRef, useCallback } from 'react';
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

  const handleClearInput = useCallback(() => {
    inputRef.current.value = '';
  }, []);

  return (
    <Container className={className} {...rest}>
      <h1>{title}</h1>
      <SelectContainer isErrored={!!error}>
        <input
          list={name}
          placeholder={placeholder}
          ref={inputRef}
          onClick={handleClearInput}
        />
        {error && (
          <Error title={error}>
            <IoMdAlert size={20} />
          </Error>
        )}
        <datalist id={name}>
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </datalist>
      </SelectContainer>
    </Container>
  );
};

export default Select;
