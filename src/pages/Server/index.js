import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// import Select from '../../components/Select';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';

import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import { Container, Logo, Content, Select } from './styles';

const Server = () => {
  const formRef = useRef(null);
  const { setRegion, saveRegion, removeRegion } = useRegion();

  const [servers, setServers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState('');

  useEffect(() => {
    api.get('/servers').then(({ data }) => {
      setServers(data);

      const statesArray = [];
      data.forEach(server => {
        if (!statesArray.includes(server.state)) statesArray.push(server.state);
      });

      setStates(statesArray);
    });
  }, []);

  useEffect(() => {
    setSelectedCity('');
    setSelectedInstitute('');

    const citiesArray = [];
    servers.forEach(server => {
      if (!citiesArray.includes(server.city) && server.state === selectedState)
        citiesArray.push(server.city);
    });
    setCities(citiesArray);
  }, [selectedState, servers]);

  useEffect(() => {
    setSelectedInstitute('');

    const intitutesArray = [];
    servers.forEach(server => {
      if (
        !intitutesArray.includes(server.institute) &&
        server.city === selectedCity
      )
        intitutesArray.push(server.institute);
    });
    setInstitutes(intitutesArray);
  }, [selectedCity, servers]);

  const handleSubmit = useCallback(
    async data => {
      data = {
        state: selectedState,
        city: selectedCity,
        institute: selectedInstitute,
        ...data,
      };

      try {
        const schema = Yup.object().shape({
          state: Yup.string().required('É necessario selecionar o estado'),
          city: Yup.string().required('É necessario selecionar a cidade'),
          institute: Yup.string().required('É necessario selecionar a ONG'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const [selectedServer] = servers.filter(
          server =>
            server.state === selectedState &&
            server.city === selectedCity &&
            server.institute === selectedInstitute,
        );

        // passou na validacao
        if (data.save) saveRegion(selectedServer);
        else removeRegion();

        setRegion(selectedServer);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.log(err);
        }
      }
    },
    [
      selectedState,
      selectedCity,
      selectedInstitute,
      saveRegion,
      removeRegion,
      setRegion,
      servers,
    ],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Logo>logo</Logo>
          <Select
            title="Estado"
            placeholder="Selecione o estado"
            options={states}
            setOption={setSelectedState}
          />
          <Select
            title="Cidade"
            placeholder="Selecione a cidade"
            options={cities}
            setOption={setSelectedCity}
          />
          <Select
            title="ONG"
            placeholder="Selecione a ONG"
            options={institutes}
            setOption={setSelectedInstitute}
          />
          <Checkbox name="save" text="Salvar região" />
          <Button type="submit" title="Entrar" />
        </Form>
      </Content>
    </Container>
  );
};

export default Server;
