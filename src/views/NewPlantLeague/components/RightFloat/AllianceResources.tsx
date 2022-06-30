import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, Button, MarkText } from 'uikit';
import { TokenImage } from 'components/TokenImage';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';

const TokenGroupBox = styled(Box)`
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  padding-top: 16px;
  margin-left: -5px;
  position: relative;
`;

const ButtonLeft = styled(Button)`
  width: 100%;
  height: 42px;
  margin: 5px 0;
  padding: 0 26px 0 22px;
  display: block;
  :disabled {
    cursor: auto;
  }
`;

const AllianceResources: React.FC = () => {
  const { t } = useTranslation();
  const { alliance, energy } = useStore(p => p.alliance.allianceView);

  return (
    <TokenGroupBox>
      <ButtonLeft disabled variant='custom'>
        <Flex width='100%' alignItems='center'>
          <Flex alignItems='center' flex={1}>
            <TokenImage width={30} height={32} tokenAddress='ORE' />
            <Text small ml='8px' ellipsis>
              {energy.total_stone}
            </Text>
          </Flex>
          <Text small>{t('Ore')}</Text>
        </Flex>
      </ButtonLeft>
      <ButtonLeft disabled variant='custom'>
        <Flex width='100%' alignItems='center'>
          <Flex alignItems='center' flex={1}>
            <TokenImage width={30} height={32} tokenAddress='SPICES' />
            <Text small ml='8px' ellipsis>
              {energy.total_population}
            </Text>
          </Flex>
          <Text small>{t('Spices')}</Text>
        </Flex>
      </ButtonLeft>
      <ButtonLeft disabled variant='custom'>
        <Flex width='100%' alignItems='center'>
          <Flex alignItems='center' flex={1}>
            <TokenImage width={30} height={32} tokenAddress='ENG' />
            <Text small ml='8px' ellipsis>
              {energy.total_energy}
            </Text>
          </Flex>
          <Text small>{t('Energy')}</Text>
        </Flex>
      </ButtonLeft>
      <Box position='absolute' left='34%' top='4px'>
        <MarkText fontSize='14px' fontStyle='normal' bold>
          {t('行星联盟资源')}
        </MarkText>
      </Box>
    </TokenGroupBox>
  );
};

export default AllianceResources;
