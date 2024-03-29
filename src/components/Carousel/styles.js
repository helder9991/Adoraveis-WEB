import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 100%;

  @media (max-width: 1200px) {
    max-width: 80%;
  }
`;

export const Slider = styled.div`
  display: flex;
  margin: 0 auto;

  img {
    width: 100%;
  }

  @media (max-width: 1200px) {
    img {
      width: 100%;
    }
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  button {
    background: none;

    svg {
      color: ${props => props.theme.colors.icon.primary};
    }
  }

  @media (max-width: 1200px) {
    width: 100%;
  }
`;

export const Thumbnail = styled.div`
  display: flex;
  margin: 25px auto;
  overflow-x: hidden;
  padding: 0 4px 5px;

  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    max-width: 74%;
    overflow-x: scroll;
  }
`;

export const ThumbnailImage = styled.img`
  width: 75px;
  margin-right: 10px;

  border: ${props =>
    props.selected
      ? `4px solid ${props.theme.colors.primary}`
      : `4px solid ${props.theme.colors.background}`};
  border-radius: 2px;

  transition: border 500ms;

  @media (max-width: 1200px) {
    width: 14vw;
  }
`;
