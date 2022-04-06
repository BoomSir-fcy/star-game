import React, { useState } from 'react';
import { Box, Flex, Text, Button } from 'uikit';
import styled from 'styled-components';
import Modal from 'components/Modal';
import { useStore } from 'state';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import StopWorkPop from '../stopWorkPop';

const ShaDowBox = styled(Flex)`
  height: 180px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 24px 44px;
`;

const InfoFoot = () => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const { alliance } = useStore(p => p.alliance.allianceView);

  // 开始/停止工作
  const StartOrStopWorking = async (work: boolean) => {
    await Api.AllianceApi[work ? 'AllianceWorking' : 'AllianceStopWork']()
      .then(res => {
        if (Api.isSuccess(res)) {
          console.log('成功');
          dispatch(fetchAllianceViewAsync());
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ShaDowBox alignItems='center'>
      <Flex flex='1' flexDirection='column' justifyContent='space-between'>
        <Text mb='20px' shadow='primary' fontSize='28px' bold>
          战斗力 {alliance.power}
        </Text>
        <Box>
          <Text fontSize='22px'>*联盟掠夺出战顺序，将按照序号升序掠夺</Text>
          <Text fontSize='22px'>*超过20%可参与资源掠夺</Text>
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
        {alliance.working > 0 ? '停止工作' : '开始工作'}
      </Button>
      <Modal title='停止工作' visible={visible} setVisible={setVisible}>
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
