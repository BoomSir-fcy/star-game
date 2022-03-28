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
      <Flex alignItems='center' justifyContent='center'>
        <BigStarAddBtn mb='-36px' No={1} Leve='2'>
          <StarStyleImg src='/images/star/01.jpg' />
        </BigStarAddBtn>
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <BigStarAddBtn No={5}>
          <StarStyleImg src='/images/star/05.jpg' />
        </BigStarAddBtn>
        <BigStarAddBtn No={2}>
          <StarStyleImg src='/images/star/02.jpg' />
        </BigStarAddBtn>
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <BigStarAddBtn No={4} mr='50px'>
          <StarStyleImg src='/images/star/04.jpg' />
        </BigStarAddBtn>
        <BigStarAddBtn No={3}>
          <StarStyleImg src='/images/star/03.jpg' />
        </BigStarAddBtn>
      </Flex>
      <GalaxyBg>
        <img src='/images/planetary_alliance/1.png' alt='' />
      </GalaxyBg>
    </Box>
  );
};

export default JoinTheAlliance;
