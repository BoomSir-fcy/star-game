import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Card, BgCard, Text, Button, Label } from 'uikit';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Api } from 'apis';
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
  const parsedQs = useParsedQueryString();
  const [visible, setVisible] = useState(false);
  const [nowPlante, setNowPlante] = useState<StrengthenPlanetInfo>();
  const [estimatePlante, setEstimatePlante] = useState<StrengthenPlanetInfo>();
  const [state, setState] = React.useState({
    time: 0,
  });
  let timer = null as any;

  const getStrengthenResult = async () => {
    try {
      const res = await Api.PlanetApi.StrengthenResult({
        planet_id: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        const { data } = res;
        setState({
          ...state,
          time: data.strengthen_end_time,
        });
      }
    } catch (error) {
      console.log(error);
    }
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
      } else {
        getPlanetStrengthen();
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

  React.useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state]);

  useEffect(() => {
    if (parsedQs.id) {
      getPlanetStrengthen();
      getStrengthenResult();
    }
  }, [parsedQs.id]);

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
                <ScoringPanel count={Number(nowPlante?.strengthenLevel)} />
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
                    if (state.time === 0) {
                      setVisible(true);
                    }
                  }}
                >
                  {state.time > 0 ? formatTime(state.time) : '开始培育'}
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
