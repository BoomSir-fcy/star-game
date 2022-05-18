import React from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import Addition from './addition';
import ProductionProgress from './productionProgress';
import InfoFoot from './infoFoot';

const InfoCard = styled(Flex)`
  background: url('/images/planetary_alliance/CardBg.png') no-repeat;
  background-size: 100% 100%;
  width: 48%;
  height: 350px;
  padding: 22px 10px 8px;
`;

const Centent = styled(Flex)`
  background: ${({ theme }) => theme.colors.backgroundCard};
  width: 100%;
`;

const LeagueInfo = () => {
  return (
    <Flex
      flex='1'
      flexDirection='column'
      justifyContent='space-between'
      className='planet_info'
    >
      <Flex flex='1' justifyContent='space-between' alignItems='center'>
        <InfoCard>
          <Centent flex='1'>
            <Addition />
          </Centent>
        </InfoCard>
        <InfoCard>
          <Centent flex='1'>
            <ProductionProgress />
          </Centent>
        </InfoCard>
      </Flex>
      <InfoFoot />
    </Flex>
  );
};

export default LeagueInfo;
