import React from 'react';
import styled from 'styled-components';
import { Flex, Box, MarkText, Text } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Container = styled(Box)`
  position: relative;
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  padding-top: 16px;
  margin-left: -5px;
`;

const Warp = styled(Flex)`
  padding: 20px 30px;
`;

const Items = styled(Box)`
  width: 50%;
  height: 30px;
`;

export const PlanetBuff: React.FC<{
  current_buff?: Api.Building.BuildingBuffer;
}> = ({ current_buff }) => {
  const { t } = useTranslation();
  return (
    <Container mt='20px'>
      <Box
        position='absolute'
        left='0'
        right='0'
        top='4px'
        style={{ margin: 'auto', textAlign: 'center' }}
      >
        <MarkText fontSize='14px' fontStyle='normal' bold>
          {t('buff bonus')}
        </MarkText>
      </Box>
      <Warp flexWrap='wrap'>
        <Items>
          <Text>HP: +{current_buff?.hp || 0}</Text>
        </Items>
        <Items>
          <Text>
            {t('Attack')}: +{current_buff?.attack || 0}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('hit')}: +{current_buff?.hit || 0}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('firstMove')}: +{current_buff?.speed || 0}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('dodge')}: +{current_buff?.miss || 0}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('Burst')}: +{current_buff?.critical || 0}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('Defense')}: +{current_buff?.defense || 0}
          </Text>
        </Items>
      </Warp>
    </Container>
  );
};
