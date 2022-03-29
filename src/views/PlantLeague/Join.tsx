import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import { StarAddBtn } from 'components';

const GalaxyBg = styled(Box)`
  width: 60%;
  height: 80%;
  position: absolute;
  z-index: -1;
  top: 84px;
  left: 150px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const BigStarAddBtn = styled(StarAddBtn)`
  width: 200px !important;
  height: 200px !important;
`;

const StarStyleImg = styled.img`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.goldBorder};
  width: 65%;
`;

const JoinTheAlliance = () => {
  return (
    <Box position='relative' width='40%' padding='0 80px 0 70px'>
      <Flex mb='-36px' alignItems='center' justifyContent='center'>
        <StarAddBtn
          imgBorder
          size='200px'
          url='/images/star/01.jpg'
          No={1}
          Leve='2'
        />
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <StarAddBtn
          imgBorder
          size='200px'
          url='/images/star/05.jpg'
          No={5}
          Leve='2'
        />
        <StarAddBtn
          imgBorder
          size='200px'
          url='/images/star/02.jpg'
          No={2}
          Leve='2'
        />
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <StarAddBtn imgBorder size='200px' No={4} Leve='2' />
        <StarAddBtn imgBorder size='200px' No={3} Leve='2' />
      </Flex>
      <GalaxyBg>
        <img src='/images/planetary_alliance/1.png' alt='' />
      </GalaxyBg>
    </Box>
  );
};

export default JoinTheAlliance;
