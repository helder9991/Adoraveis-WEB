import React, { useCallback, useEffect, useState, useRef } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import {
  Container,
  Slider,
  Navigation,
  Thumbnail,
  ThumbnailImage,
} from './styles';

const Carousel = ({ photos }) => {
  const thumbRef = useRef();

  const [currentPhoto, setCurrentPhoto] = useState();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    setCurrentPhoto(0);
  }, [photos]);

  useEffect(() => {
    setScrollWidth(thumbRef.current.getBoundingClientRect().width);
  }, [thumbRef]);

  const scroll = useCallback(
    pos => {
      let move = scrollPosition + pos;

      if (move < 0) move = 0;
      else if (move > scrollWidth + 250) move = scrollWidth;

      setScrollPosition(move);
      thumbRef.current.scroll(move, 0);
    },
    [scrollPosition, thumbRef, scrollWidth],
  );

  const handleCurrentAnimalPhoto = useCallback(
    index => setCurrentPhoto(index),
    [],
  );

  return (
    <Container>
      <Slider>
        <img src={photos[currentPhoto]} alt="Foto do animal" />
      </Slider>
      <Navigation>
        <button onClick={() => scroll(-250)}>
          <RiArrowLeftSLine size={32} />
        </button>
        <Thumbnail ref={thumbRef}>
          {photos.map((photo, index) => (
            <button key={photo} onClick={() => handleCurrentAnimalPhoto(index)}>
              <ThumbnailImage
                selected={index === currentPhoto}
                src={photo}
                alt={`thumbnail ${index}`}
              />
            </button>
          ))}
        </Thumbnail>
        <button onClick={() => scroll(250)}>
          <RiArrowRightSLine size={32} />
        </button>
      </Navigation>
    </Container>
  );
};

export default Carousel;
