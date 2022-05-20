import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Card, BgCard, Text, Button, Label } from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import ScoringPanel from 'components/ScoringPanel';
import StarCom from 'components/StarCom';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { storeAction } from 'state';
import { useDispatch } from 'react-redux';
import InfoPlane from './components/grow/InfoPlane';
import Extra from './components/grow/Extra';
import {
  StrengthenPlanetInfo,
  StrengthenConsumeType,
} from './components/grow/type';
import { GrowPop } from './components/grow/growPop';

import 'intro.js/introjs.css';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;

const TopBox = styled(Box)`
  height: 81px;
`;

const Grow: React.FC = () => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const dispatch = useDispatch();
  const { toastError, toastSuccess, toastWarning, toastInfo } = useToast();
  const [visible, setVisible] = useState(false);
  const [nowPlante, setNowPlante] = useState<StrengthenPlanetInfo>();
  const [estimatePlante, setEstimatePlante] = useState<StrengthenPlanetInfo>();
  // 预估强化升级消耗
  const [estimateCost, setEstimateCost] = useState<StrengthenConsumeType>({
    population_consume: 0,
    speedup_consume: 0,
    stone_consume: 0,
    strengthen_time: 0,
  });
  const [state, setState] = React.useState({
    time: 0,
  });

  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = useMemo(
    () => [
      {
        element: '.planet',
        intro: t(
          'Cultivation can greatly improve its combat effectiveness and capacity acquisition, including the growth of various attributes',
        ),
      },
    ],
    [t],
  );
  let timer = null as any;

  const ToStrengthenSpeedUp = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenSpeedUp({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        setState({
          ...state,
          time: 0,
        });
        if (res?.data?.success) {
          toastSuccess(t('Cultivate Succeeded'));
        } else {
          toastError(t('Cultivate Failed'));
        }
      }
    } catch (error) {
      toastError(t('Accelerate Failed'));
      console.error(error);
    }
  };

  const getStrengthenResult = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenResult({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        const { data } = res;
        if (data.strengthen_is_end) {
          if (data.strengthen_is_success) {
            toastSuccess(t('Cultivate Succeeded'));
          } else {
            toastInfo(t('Cultivate Failed'));
          }
        }
        setState({
          ...state,
          time: data.strengthen_end_time,
        });
      }
    } catch (error) {
      console.error(error);
    }
    getPlanetStrengthen();
  };

  const getPlanetStrengthen = async () => {
    try {
      const res = await Api.PlanetApi.getPlanetStrengthen({
        PlanetID: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        const { data } = res;
        setNowPlante(data?.now_planet_info);
        setEstimatePlante(data?.estimate_planet_info);
        setEstimateCost(data);
      }
      // else if (res.code === 200016) {
      //   toastWarning(
      //     t('Planets in the Planet Alliance cannot be cultivated'),
      //   );
      // } else {
      //   toastWarning(t('This planet cannot be cultivated'));
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // 倒计时
  const countDown = () => {
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState({
          ...state,
          time: time - 1,
        });
      } else {
        clearInterval(timer);
        getStrengthenResult();
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
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [state]);

  // useEffect(() => {
  //   if (parsedQs.id) {
  //     getStrengthenResult();
  //   }
  // }, [parsedQs.id]);

  return (
    <Box>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        options={{
          exitOnOverlayClick: false,
          tooltipPosition: 'top',
        }}
        onExit={step => {
          console.log(step);
          setStepsEnabled(false);
          // dispatch(storeAction.toggleVisible({ visible: true }));
        }}
      />
      <BgCard variant='big' padding='50px 33px'>
        <Flex>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={mysteryBoxQualities.SUPER} />
            <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
              <StarCom variant='none' scale='ld' />
            </MysteryBoxStarStyled>
          </MysteryBoxStyled>
          <Flex className='planet'>
            <Box>
              <TopBox>
                <ScoringPanel count={Number(nowPlante?.strengthenLevel) || 0} />
              </TopBox>
              <InfoPlane
                nowPlante={nowPlante}
                estimatePlante={estimatePlante}
              />
            </Box>
            <Box ml='27px'>
              <TopBox>
                <Button
                  onClick={() => {
                    if (!nowPlante?.id) {
                      toastWarning(t('This planet cannot be cultivated'));
                      return;
                    }
                    if (state.time === 0) {
                      setVisible(true);
                      return;
                    }
                    if (state.time > 0) {
                      ToStrengthenSpeedUp();
                    }
                  }}
                >
                  {state.time > 0
                    ? formatTime(state.time)
                    : t('Start Cultivating')}
                </Button>
              </TopBox>
              <Extra />
            </Box>
          </Flex>
        </Flex>
      </BgCard>
      <GrowPop
        visible={visible}
        itemData={estimateCost}
        onClose={() => setVisible(false)}
        callBack={() => getStrengthenResult()}
      />
    </Box>
  );
};

export default Grow;
