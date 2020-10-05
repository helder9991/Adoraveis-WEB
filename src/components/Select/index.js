import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useField } from '@unform/core';
import { IoMdAlert } from 'react-icons/io';

import { Container, SelectContainer, Error } from './styles';

const Select = ({
  name,
  className,
  title,
  placeholder,
  defaultValue = '',
  options = [],
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  const [value, setValue] = useState('');

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

  const handleValueOnBlur = useCallback(() => {
    inputRef.current.value = value !== '' ? value : defaultValue;
  }, [value, defaultValue]);

  return (
    <Container className={className} {...rest}>
      <h1>{title}</h1>
      <SelectContainer isErrored={!!error} onClick={handleClearInput}>
        <input
          list={name}
          placeholder={placeholder}
          ref={inputRef}
          onClick={handleClearInput}
          onChange={e => setValue(e.target.value)}
          onBlur={handleValueOnBlur}
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
