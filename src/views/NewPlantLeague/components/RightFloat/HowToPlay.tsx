import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const BoxStyle = styled(Box)`
  background: url('/images/planetary_alliance/pool-card.png') no-repeat;
  background-size: 100% 100%;
  width: 518px;
  /* height: 480px; */
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
      <Box mb='20px'>
        <RulsText>
          {t(
            '* 行星联盟是参与星际探索和占领恒星玩法的基本单位，一个行星联盟由五个且只能五个行星组成',
          )}
        </RulsText>
        <RulsText>
          {t(
            '* 通过星际探索，行星上的建筑会全部处于工作状态，比如：资源类建筑开始工作获取、部队培训基地会开始培训兵种......同时每个建筑也会同步消耗资源以维持工作状态。',
          )}
        </RulsText>
        <RulsText>
          {t(
            '* 需提醒的是选择不同难度将得到不同的资源奖励系数，同时也会根据难度选择匹配到正在进行星际探索的不同实力的联盟触发遭遇战，胜利将掠夺更多的资源，失败则会扣除一部分资源给胜利方。',
          )}
        </RulsText>
        <RulsText>
          {t(
            '* 开始探索时，前1.5小时为保护期，后2.5小时进入战争空间，可能触发遭遇战',
          )}
        </RulsText>
        <RulsText>
          {t(
            '* 遭遇战时，会随机抽取行星联盟中的行星进行战斗，按照战斗结果，获得/损失各种资源。战斗失败会消耗耐久。',
          )}
        </RulsText>
        <RulsText>{t('* 探索总共为4个小时，开始您的星际探索吧！')}</RulsText>
      </Box>
    </BoxStyle>
  );
};

export default HowToPlay;
