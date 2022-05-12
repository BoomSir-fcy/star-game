import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Box } from 'uikit';
import Parallax from 'parallax-js';
import styled from 'styled-components';

const ContainerBg = styled(Box)`
  position: absolute;
  background: url('/images/commons/sky-bg1.jpg');
  background-position: center;
  background-size: cover;
  position: absolute;
  width: 110vw;
  height: 110vh;
  left: -1vw !important;
  top: -1vh !important;
`;

const Flyer = () => {
  const boxRef = useRef(null);

  const [createdPara, setCreatedPara] = useState(false);

  const createParaHandle = useCallback(
    (el: HTMLDivElement) => {
      if (!createdPara) {
        // eslint-disable-next-line
        new Parallax(el);
        setCreatedPara(true);
      }
    },
    [createdPara, setCreatedPara],
  );

  useEffect(() => {
    if (boxRef.current) {
      createParaHandle(boxRef.current);
    }
  }, [boxRef, createParaHandle]);

  return (
    <>
      <Box
        height='100%'
        width='100%'
        position='absolute'
        top={0}
        left={0}
        zIndex={-1}
        ref={boxRef}
      >
        <ContainerBg data-depth='0.1' />
        <Box
          position='absolute'
          width={800}
          height={800}
          top='0'
          left='0'
          right='0'
          bottom='0'
          margin='auto'
        >
          <Image width={800} height={800} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={160}
          height={160}
          data-depth='0.15'
          top='-80px !important'
          left='580px !important'
        >
          <Image width={160} height={160} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={80}
          height={80}
          data-depth='0.16'
          top='auto !important'
          bottom='30px !important'
          left='520px !important'
        >
          <Image width={80} height={80} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={406}
          height={225}
          data-depth='0.2'
          top='80px !important'
          left='1350px !important'
        >
          <Image width={406} height={225} src='/images/login/flyer.png' />
        </Box>
      </Box>
    </>
  );
};

export default Flyer;
