import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Image, Text } from 'uikit';
import { useStore } from 'state/util';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useTranslation } from 'contexts/Localization';
import { StrengthenPlanetInfo } from './type';

const TopBox = styled(Flex)`
  width: 160px;
  height: 109px;
  align-items: center;
  justify-content: center;
`;
const TopBox1 = styled(TopBox)`
  background: url('/images/grow/left.png') center left no-repeat;
  text-align: left;
  margin-left: 16px;
`;
const TopBox2 = styled(TopBox)`
  background: url('/images/grow/right.png') center right no-repeat;
  text-align: right;
  margin-right: 16px;
`;

const RightBox = styled(Flex)`
  width: 180px;
  height: 97px;
  align-items: center;
  margin-left: 14px;
`;

const InfoPlane: React.FC<{
  nowPlante: StrengthenPlanetInfo | any;
  estimatePlante: StrengthenPlanetInfo | any;
}> = ({ nowPlante, estimatePlante }) => {
  const { t } = useTranslation();

  return (
    <Card pt='8px' width={434} height={490}>
      <Flex justifyContent='space-between' alignItems='center'>
        <TopBox1>
          <Text bold fontSize='24px' color='legendText'>
            {t('Strengthen')} +{nowPlante?.strengthenLevel}
          </Text>
        </TopBox1>
        <Box width={82}>
          <Image
            width={82}
            height={42}
            src='/images/commons/icon/upgrade.png'
          />
        </Box>
        <TopBox2>
          <Text bold fontSize='24px' color='legendText'>
            {t('Strengthen')} +{estimatePlante?.strengthenLevel}
          </Text>
        </TopBox2>
      </Flex>
      <Flex margin='12px 0' alignItems='center' justifyContent='center'>
        <Flex flex={1} justifyContent='center'>
          <Text fontSize='20px'>
            {t('Looting Speed')} {nowPlante?.plunder_speed}
          </Text>
        </Flex>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <Flex flex={1} justifyContent='center'>
          <Text fontSize='20px'>
            {t('Looting Speed')} {estimatePlante?.plunder_speed}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image width={54} height={54} src='/images/commons/icon/ore.png' />
          <Box>
            <Text color='textTips' fontSize='20px'>
              {t('Ore Capacity')}
            </Text>
            <Text fontSize='22px'>{nowPlante?.oreYield}/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'>{t('Ore Capacity')}</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                {estimatePlante?.oreYield}/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image
            width={54}
            height={54}
            src='/images/commons/icon/population.png'
          />
          <Box>
            <Text color='textTips' fontSize='20px'>
              {t('Population Capacity')}
            </Text>
            <Text fontSize='22px'>{nowPlante?.populationYield}/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'> {t('Population Capacity')}</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                {estimatePlante?.populationYield}/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
      <Flex alignItems='flex-end' justifyContent='center'>
        <RightBox>
          <Image width={54} height={54} src='/images/commons/icon/energy.png' />
          <Box>
            <Text color='textTips' fontSize='20px'>
              {t('Energy Capacity')}
            </Text>
            <Text fontSize='22px'>{nowPlante?.energyYield}/s</Text>
          </Box>
        </RightBox>
        <Box width={47}>
          <Image width={47} height={40} src='/images/commons/icon/next.png' />
        </Box>
        <RightBox>
          <Box>
            <Text fontSize='20px'> {t('Energy Capacity')}</Text>
            <Flex>
              <Image width={33} height={33} src='/images/commons/icon/up.png' />
              <Text fontSize='22px' color='up'>
                {estimatePlante?.energyYield}/s
              </Text>
            </Flex>
          </Box>
        </RightBox>
      </Flex>
    </Card>
  );
};

export default InfoPlane;
