import React from 'react';
import styled from 'styled-components';
import { Box, MarkText, Text } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Container = styled(Box)`
  position: relative;
`;

export const PlanetBuff: React.FC<{
  currentBuff?: Api.Building.BuildingBuffer;
}> = ({ currentBuff }) => {
  const { t } = useTranslation();
  return (
    <Container mt='20px'>
      <Box position='absolute' left='34%' top='4px'>
        <MarkText fontSize='14px' fontStyle='normal' bold>
          {t('BUFF加成')}
        </MarkText>
      </Box>
      <Box>
        <Text fontSize='18px'>HP: +{currentBuff?.hp || 0}</Text>
        <Text fontSize='18px'>
          {t('Attack')}: +{currentBuff?.attack || 0}
        </Text>
        <Text fontSize='18px'>
          {t('hit')}: +{currentBuff?.hit || 0}
        </Text>
        <Text fontSize='18px'>
          {t('firstMove')}: +{currentBuff?.speed || 0}
        </Text>
        <Text fontSize='18px'>
          {t('dodge')}: +{currentBuff?.miss || 0}
        </Text>
        <Text fontSize='18px'>
          {t('Burst')}: +{currentBuff?.critical || 0}
        </Text>
        <Text fontSize='18px'>
          {t('Defense')}: +{currentBuff?.defense || 0}
        </Text>
      </Box>
    </Container>
  );
};
