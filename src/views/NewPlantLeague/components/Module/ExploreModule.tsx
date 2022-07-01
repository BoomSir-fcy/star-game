import React, { useState } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';

const OutBox = styled(Box)`
  width: 682px;
  height: max-content;
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
        <Flex mb='20px' justifyContent='space-between' alignItems='center'>
          <MarkText fontSize='22px' bold>
            {t('Difficulty to explore')}
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
                  {t('Simple')}
                </Text>
              </ChooseBtn>
              <ChooseBtn
                variant={Difficulty === 1 ? 'purple' : 'text'}
                onClick={() => setDifficulty(1)}
              >
                <Text color='textPrimary' fontSize='16px' bold>
                  {t('Generally')}
                </Text>
              </ChooseBtn>
              <ChooseBtn
                variant={Difficulty === 2 ? 'purple' : 'text'}
                onClick={() => setDifficulty(2)}
              >
                <Text color='textPrimary' fontSize='16px' bold>
                  {t('Advanced')}
                </Text>
              </ChooseBtn>
            </ChooseFlex>
          </GraphicsCard>
        </Flex>
        <RulesFlex>
          <Box mb='20px'>
            <RulesText>
              {t('ExploreRules1')}
              <span style={{ color: '#4FFFFB' }}>{t('ExploreRules2')}</span>
            </RulesText>
            <RulesText>{t('ExploreRules3')}</RulesText>
            <RulesText>{t('ExploreRules4')}</RulesText>
            <RulesText>{t('ExploreRules5')}</RulesText>
          </Box>
          <RulesText color='redText'>{t('ExploreRules6')}</RulesText>
        </RulesFlex>
      </OutBox>
    </Box>
  );
};

export default ExploreModule;
