import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// import Select from '../../components/Select';
import Checkbox from '../../components/Checkbox';

import getValidationErrors from '../../utils/getValidationErrors';
import { useRegion } from '../../hooks/region';
import api from '../../services/api';

import Logo from '../../images/adoraveis.svg';

import { Container, Content, Select, Button } from './styles';

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
    formRef.current.setFieldValue('institute', '');
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

        const validRegion = servers.find(
          ({ state, city, institute }) =>
            state === data.state &&
            city === data.city &&
            institute === data.institute,
        );

        if (!validRegion) throw Error('Local invalido');

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
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);
        }
        toast.error('Campos preenchidos inválidos, tente novamente.');
      }
    },
    [saveRegion, removeRegion, setRegion, servers],
  );

  return (
    <Container>
      <Content>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <img src={Logo} alt="Adoraveis" />
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
