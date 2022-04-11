import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Flex, Text, Image, Progress, Button } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';
import { Link } from 'react-router-dom';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useDispatch } from 'react-redux';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { useImmer } from 'use-immer';
import { useTranslation } from 'contexts/Localization';

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
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { end_time, free_time, alliance, later_extract_time } = useStore(
    p => p.alliance.allianceView,
  );
  const [state, setState] = useImmer({
    time: 0,
    Extracttime: 0,
  });
  let timer = null as any;
  let Extracttimer = null as any;

  const progressRate = useMemo(() => {
    const time = (((end_time - state.time) / end_time) * 100).toFixed(2);
    return Number(time) || 0;
  }, [state]);

  const ExtractResources = useCallback(async () => {
    if (alliance.working !== 0) {
      toastError(t('Stop working to extract'));
      return;
    }
    if (alliance.laterExtractTime > 0) {
      toastError(t('Freezing'));
      return;
    }
    try {
      const res = await Api.AllianceApi.AllianceExtract();
      if (Api.isSuccess(res)) {
        toastSuccess(t('Extraction succeeded'));
      } else {
        toastError(t('Extraction failed'));
      }
    } catch (error) {
      toastError(t('Extraction failed'));
    }
    dispatch(fetchAllianceViewAsync());
  }, [alliance]);

  // 倒计时
  const countDown = () => {
    if (alliance.working <= 0) {
      return;
    }
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState(p => {
          p.time = time - 1;
        });
      } else {
        clearInterval(timer);
        dispatch(fetchAllianceViewAsync());
      }
    }, 1000);
  };

  const ExtractCountDown = () => {
    if (later_extract_time > 0) {
      Extracttimer = setInterval(() => {
        const { Extracttime } = state;
        if (Extracttime > 0) {
          setState(p => {
            p.Extracttime = Extracttime - 1;
          });
        } else {
          clearInterval(Extracttimer);
          dispatch(fetchAllianceViewAsync());
        }
      }, 1000);
    }
  };

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600).toString();
    let min = Math.floor((time % 3600) / 60).toString();
    let sec = (time % 60).toString();
    // if (Number(hour) < 10) {
    //   hour = `0${hour}`;
    //   console.log(hour, min, sec);
    // }
    if (Number(min) < 10) {
      min = `0${min}`;
    }
    if (Number(sec) < 10) {
      sec = `0${sec}`;
    }
    return `${hour}h:${min}:${sec}`;
  };

  useEffect(() => {
    if (alliance.working <= 0) {
      setState({ time: end_time, Extracttime: later_extract_time });
      return;
    }
    setState({ time: free_time, Extracttime: later_extract_time });
  }, [free_time, alliance, end_time, later_extract_time]);

  useEffect(() => {
    countDown();
    ExtractCountDown();
    return () => {
      if (timer) clearInterval(timer);
      if (Extracttimer) clearInterval(Extracttimer);
    };
  }, [state]);

  return (
    <Flex flex='1' flexDirection='column' padding='30px'>
      <Flex mb='20px' justifyContent='center'>
        <Text fontSize='20px'>
          {t('Resource production')}({formatTime(state.time)})
        </Text>
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
        <Button variant='black' onClick={() => ExtractResources()}>
          {later_extract_time > 0
            ? formatTime(state.Extracttime)
            : t('Extract resources')}
        </Button>
        <Link to='/galaxy'>
          <Button variant='black'>{t('Occupy the stars')}</Button>
        </Link>
      </BtnFlex>
    </Flex>
  );
};

export default ProductionProgress;
