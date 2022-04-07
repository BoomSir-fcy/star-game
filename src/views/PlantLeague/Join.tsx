import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import { StarAddBtn } from 'components';
import { useStore } from 'state/util';
import { qualities } from 'uikit/theme/types';

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
  const navigate = useNavigate();
  const { order: allianceList } = useStore(p => p.alliance.allianceView);

  const addStar = (id: number) => {
    navigate(`/star/planet?choose=${id || 1}`);
  };

  return (
    <Box position='relative' width='40%' padding='0 80px 0 70px'>
      <Flex mb='-36px' alignItems='center' justifyContent='center'>
        <StarAddBtn
          callBack={() => addStar(allianceList[0]?.planetId)}
          imgBorder={
            (allianceList && allianceList[0]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[0]?.planet ? '/images/star/01.jpg' : ''
          }
          No={1}
          Leve={(allianceList && allianceList[0]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <StarAddBtn
          callBack={() => addStar(allianceList[4]?.planetId)}
          imgBorder={
            (allianceList && allianceList[4]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[4]?.planet ? '/images/star/05.jpg' : ''
          }
          No={5}
          Leve={(allianceList && allianceList[4]?.planet?.level) || ''}
        />
        <StarAddBtn
          callBack={() => addStar(allianceList[1]?.planetId)}
          imgBorder={
            (allianceList && allianceList[1]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[1]?.planet ? '/images/star/02.jpg' : ''
          }
          No={2}
          Leve={(allianceList && allianceList[1]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <StarAddBtn
          callBack={() => addStar(allianceList[3]?.planetId)}
          imgBorder={
            (allianceList && allianceList[3]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[3]?.planet ? '/images/star/04.jpg' : ''
          }
          No={4}
          Leve={(allianceList && allianceList[3]?.planet?.level) || ''}
        />
        <StarAddBtn
          callBack={() => addStar(allianceList[2]?.planetId)}
          imgBorder={
            (allianceList && allianceList[2]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[2]?.planet ? '/images/star/03.jpg' : ''
          }
          No={3}
          Leve={(allianceList && allianceList[2]?.planet?.level) || ''}
        />
      </Flex>
      <GalaxyBg>
        <img src='/images/planetary_alliance/1.png' alt='' />
      </GalaxyBg>
    </Box>
  );
};

export default JoinTheAlliance;
