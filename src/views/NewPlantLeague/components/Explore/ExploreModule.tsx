import React, { useState } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';

const ChooseFlex = styled(Flex)`
  height: 100%;
  background: url('/images/planetary_alliance/bg.png') no-repeat;
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
  padding: 5px;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const ChooseBtn = styled(Button)<{ showBg: boolean }>`
  width: 100%;
  padding: 0;
  font-size: 18px;
  height: 45px;
  background: ${({ showBg }) =>
      showBg ? 'url(/images/commons/btn/blue-round.png)' : 'transparent'}
    no-repeat;
  background-size: 100% 100%;
  border: none;
  box-shadow: none;
`;

const RulesFlex = styled(Flex)`
  height: 100%;
  width: 65%;
  margin-left: 28px;
  flex-direction: column;
  justify-content: space-around;
`;

const RulesText = styled(Text)`
  font-size: 16px;
`;

const ExploreModule: React.FC<{
  Difficulty: number;
  setDifficulty: (e) => void;
}> = ({ Difficulty, setDifficulty }) => {
  const { t } = useTranslation();
  return (
    <Box zIndex={1} position='absolute' left={0} bottom={-20}>
      <BgCard variant='Sl' padding='30px'>
        <MarkText mb='10px' fontSize='22px' bold>
          {t('探索难度')}
        </MarkText>
        <Flex height='156px' justifyContent='space-between' alignItems='center'>
          <ChooseFlex>
            <ChooseBtn
              showBg={Difficulty === 0}
              onClick={() => setDifficulty(0)}
            >
              {t('一般')}
            </ChooseBtn>
            <ChooseBtn
              showBg={Difficulty === 1}
              onClick={() => setDifficulty(1)}
            >
              {t('普通')}
            </ChooseBtn>
            <ChooseBtn
              showBg={Difficulty === 2}
              onClick={() => setDifficulty(2)}
            >
              {t('高级')}
            </ChooseBtn>
          </ChooseFlex>
          <RulesFlex>
            <Box>
              <RulesText>
                {t('*  探索难度决定了您的收益及资源的多少。')}
                <span style={{ color: '#4FFFFB' }}>
                  {t('(简单25%，一般30%，困难35%)')}
                </span>
              </RulesText>
              <RulesText>
                {t('*  当然不同难度的探索也会遭遇更强的对手。')}
              </RulesText>
              <RulesText>
                {t('*  合理的管理行星，会加强自己的战斗能力。')}
              </RulesText>
              <RulesText>{t('*  战斗的部署策略也能让你脱颖而出。')}</RulesText>
            </Box>
            <RulesText color='redText'>
              {t('探索耗时：4小时(不可取消)')}
            </RulesText>
          </RulesFlex>
        </Flex>
      </BgCard>
    </Box>
  );
};

export default ExploreModule;
