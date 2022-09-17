import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const BoxStyle = styled(Box)`
  background: url('/images/planetary_alliance/pool-card.png') no-repeat;
  background-size: 100% 100%;
  width: 518px;
  height: 480px;
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  position: absolute;
  left: -452px;
  top: 0;
  padding: 34px;
  &.out {
    display: none;
    animation: out 1s;
  }
  &.in {
    display: block;
    animation: in 0.5s;
  }
  @keyframes out {
    0% {
      opacity: 1;
    }
    40% {
      opacity: 0.75;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes in {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 0.75;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ScrollBox = styled(Box)`
  overflow-y: auto;
  height: 100%;
  width: 100%;
`;
const RulsText = styled(Text)`
  font-size: 16px;
`;
const HowToPlay: React.FC<{
  ShowPlay: boolean;
  setShowPlay: (e) => void;
}> = ({ ShowPlay, setShowPlay }) => {
  const { t } = useTranslation();

  return (
    <BoxStyle
      className={ShowPlay ? 'in' : 'out'}
      onMouseEnter={() => setShowPlay(true)}
      onMouseLeave={() => setShowPlay(false)}
    >
      <ScrollBox>
        <MarkText mb='20px' fontSize='20px' bold fontStyle='normal'>
          {t('Gameplay – Planet Alliance')}
        </MarkText>
        <Box mb='20px'>
          <RulsText>{t('PlayRules1')}</RulsText>
          <RulsText>{t('PlayRules2')}</RulsText>
          <RulsText>{t('PlayRules3')}</RulsText>
          <RulsText>{t('PlayRules4')}</RulsText>
          <RulsText>{t('PlayRules5')}</RulsText>
          <RulsText>{t('PlayRules6')}</RulsText>
        </Box>
      </ScrollBox>
    </BoxStyle>
  );
};

export default HowToPlay;
