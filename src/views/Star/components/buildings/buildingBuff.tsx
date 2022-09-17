import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Items = styled(Flex)`
  width: calc(100% / 3);
  flex-direction: column;
  margin-bottom: 15px;
`;

export const BuildingBuff: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  const { t } = useTranslation();
  const { ak_bonus_machine } = currnet_building;

  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
        {t('BUFF Details')}
      </MarkText>
      <Flex flexWrap='wrap'>
        <Items>
          <Text color='textSubtle'>HP</Text>
          <Text mt='2px'>+{ak_bonus_machine?.hp || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('Attack')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.attack || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('hit')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.hit || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('firstMove')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.speed || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('dodge')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.miss || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('Burst')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.critical || 0}</Text>
        </Items>
        <Items>
          <Text color='textSubtle'>{t('Defense')}</Text>
          <Text mt='2px'>+{ak_bonus_machine?.defense || 0}</Text>
        </Items>
      </Flex>
    </Box>
  );
};
