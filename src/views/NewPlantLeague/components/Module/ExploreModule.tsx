import React, { useState, useCallback } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useStore } from 'state';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';

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
  ShowModule: boolean;
  Difficulty: number;
  setDifficulty: (e) => void;
  setFormation: (e) => void;
}> = ({ ShowModule, Difficulty, setDifficulty, setFormation }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();

  const {
    max_work_count,
    now_work_count,
    end_time,
    free_time,
    alliance,
    order,
  } = useStore(p => p.alliance.allianceView);

  // 开始工作
  const StartOrStopWorking = useCallback(async () => {
    await Api.AllianceApi.AllianceWorking({ difficulty: Difficulty })
      .then(res => {
        if (Api.isSuccess(res)) {
          toastSuccess(t('Operate Succeeded'));
          dispatch(fetchAllianceViewAsync());
        }
      })
      .catch(err => {
        toastError(t('Operate Failed'));
        console.error(err);
      });
  }, [toastSuccess, toastError, t, dispatch, Difficulty]);

  return (
    <Box
      display={ShowModule ? 'block' : 'none'}
      className='Exploration_Difficulty'
      zIndex={1}
      position='absolute'
      left={0}
      bottom={-20}
    >
      <OutBox padding='16px'>
        <Flex mb='20px' justifyContent='space-between' alignItems='center'>
          <MarkText fontSize='22px' bold>
            {t('Exploration Difficulty')}
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
                  {t('Easy')}
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
                  {t('Hard')}
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
          <RulesText mb='20px' color='redText'>
            {t('ExploreRules6')}
          </RulesText>
          <Button
            variant='purple'
            width='260px'
            disabled={
              alliance.working !== 0 || max_work_count === now_work_count
            }
            onClick={() => {
              if (ShowModule) {
                if (order?.length === 5) {
                  setFormation(true);
                } else {
                  toastError(t('http-error-200020'));
                  // StartOrStopWorking();
                }
              }
            }}
          >
            <Flex flexDirection='column'>
              <Text color='textPrimary' fontSize='22px'>
                {t('Confirm Exploration')}
              </Text>
            </Flex>
          </Button>
        </RulesFlex>
      </OutBox>
    </Box>
  );
};

export default ExploreModule;
