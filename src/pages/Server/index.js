import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// import Select from '../../components/Select';
import Checkbox from '../../components/Checkbox';

import { useRegion } from '../../hooks/region';

import api from '../../services/api';

import { Container, Logo, Content, Select, Button } from './styles';

const Server = () => {
  const formRef = useRef();

  const { setRegion, saveRegion, removeRegion } = useRegion();

  const [servers, setServers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [institutes, setInstitutes] = useState([]);

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

  const handleShowCities = useCallback(() => {
    const selectedState = formRef.current.getFieldValue('state');
    const citiesOptions = servers
      .filter(({ state }) => state === selectedState)
      .map(({ city }) => city);
    setCities([...new Set(citiesOptions)]);
  }, [formRef, servers]);

  const handleShowInstitutes = useCallback(() => {
    const selectedCity = formRef.current.getFieldValue('city');
    const instituteOptions = servers
      .filter(({ city }) => city === selectedCity)
      .map(({ institute }) => institute);
    setInstitutes([...new Set(instituteOptions)]);
  }, [formRef, servers]);

  const handleSubmit = useCallback(
    async data => {
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
            server.state === data.state &&
            server.city === data.city &&
            server.institute === data.institute,
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
    [saveRegion, removeRegion, setRegion, servers],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Logo>logo</Logo>
          <Select
            name="state"
            title="Estado"
            placeholder="Selecione o estado"
            options={states}
            onChange={handleShowCities}
          />
          <Select
            name="city"
            title="Cidade"
            placeholder="Selecione a cidade"
            options={cities}
            onChange={handleShowInstitutes}
          />
          <Select
            name="institute"
            title="ONG"
            placeholder="Selecione a ONG"
            options={institutes}
          />
          <Checkbox name="save" text="Salvar região" />
          <Button type="submit" title="Entrar" />
        </Form>
      </Content>
    </Container>
  );
};

export default Server;
