import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { uuid } from 'uuidv4';
import {
  IoMdImages,
  IoIosClose,
  IoIosWater,
  IoMdAdd,
  IoIosEye,
} from 'react-icons/io';

import { useRegion } from '../../hooks/region';
import api from '../../services/api';

import {
  Container,
  Content,
  Title,
  FormContainer,
  Select,
  Select2,
  Input,
  Input2,
  FileInput,
  Thumbnails,
  PhotoInfo,
  Buttons,
  Button,
  Page,
  Row,
  InputsContainer,
  InputContainer,
  AddButton,
  Checkbox,
} from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

const NewAnimal = () => {
  const { region } = useRegion();
  const history = useHistory();

  const formRef = useRef(null);
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [vaccinesInputs, setVaccinesInputs] = useState([]);
  const [observationsInputs, setObservationsInputs] = useState([]);

  const [allAnimals, setAllAnimals] = useState([]);
  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [breedsOptions, setBreedsOptions] = useState([]);

  useEffect(() => {
    api.get('/breeds').then(response => {
      setAllAnimals(response.data);
    });
  }, []);

  const getPhotos = useCallback(() => {
    let selectedPhotos = Array.from(
      formRef.current.getFieldRef('photos').files,
    );

    // Deixa somente 10 fotos
    selectedPhotos.splice(10);

    // remove fotos duplicadas
    selectedPhotos = photos.concat(
      selectedPhotos.filter(item => photos.indexOf(item) < 0),
    );
    setPhotos(selectedPhotos);
  }, [formRef, photos]);

  const handleRemovePhoto = useCallback(
    photoName => {
      const index = photos.findIndex(photo => photo.name === photoName);
      const selectedPhotos = Array.from(photos);
      selectedPhotos.splice(index, 1);
      setPhotos(selectedPhotos);
    },
    [photos],
  );

  const handleAddInput = useCallback(
    input => {
      switch (input) {
        case 'vaccine':
          setVaccinesInputs(vaccinesInputs.concat(uuid()));
          break;
        case 'observation':
          setObservationsInputs(observationsInputs.concat(uuid()));
          break;
        default:
          console.log('Valor invalido');
          break;
      }
    },
    [vaccinesInputs, observationsInputs],
  );

  const handleRemoveInput = useCallback(
    (input, index) => {
      switch (input) {
        case 'vaccine':
          setVaccinesInputs(vaccinesInputs.filter((value, i) => index !== i));
          break;
        case 'observation':
          setObservationsInputs(
            observationsInputs.filter((value, i) => index !== i),
          );
          break;
        default:
          console.log('Valor invalido');
          break;
      }
    },
    [observationsInputs, vaccinesInputs],
  );

  const handleNextPage = useCallback(() => {
    if (page < 3) setPage(page + 1);
  }, [page]);

  const handlePreviusPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  useEffect(() => {
    setAnimalsOptions([...new Set(allAnimals.map(({ animal }) => animal))]);
  }, [allAnimals]);

  const handleShowBreed = useCallback(() => {
    const selectedAnimal = formRef.current.getFieldValue('animal');

    const breedOptions = allAnimals
      .filter(({ animal }) => animal === selectedAnimal)
      .map(({ breed }) => breed);

    setBreedsOptions(breedOptions);
  }, [allAnimals]);

  const handleClearSelect = useCallback(() => {
    formRef.current.setFieldValue('breed', '');
  }, []);

  const handleSubmit = useCallback(
    async data => {
      const page1 = Yup.object().shape({
        category: Yup.string().required('Categoria é obrigatória'),
        photos: Yup.array().min(3).max(10).required(),
      });

      const page2 = Yup.object().shape({
        name: Yup.string().required('Digite o nome do animal'),
        animal: Yup.string().required('Selecione o animal'),
        breed: Yup.string().required('Selecione a raça'),
        port: Yup.string()
          .required()
          .oneOf(['Pequeno', 'Médio', 'Grande'], 'Selecione o porte do animal'),
        years_old: Yup.number().required('Digite a idade do animal'),
      });

      const page3 = Yup.object().shape({
        vaccines: Yup.array().of(Yup.string()),
        observations: Yup.array().of(Yup.string()),
      });
      try {
        switch (page) {
          case 1:
            await page1.validate(
              { ...data, photos },
              {
                abortEarly: false,
              },
            );
            break;
          case 2:
            await page2.validate(data, {
              abortEarly: false,
            });
            break;
          case 3:
            await page3.validate(
              { ...data },
              {
                abortEarly: false,
              },
            );
            // const files = fileRef.current.files;
            const selectedAnimal = allAnimals.filter(
              ({ animal, breed }) =>
                animal === data.animal && breed === data.breed,
            );
            if (selectedAnimal.length === 0) return;
            try {
              // Limpa posicoes vazias do array ''
              data.vaccines = data.vaccines.filter(value => value !== '');
              data.observations = data.observations.filter(
                value => value !== '',
              );

              const formData = new FormData();
              formData.append('name', data.name);
              formData.append('breed_id', selectedAnimal[0].id);
              formData.append('genre', data.genre);
              formData.append('port', data.port);
              formData.append('years_old', data.years_old);
              formData.append('pedigree', data.pedigree ? 'Sim' : 'Não');
              formData.append('castrated', data.castrated ? 'Sim' : 'Não');
              formData.append('category', data.category);
              photos.map(photo => {
                return formData.append('photos', photo);
              });

              // caso haja vacinas
              if (data.vaccines.length > 0) {
                formData.append('vaccines', data.vaccines.toString());
              }

              // caso haja observacoes
              if (data.observations.length > 0) {
                formData.append('observations', data.observations.toString());
              }
              await api.post(`/my/animals/${region.url_param}`, formData);

              toast.info('O cadastro do animal foi realizado com sucesso!');

              history.goBack();
            } catch (err) {
              if (err.isAxiosError) {
                console.log(err.response.data.message);
              }

              toast.info(
                'Ocorreu algum erro. Por favor, tente novamente mais tarde.',
              );
            }

            return;
          default:
            break;
        }

        // Nao deu erro
        handleNextPage();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);

          return;
        }

        toast.error('Ocorreu um erro ao fazer login, cheque as credenciais.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
    [page, photos, handleNextPage, allAnimals, region.url_param, history],
  );

  return (
    <Container>
      <Content>
        <Title>Cadastrar Animal</Title>
        <FormContainer>
          <Form onSubmit={handleSubmit} ref={formRef}>
            {/* Pagina 1 */}
            <Page visible={page === 1}>
              <InputContainer>
                <Select
                  name="category"
                  title="Categoria"
                  placeholder="Selecione a categoria"
                  options={['Adoção', 'Desaparecido']}
                />
              </InputContainer>
              <FileInput>
                <Input
                  name="photos"
                  title="Fotos"
                  type="file"
                  onChange={getPhotos}
                  multiple
                  icon={IoMdImages}
                  disabled={photos.length >= 10}
                />
                <Thumbnails>
                  {photos.map(photo => (
                    <PhotoInfo key={photo.name}>
                      <div>
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={photo.name}
                        />
                        <span>{photo.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.name)}
                      >
                        <IoIosClose size={32} />
                      </button>
                    </PhotoInfo>
                  ))}
                </Thumbnails>
              </FileInput>

              <Buttons>
                <Button title="Proximo" buttonType="next" />
              </Buttons>
            </Page>

            {/* Pagina 2 */}
            <Page visible={page === 2}>
              <InputsContainer>
                <Row>
                  <Select2
                    name="animal"
                    title="Animal"
                    placeholder="Selecione o animal"
                    options={animalsOptions}
                    onChange={handleShowBreed}
                    onClick={handleClearSelect}
                  />

                  <Select2
                    name="breed"
                    title="Raça"
                    placeholder="Selecione a raça"
                    options={breedsOptions}
                  />
                </Row>
                <Row>
                  <Select2
                    name="port"
                    title="Porte"
                    placeholder="Selecione o porte"
                    options={['Pequeno', 'Médio', 'Grande']}
                  />

                  <Input2
                    name="years_old"
                    title="Idade"
                    type="number"
                    min="0"
                    placeholder="Digite a idade do animal"
                  />
                </Row>
                <Row>
                  <Select2
                    name="genre"
                    title="Gênero"
                    placeholder="Selecione o gênero"
                    options={['Macho', 'Fêmea']}
                  />
                  <Input2
                    name="name"
                    title="Nome"
                    placeholder="Digite o nome do animal"
                  />
                </Row>
              </InputsContainer>

              <Checkbox name="castrated" text="Animal castrado" />
              <Checkbox name="pedigree" text="Animal possui pedigree" />

              <Buttons>
                <Button title="Proximo" type="submit" buttonType="next" />
                <Button
                  title="Voltar"
                  buttonType="return"
                  type="button"
                  onClick={handlePreviusPage}
                />
              </Buttons>
            </Page>

            <Page visible={page === 3}>
              <InputContainer>
                <Input
                  name="vaccines[0]"
                  title="Vacinas já tomadas"
                  placeholder="Vacina 1"
                  icon={IoIosWater}
                />
              </InputContainer>
              {vaccinesInputs.map((key, index) => (
                <InputContainer key={key}>
                  <Input
                    name={`vaccines[${index + 1}]`}
                    placeholder={`Vacina ${index + 2}`}
                    icon={IoIosWater}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInput('vaccine', index)}
                  >
                    <IoIosClose size={36} />
                  </button>
                </InputContainer>
              ))}
              <AddButton
                type="button"
                onClick={() => handleAddInput('vaccine')}
              >
                <IoMdAdd size={32} />
                <span>Adicionar uma nova vacina</span>
              </AddButton>

              <InputContainer>
                <Input
                  name="observations[0]"
                  title="Observações"
                  placeholder="Observações 1"
                  icon={IoIosEye}
                />
              </InputContainer>

              {observationsInputs.map((key, index) => (
                <InputContainer key={key}>
                  <Input
                    name={`observations[${index + 1}]`}
                    placeholder={`Observações ${index + 2}`}
                    icon={IoIosEye}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInput('observation', index)}
                  >
                    <IoIosClose size={36} />
                  </button>
                </InputContainer>
              ))}
              <AddButton
                type="button"
                onClick={() => handleAddInput('observation')}
              >
                <IoMdAdd size={32} />
                <span>Adicionar uma nova observação</span>
              </AddButton>

              <Buttons>
                <Button title="Cadastrar" buttonType="confirm" />
                <Button
                  title="Voltar"
                  buttonType="return"
                  type="button"
                  onClick={handlePreviusPage}
                />
              </Buttons>
            </Page>
          </Form>
        </FormContainer>
        {/* <Button title="Proximo" /> */}
      </Content>
    </Container>
  );
};

export default NewAnimal;
