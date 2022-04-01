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

const Grow = () => {
  const parsedQs = useParsedQueryString();
  const [visible, setVisible] = useState(false);
  const [nowPlante, setNowPlante] = useState<StrengthenPlanetInfo>();
  const [estimatePlante, setEstimatePlante] = useState<StrengthenPlanetInfo>();
  const getPlanetStrengthen = async () => {
    try {
      const res = await Api.PlanetApi.getPlanetStrengthen({
        PlanetID: Number(parsedQs.id),
      });
      if (Api.isSuccess(res)) {
        const { data } = res;
        setNowPlante(data?.now_planet_info);
        setEstimatePlante(data?.estimate_planet_info);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (parsedQs.id) {
      getPlanetStrengthen();
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
                <Button onClick={() => setVisible(true)}>开始培育</Button>
              </TopBox>
              <Extra />
            </Box>
          </Flex>
        </Flex>
      </BgCard>
      <GrowPop visible={visible} onClose={() => setVisible(false)} />
    </Box>
  );
};

export default Grow;
