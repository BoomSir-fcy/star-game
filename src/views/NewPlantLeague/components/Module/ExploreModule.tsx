import React, { useState } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';

const OutBox = styled(Box)`
  width: 682px;
  height: 264px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
`;

const ChooseFlex = styled(Flex)`
  height: 100%;
  width: 366px;
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
  padding: 5px;
  justify-content: space-between;
  flex: 1;
`;

const ChooseBtn = styled(Button)`
  width: 100%;
  padding: 0;
  font-size: 18px;
  height: 40px;
`;

const RulesFlex = styled(Flex)`
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
      <OutBox padding='16px'>
        <Flex mb='30px' justifyContent='space-between' alignItems='center'>
          <MarkText fontSize='22px' bold>
            {t('探索难度')}
          </MarkText>
          <GraphicsCard
            style={{ padding: 0 }}
            width='max-content'
            height='max-content'
            stripe
          >
            <ChooseFlex>
              <ChooseBtn
                variant={Difficulty === 0 ? 'purple' : 'text'}
                onClick={() => setDifficulty(0)}
              >
                <Text color='textPrimary' fontSize='16px' bold>
                  {t('一般')}
                </Text>
              </ChooseBtn>
              <ChooseBtn
                variant={Difficulty === 1 ? 'purple' : 'text'}
                onClick={() => setDifficulty(1)}
              >
                <Text color='textPrimary' fontSize='16px' bold>
                  {t('普通')}
                </Text>
              </ChooseBtn>
              <ChooseBtn
                variant={Difficulty === 2 ? 'purple' : 'text'}
                onClick={() => setDifficulty(2)}
              >
                <Text color='textPrimary' fontSize='16px' bold>
                  {t('高级')}
                </Text>
              </ChooseBtn>
            </ChooseFlex>
          </GraphicsCard>
        </Flex>
        <RulesFlex>
          <Box mb='20px'>
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
      </OutBox>
    </Box>
  );
};

export default ExploreModule;
