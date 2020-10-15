import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';

import Carousel from '../../components/Carousel';

import { useRegion } from '../../hooks/region';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  AnimalData,
  AnimalDetails,
  AnimalNote,
  AnimalNotes,
  Button,
  Buttons,
  CarouselContainer,
  Card,
  Content,
  Container,
  Description,
  Info,
  Message,
  Modal,
  ModalBackground,
  ModalButtons,
  OwnerInfo,
  OwnerData,
  RowCard,
  RowButtons,
  TipsList,
  Title,
} from './styles';

const Animal = () => {
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { region } = useRegion();

  const [animal, setAnimal] = useState([]);
  const [currentModal, setCurrentModal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (params.id) {
      api
        .get(`/${region.url_param}/animals/${params.id}`)
        .then(response => {
          setAnimal({ id: params.id, ...response.data });
        })
        .catch(err => {
          setLoading(false);
          throw toast.error('Algo deu errado na busca por este animal');
        });
    }
    if (location.state) {
      if (Object.prototype.hasOwnProperty.call(location.state, 'owner'))
        setOwner(true);

      if (Object.prototype.hasOwnProperty.call(location.state, 'adopted'))
        setAdopted(true);
    }
    setLoading(false);
  }, [params.id, region.url_param, location.state]);

  const handleOpenModal = useCallback(() => {
    // Usuario nao logado
    if (!user) history.push('/login');

    setModalIsOpen(true);
  }, [history, user]);

  const handleCloseModal = useCallback(() => {
    setCurrentModal(1);
    setModalIsOpen(false);
  }, []);

  const handleNextModal = useCallback(() => {
    setCurrentModal(2);
  }, []);

  const handleBackPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleDeleteAnimal = useCallback(async () => {
    if (window.confirm('Deseja realmente excluir este animal?')) {
      try {
        await api.delete(`/my/animals/${animal.id}`);

        toast.info('O animal foi excluido com sucesso!');

        history.replace('/profile/my-animals');
      } catch (err) {
        if (err.isAxiosError) {
          switch (err.response.data.message) {
            case 'Animal does not exists.':
              return toast.error('Este animal não existe.');
            case 'Permission denied.':
              return toast.error(
                'Você não tem permissão para realizar esta ação.',
              );
            default:
              return toast.error(
                'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
              );
          }
        }

        toast.error(
          'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        );
      }
    }
  }, [animal, history]);

  const handleAdoptAnimal = useCallback(async () => {
    if (window.confirm('Deseja realmente colocar este animal como adotado?')) {
      try {
        await api.patch(`/my/animals/adopt/${animal.id}`);

        toast.info('O animal marcado como adotado!');

        history.replace('/profile/my-animals');
      } catch (err) {
        if (err.isAxiosError) {
          switch (err.response.data.message) {
            case 'Animal does not exists.':
              return toast.error('Este animal não existe.');
            case 'Permission denied.':
              return toast.error(
                'Você não tem permissão para realizar esta ação.',
              );
            default:
              return toast.error(
                'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
              );
          }
        }

        toast.error(
          'Aconteceu algum erro inesperado, por favor, aguarde alguns instantes ou entre em contato.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        );
      }
    }
  }, [history, animal]);

  return (
    <>
      {animal.length !== 0 &&
      modalIsOpen &&
      (currentModal === 1 || currentModal === 2) ? (
        <ModalBackground data-testid="modal-container">
          {currentModal === 1 ? (
            <Modal height="400px">
              <h1>Aviso para conhecer o animal</h1>

              <TipsList>
                <li>
                  <strong>
                    De preferencia em marcar um encontro com o dono do animal em
                    um local publico com alta movimentação de pessoas.
                  </strong>
                </li>
              </TipsList>
              <ModalButtons>
                <Button
                  title="Proximo"
                  onClick={handleNextModal}
                  data-testid="button-next-modal"
                />
                <Button
                  title="Fechar"
                  buttonType="return"
                  onClick={handleCloseModal}
                  data-testid="button-close-modal"
                />
              </ModalButtons>
            </Modal>
          ) : (
            <Modal height="300px">
              <h1>Informações do responsável</h1>

              <OwnerInfo>
                <OwnerData>
                  <strong>Dono: </strong>
                  <span>{animal.user.name}</span>
                </OwnerData>
                <OwnerData>
                  <strong>Telefone: </strong>
                  <span>{animal.user.phone}</span>
                </OwnerData>
              </OwnerInfo>
              <Button
                title="Fechar"
                buttonType="return"
                onClick={handleCloseModal}
                data-testid="button-close-modal"
              />
            </Modal>
          )}
        </ModalBackground>
      ) : null}

      <Container>
        <Content>
          <Title>Dados do Animal</Title>

          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 25,
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Info>
            {animal.length !== 0 ? (
              <>
                <AnimalData>
                  <AnimalDetails>
                    <CarouselContainer>
                      <Carousel photos={animal.photos} />
                    </CarouselContainer>
                    <Description>
                      <RowCard>
                        <Card>
                          <h1>Nome</h1>
                          <span>{animal.name}</span>
                        </Card>
                        <Card>
                          <h1>Animal</h1>
                          <span>{animal.breed.animal}</span>
                        </Card>
                      </RowCard>
                      <RowCard>
                        <Card>
                          <h1>Raça</h1>
                          <span>{animal.breed.breed}</span>
                        </Card>
                        <Card>
                          <h1>Porte</h1>
                          <span>{animal.port}</span>
                        </Card>
                      </RowCard>
                      <RowCard>
                        <Card>
                          <h1>Sexo</h1>
                          <span>{animal.genre}</span>
                        </Card>
                        <Card>
                          <h1>Idade</h1>
                          <span>{animal.years_old}</span>
                        </Card>
                      </RowCard>
                      <RowCard>
                        <Card>
                          <h1>Pedigree</h1>
                          <span>{animal.pedigree}</span>
                        </Card>
                        <Card>
                          <h1>Castrado</h1>
                          <span>{animal.castrated}</span>
                        </Card>
                      </RowCard>
                    </Description>
                  </AnimalDetails>
                  <AnimalNotes>
                    {animal.observation.length > 0 && (
                      <>
                        <hr />
                        <AnimalNote>
                          <h1>Observacoes</h1>
                          <div>
                            {animal.observation.map(({ observation }) => (
                              <li>{observation}</li>
                            ))}
                          </div>
                        </AnimalNote>
                      </>
                    )}
                    {animal.vaccine.length > 0 && (
                      <>
                        <hr />
                        <AnimalNote>
                          <h1>Vacinas</h1>
                          <div>
                            {animal.vaccine.map(({ name }) => (
                              <li>{name}</li>
                            ))}
                          </div>
                        </AnimalNote>
                      </>
                    )}
                  </AnimalNotes>
                </AnimalData>

                {/* Exlcluir ou Adotar */}
                {owner && (
                  <Buttons>
                    {!adopted && (
                      <RowButtons>
                        <Button
                          title="Excluir"
                          buttonType="danger"
                          onClick={handleDeleteAnimal}
                          data-testid="button-delete"
                        />
                        <Button
                          title="Adotado"
                          buttonType="confirm"
                          disabled={!animal.verified_at && !animal.adopted_at}
                          onClick={handleAdoptAnimal}
                          data-testid="button-adopt"
                        />
                      </RowButtons>
                    )}
                    <Button
                      title="Voltar"
                      buttonType="return"
                      onClick={handleBackPage}
                      data-testid="button-return"
                    />
                  </Buttons>
                )}

                {!owner && (
                  <Buttons>
                    <Button
                      title="Entrar em contato"
                      onClick={handleOpenModal}
                      data-testid="button-open-modal"
                    />
                    <Button
                      title="Voltar"
                      buttonType="return"
                      onClick={handleBackPage}
                      data-testid="button-previous-page"
                    />
                  </Buttons>
                )}
              </>
            ) : (
              !loading && (
                <Message data-testid="error-message">
                  Este animal não está disponivel no momento ou não existe.
                </Message>
              )
            )}
          </Info>
        </Content>
      </Container>
    </>
  );
};

export default Animal;
