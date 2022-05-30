import React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { Api } from 'apis';

const Container = styled(Box)`
  width: 237px;
  height: 330px;
  background: #161920;
  border: 1px solid #373c45;
  padding: 15px 25px;
  overflow: scroll;
`;

const Bonus = styled(Box)`
  margin-top: 15px;
`;

export const BuffBonus: React.FC<{
  currentBuff: Api.Building.BuildingBuffer;
}> = ({ currentBuff }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Text bold shadow='primary' small mb='14px'>
        {t('BuffBonus')}
      </Text>
      <Text fontSize='18px' color='textTips'>
        {t('BuffBonustitle')}
      </Text>
      <Bonus>
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
      </Bonus>
    </Container>
  );
};
