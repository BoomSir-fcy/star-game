import React, { useState } from 'react';
import { Box, Flex, Text, Button } from 'uikit';
import styled from 'styled-components';
import Modal from 'components/Modal';
import { useStore } from 'state';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import StopWorkPop from '../stopWorkPop';

const ShaDowBox = styled(Flex)`
  height: 180px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 24px 44px;
`;

const InfoFoot = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { toastError, toastSuccess } = useToast();

  const [visible, setVisible] = useState(false);
  const { alliance } = useStore(p => p.alliance.allianceView);

  // 开始/停止工作
  const StartOrStopWorking = async (work: boolean) => {
    await Api.AllianceApi[work ? 'AllianceWorking' : 'AllianceStopWork']()
      .then(res => {
        if (Api.isSuccess(res)) {
          toastSuccess(t('Successful operation'));
          dispatch(fetchAllianceViewAsync());
        }
      })
      .catch(err => {
        toastError(t('Operation failed'));
        console.error(err);
      });
  };

  return (
    <ShaDowBox alignItems='center'>
      <Flex flex='1' flexDirection='column' justifyContent='space-between'>
        <Text mb='20px' shadow='primary' fontSize='28px' bold>
          {t('Combat power')} {alliance.power}
        </Text>
        <Box>
          <Text fontSize='22px'>
            *
            {t(
              'Alliance loot battle order, will be looted in ascending order of serial number',
            )}
          </Text>
          <Text fontSize='22px'>
            *{t('More than 20% can participate in resource plunder')}
          </Text>
        </Box>
      </Flex>
      <Button
        variant='stop'
        onClick={() => {
          if (alliance.working > 0) {
            setVisible(true);
          } else {
            // 开始工作
            StartOrStopWorking(true);
          }
        }}
      >
        {alliance.working > 0 ? t('Stop working') : t('Start working')}
      </Button>
      <Modal
        title={t('Stop working')}
        visible={visible}
        setVisible={setVisible}
      >
        <StopWorkPop
          callBack={() => {
            StartOrStopWorking(false);
            setVisible(false);
          }}
        />
      </Modal>
    </ShaDowBox>
  );
};

export default InfoFoot;
