import React, { useEffect, useState } from 'react';
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
import InfoPlane from './components/grow/InfoPlane';
import Extra from './components/grow/Extra';
import { StrengthenPlanetInfo } from './components/grow/type';
import { GrowPop } from './components/grow/growPop';

const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;

const TopBox = styled(Box)`
  height: 81px;
`;

const Grow: React.FC = () => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const { toastError, toastSuccess, toastWarning, toastInfo } = useToast();
  const [visible, setVisible] = useState(false);
  const [nowPlante, setNowPlante] = useState<StrengthenPlanetInfo>();
  const [estimatePlante, setEstimatePlante] = useState<StrengthenPlanetInfo>();
  const [state, setState] = React.useState({
    time: 0,
  });
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
          toastSuccess(t('Nurture success'));
        } else {
          toastError(t('Nurture failure'));
        }
      }
    } catch (error) {
      toastError(t('Fail to accelerate'));
      console.log(error);
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
            toastSuccess(t('Nurture success'));
          } else {
            toastInfo(t('Nurture failure'));
          }
        }
        setState({
          ...state,
          time: data.strengthen_end_time,
        });
      }
    } catch (error) {
      console.log(error);
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
      } else if (res.code === 200016) {
        toastWarning(
          t('Planets in the Planetary Federation cannot be nurtured'),
        );
      } else {
        toastWarning(t('The current planet cannot be cultivated'));
      }
    } catch (error) {
      console.log(error);
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
  }, [state]);

  // useEffect(() => {
  //   if (parsedQs.id) {
  //     getStrengthenResult();
  //   }
  // }, [parsedQs.id]);

  return (
    <Box>
      <BgCard variant='big' padding='50px 33px'>
        <Flex>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={mysteryBoxQualities.SUPER} />
            <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
              <StarCom variant='none' scale='ld' />
            </MysteryBoxStarStyled>
          </MysteryBoxStyled>
          <Flex>
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
                      toastWarning(
                        t('The current planet cannot be cultivated'),
                      );
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
                    : t('Start nurturing')}
                </Button>
              </TopBox>
              <Extra />
            </Box>
          </Flex>
        </Flex>
      </BgCard>
      <GrowPop
        visible={visible}
        onClose={() => setVisible(false)}
        callBack={() => getStrengthenResult()}
      />
    </Box>
  );
};

export default Grow;
