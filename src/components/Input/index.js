import React, { useCallback, useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { IoMdAlert } from 'react-icons/io';

import { Container, InputContainer, Error } from './styles';

const Input = ({
  name,
  className,
  title,
  placeholder,
  icon: Icon,
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

  const handleFocusInput = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <Container className={className} onClick={handleFocusInput}>
      <h1>{title}</h1>
      <InputContainer isErrored={!!error}>
        {Icon && <Icon size={20} />}
        <input placeholder={placeholder} ref={inputRef} {...rest} />
        {error && (
          <Error title={error}>
            <IoMdAlert size={20} />
          </Error>
        )}
      </InputContainer>
    </Container>
  );
};

export default Input;
