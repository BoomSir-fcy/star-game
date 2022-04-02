import React, { useState, useEffect, useMemo } from 'react';
import { Box, Flex, Text, Image, Progress, Button } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useDispatch } from 'react-redux';

const ProgressBox = styled(Box)`
  position: relative;
  border: 2px solid #2396ad;
`;

const ProgressImage = styled(Image)`
  position: absolute;
  left: -15px;
  top: -8px;
`;

const ProgressTextBox = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const BtnFlex = styled(Flex)``;

const ProductionProgress = () => {
  const dispatch = useDispatch();
  const { end_time, free_time, alliance } = useStore(
    p => p.alliance.allianceView,
  );
  const [state, setState] = useState({
    time: 0,
  });
  let timer = null as any;

  const progressRate = useMemo(() => {
    const time = (((end_time - state.time) / end_time) * 100).toFixed(2);
    return Number(time);
  }, [state]);

  // 倒计时
  const countDown = () => {
    if (alliance.working <= 0) {
      return;
    }
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState({
          ...state,
          time: time - 1,
        });
      } else {
        clearInterval(timer);
        dispatch(fetchAllianceViewAsync());
      }
    }, 1000);
  };

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h:${min}m:${sec}s`;
  };

  useEffect(() => {
    if (alliance.working <= 0) {
      setState({
        time: end_time,
      });
      return;
    }
    setState({
      time: free_time,
    });
  }, [free_time, alliance]);

  useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state]);

  return (
    <Flex flex='1' flexDirection='column' padding='30px'>
      <Flex mb='20px' justifyContent='center'>
        <Text fontSize='20px'>资源生产({formatTime(state.time)})</Text>
      </Flex>
      <ProgressBox mb='56px' ml='15px'>
        <Progress
          color='progressBar'
          variant='flat'
          scale='lg'
          primaryStep={progressRate}
        />
        <ProgressImage
          src='/images/planetary_alliance/progress.png'
          width={235}
          height={75}
        />
        <ProgressTextBox>
          <Flex height='100%' justifyContent='center' alignItems='center'>
            <Text fontSize='22px' shadow='primary'>
              {progressRate}%
            </Text>
          </Flex>
        </ProgressTextBox>
      </ProgressBox>
      <BtnFlex justifyContent='space-between'>
        <Button variant='black'>掠夺资源</Button>
        <Button variant='black'>占领恒星</Button>
      </BtnFlex>
    </Flex>
  );
};

export default ProductionProgress;
