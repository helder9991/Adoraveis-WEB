import React, { useEffect, useState } from 'react';

import { Container, SelectInput } from './styles';

const Select = ({ title, placeholder, options, setOption, ...rest }) => {
  const [optionsList, setOptionsList] = useState({});

  useEffect(() => {
    const optionsArray = options.map(value => ({
      value,
      label: value,
    }));

    setOptionsList(optionsArray);
  }, [options]);

  return (
    <Container {...rest}>
      <h1>{title}</h1>
      <SelectInput
        placeholder={placeholder}
        options={optionsList}
        defaultInputValue=""
        onChange={({ value }) => setOption(value)}
      />
    </Container>
  );
};

export default Select;
