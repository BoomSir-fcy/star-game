import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const BoxStyle = styled(Box)`
  background: url('/images/planetary_alliance/pool-card.png') no-repeat;
  background-size: 100% 100%;
  width: 518px;
  height: 284px;
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
      <MarkText mb='20px' fontSize='20px' bold fontStyle='normal'>
        {t('玩法介绍-行星联盟')}
      </MarkText>
      <Box>
        <RulsText>
          {t('*  行星联盟会在储备5个行星时才能开启星际探索。')}
        </RulsText>
        <RulsText>
          {t(
            '*  开始探索时，经营类建筑开始生成和消耗资源。探索前1.5小时为保护期，后2.5小时进入战争空间，会有遭遇战。',
          )}
        </RulsText>
        <RulsText>
          {t(
            '*  遭遇战时，会随机排出1个行星进行战斗，战斗过的行星进入休整期无法连续参战。',
          )}
        </RulsText>
        <RulsText>{t('*  探索总共为4个小时，开始您的星际探索吧！')}</RulsText>
      </Box>
    </BoxStyle>
  );
};

export default HowToPlay;
