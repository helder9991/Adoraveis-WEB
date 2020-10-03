import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import Carousel from '../../components/Carousel';

import { useRegion } from '../../hooks/region';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  ModalBackground,
  Modal,
  OwnerInfo,
  OwnerData,
  TipsList,
  ModalButtons,
  Content,
  Title,
  AnimalData,
  Info,
  CarouselContainer,
  Description,
  Card,
  Buttons,
  Button,
  Message,
} from './styles';

const Animal = () => {
  const { region } = useRegion();
  const location = useLocation();
  const history = useHistory();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [animal, setAnimal] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(1);

  useEffect(() => {
    setLoading(true);
    if (!location.state) return;
    api
      .get(`/${region.url_param}/animals/${location.state.id}`)
      .then(response => {
        setAnimal(response.data);
      });
    setLoading(false);
  }, [location.state, region]);

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

  return (
    <>
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
      {animal.length !== 0 &&
      modalIsOpen &&
      (currentModal === 1 || currentModal === 2) ? (
        <ModalBackground>
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
                <Button title="Proximo" onClick={handleNextModal} />
                <Button
                  title="Fechar"
                  buttonType="return"
                  onClick={handleCloseModal}
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
              />
            </Modal>
          )}
        </ModalBackground>
      ) : null}

      <Container>
        <Content>
          <Title>Dados do Animal</Title>
          <Info>
            {animal.length !== 0 ? (
              <>
                <AnimalData>
                  <CarouselContainer>
                    <Carousel photos={animal.photos} />
                  </CarouselContainer>
                  <Description>
                    <Card>
                      <h1>Nome</h1>
                      <span>{animal.name}</span>
                    </Card>
                    <Card>
                      <h1>Animal</h1>
                      <span>{animal.breed.animal}</span>
                    </Card>
                    <Card>
                      <h1>Raca</h1>
                      <span>{animal.breed.breed}</span>
                    </Card>
                    <Card>
                      <h1>Porte</h1>
                      <span>{animal.port}</span>
                    </Card>
                    <Card>
                      <h1>Sexo</h1>
                      <span>{animal.genre}</span>
                    </Card>
                    <Card>
                      <h1>Idade</h1>
                      <span>{animal.years_old}</span>
                    </Card>
                    <Card>
                      <h1>Pedigree</h1>
                      <span>{animal.pedigree}</span>
                    </Card>
                    <Card>
                      <h1>Castrado</h1>
                      <span>{animal.castrated}</span>
                    </Card>
                  </Description>
                </AnimalData>

                <Buttons>
                  <Button title="Entrar em contato" onClick={handleOpenModal} />
                  <Button
                    title="Voltar"
                    buttonType="return"
                    onClick={handleBackPage}
                  />
                </Buttons>
              </>
            ) : (
              !loading && (
                <Message>
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
