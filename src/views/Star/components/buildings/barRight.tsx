import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, MarkText } from 'uikit';

import { useTranslation } from 'contexts/Localization';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { BarCard } from './barCard';
import { BarHead } from './barHead';
import { PlanetAssets } from './planetAssets';
import { PlanetBuff } from './planetBuff';

const BarLayout = styled(Box)`
  position: fixed;
  right: 0;
  top: 0%;
`;

export const BarRight = () => {
  const { t } = useTranslation();

  const parsedQs = useParsedQueryString();
  const id = Number(parsedQs.id);
  const planetInfo = useStore(p => p.planet.planetInfo[id ?? 0]);

  return (
    <BarLayout>
      <Flex flexDirection='column' alignItems='flex-end'>
        <BarHead plant_info={planetInfo} />
        <BarCard title={t('星球升級')}>
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              Lv{planetInfo?.level}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard title={t('星球培育')}>
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              +1
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard title={t('战斗布阵')}>
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              3
            </MarkText>
          </Flex>
        </BarCard>
        <Box mt='50px'>
          <PlanetAssets plant_info={planetInfo} />
          <PlanetBuff />
        </Box>
      </Flex>
    </BarLayout>
  );
};
