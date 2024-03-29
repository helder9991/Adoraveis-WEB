import React, { useCallback, useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { IoMdAlert, IoMdAdd } from 'react-icons/io';

import { Container, InputContainer, Error, FileContainer } from './styles';

const Input = ({
  name,
  className,
  title,
  placeholder,
  type,
  disabled = false,
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

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

  const handleMaskInput = useCallback(() => {
    if (inputRef && type === 'phone') {
      let mask = inputRef.current.value;

      // Verifica se o usuario deu autocomplete
      if (
        Number.isInteger(parseInt(mask, 10)) &&
        (mask.length === 10 || mask.length === 11)
      ) {
        if (mask.length === 10) {
          inputRef.current.value = `(${mask.substring(0, 2)})${mask.substring(
            2,
            6,
          )}-${mask.substring(6, 10)}`;
        } else if (mask.length === 11) {
          inputRef.current.value = `(${mask.substring(0, 2)})${mask.substring(
            2,
            7,
          )}-${mask.substring(7, 11)}`;
        }
        return;
      }

      // Nao permite digitar letras ou simbolos ou mais de 14 numeros
      if (
        !Number.isInteger(Number.parseInt(mask[mask.length - 1], 10)) ||
        mask.length >= 15
      ) {
        inputRef.current.value = mask.slice(0, mask.length - 1);
        return;
      }

      switch (mask.length) {
        case 1: // Adiciona o '('
          inputRef.current.value = String().concat('(', mask);
          break;

        case 4: // Adiciona o ')'
          inputRef.current.value = String().concat(
            mask.slice(0, mask.length - 1),
            ')',
            mask[mask.length - 1],
          );
          break;

        case 9: // Adiciona o '-'
          inputRef.current.value = String().concat(
            mask.substring(0, 8),
            '-',
            mask.substring(9, mask.length - 1),
          );
          break;

        case 14: // Caso o numero do telefone tenha 14 digitos
          inputRef.current.value = String().concat(
            mask.substring(0, 10).replace('-', ''),
            '-',
            mask.substring(10, mask.length),
          );
          break;

        default:
          // Caso o numero do telefone va de 14 digitos para 13 digitos
          if (mask.length > 9 && mask.length < 14 && mask[9] === '-') {
            mask = mask.replace('-', '');
            inputRef.current.value = String().concat(
              mask.substring(0, 8),
              '-',
              mask.substring(8, mask.length),
            );
          }
      }
    } else if (inputRef && type === 'date') {
      const mask = inputRef.current.value;
      // Nao permite digitar letras ou simbolos ou mais de 11 digitos
      if (
        !Number.isInteger(Number.parseInt(mask[mask.length - 1], 10)) ||
        mask.length >= 11
      ) {
        inputRef.current.value = mask.slice(0, mask.length - 1);
        return;
      }

      if (mask.length === 2 || mask.length === 5) {
        inputRef.current.value = mask.concat('/');
      }
    }

    return [handleMaskInput];
  }, [inputRef, type]);

  return (
    <Container className={className} onClick={handleFocusInput}>
      {title && <h1>{title}</h1>}
      <InputContainer isErrored={!!error} disabled={disabled} inputType={type}>
        <label htmlFor={fieldName}>
          {/* Caso seja um input de file */}

          {Icon && <Icon data-testid="input-icon" size={24} />}

          {type === 'file' && (
            <FileContainer>
              <span>
                {disabled
                  ? 'Limite de fotos atingido'
                  : 'Adicionar uma nova foto'}
              </span>
              {IoMdAdd && <IoMdAdd size={32} />}
            </FileContainer>
          )}

          <input
            type={type === 'date' ? 'text' : type}
            placeholder={placeholder}
            onChange={handleMaskInput}
            ref={inputRef}
            id={fieldName}
            disabled={disabled}
            defaultValue={defaultValue}
            {...rest}
          />

          {error && type !== 'file' && (
            <Error title={error}>
              <IoMdAlert size={20} />
            </Error>
          )}
        </label>
      </InputContainer>
    </Container>
  );
};

export default Input;
